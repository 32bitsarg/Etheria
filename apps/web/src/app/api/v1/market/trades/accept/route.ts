import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

const RESOURCE_FIELDS: Record<string, string> = {
    'WOOD': 'wood',
    'IRON': 'iron',
    'GOLD': 'gold',
    'DOBLONES': 'doblones',
    'ETHER': 'etherFragments',
    'wood': 'wood',
    'iron': 'iron',
    'gold': 'gold',
    'doblones': 'doblones',
    'etherFragments': 'etherFragments'
};

export async function POST(request: NextRequest) {
    try {
        const buyer = await getAuthPlayer();
        if (!buyer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { tradeId } = await request.json();
        if (!tradeId) return NextResponse.json({ error: 'Trade ID missing' }, { status: 400 });

        // Iniciar transacción para procesar el intercambio
        const result = await prisma.$transaction(async (tx) => {
            const txAny = tx as any;

            // 1. Buscar la oferta y bloquearla
            const trade = await txAny.tradeListing.findUnique({
                where: { id: tradeId },
                include: { seller: true }
            });

            if (!trade || trade.status !== 'OPEN') {
                throw new Error('La oferta ya no está disponible');
            }

            if (trade.sellerId === buyer.id) {
                throw new Error('No puedes aceptar tu propia oferta');
            }

            // 2. Verificar que el comprador tenga lo solicitado
            const reqField = RESOURCE_FIELDS[trade.requestedType];
            if ((buyer as any)[reqField] < trade.requestedAmount) {
                throw new Error('Recursos insuficientes para aceptar esta oferta');
            }

            // 3. Procesar intercambio
            const offField = RESOURCE_FIELDS[trade.offeredType];

            // Deducir del comprador
            await txAny.player.update({
                where: { id: buyer.id },
                data: {
                    [reqField]: { decrement: trade.requestedAmount },
                    [offField]: { increment: trade.offeredAmount }
                }
            });

            // Dar al vendedor lo solicitado
            await txAny.player.update({
                where: { id: trade.sellerId },
                data: {
                    [reqField]: { increment: trade.requestedAmount }
                }
            });

            // 4. Actualizar estado de la oferta
            return await txAny.tradeListing.update({
                where: { id: tradeId },
                data: { status: 'FILLED' }
            });
        });

        return NextResponse.json({ success: true, trade: result });

    } catch (error: any) {
        console.error('Accept Trade Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
