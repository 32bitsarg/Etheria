import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();
        if (!player) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await (prisma as any).exchangeOrder.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.playerId !== player.id) {
            return NextResponse.json({ error: 'Unauthorized to cancel this order' }, { status: 403 });
        }

        if (order.status !== 'OPEN' && order.status !== 'PARTIAL') {
            return NextResponse.json({ error: 'Order cannot be cancelled in its current state' }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            const txAny = tx as any;

            // 1. Marcar como cancelada
            await txAny.exchangeOrder.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });

            // 2. Devolver fondos bloqueados
            if (order.type === 'BUY') {
                // Devolvemos el monto remanente * precio + tax (2%)
                const refundAmount = order.amount * order.price * 1.02;
                await txAny.player.update({
                    where: { id: player.id },
                    data: { doblones: { increment: refundAmount } }
                });
            } else {
                // Devolvemos el monto remanente de éter
                await txAny.player.update({
                    where: { id: player.id },
                    data: { etherFragments: { increment: order.amount } }
                });
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Exchange Cancel Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
