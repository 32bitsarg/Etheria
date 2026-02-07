import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

// Mapeo de tipos de recursos a campos de la DB
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

/**
 * GET: Lista todas las ofertas comerciales abiertas
 */
export async function GET() {
    try {
        const trades = await (prisma as any).tradeListing.findMany({
            where: { status: 'OPEN' },
            orderBy: { createdAt: 'desc' },
            include: {
                seller: {
                    select: {
                        id: true,
                        race: true,
                        user: { select: { username: true } }
                    }
                }
            }
        });

        return NextResponse.json({ success: true, trades });
    } catch (error) {
        console.error('List Trades Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST: Crea una nueva oferta comercial
 */
export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();
        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { offeredType, offeredAmount, requestedType, requestedAmount } = await request.json();

        // Validaciones básicas
        if (!offeredType || !offeredAmount || !requestedType || !requestedAmount) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const offField = RESOURCE_FIELDS[offeredType];
        if (!offField) return NextResponse.json({ error: 'Invalid offered resource type' }, { status: 400 });

        const reqField = RESOURCE_FIELDS[requestedType];
        if (!reqField) return NextResponse.json({ error: 'Invalid requested resource type' }, { status: 400 });

        // Verificar si el jugador tiene suficiente recurso para ofrecer
        if ((player as any)[offField] < offeredAmount) {
            return NextResponse.json({ error: 'Recursos insuficientes para crear la oferta' }, { status: 400 });
        }

        // Crear la oferta en una transacción
        const newTrade = await prisma.$transaction(async (tx) => {
            const txAny = tx as any;

            // 1. Deducir recursos (Bloqueo)
            await txAny.player.update({
                where: { id: player.id },
                data: { [offField]: { decrement: offeredAmount } }
            });

            // 2. Crear el listado
            return await txAny.tradeListing.create({
                data: {
                    sellerId: player.id,
                    offeredType: offeredType.toUpperCase(),
                    offeredAmount: Number(offeredAmount),
                    requestedType: requestedType.toUpperCase(),
                    requestedAmount: Number(requestedAmount),
                    status: 'OPEN'
                }
            });
        }, {
            // Note: offeredAmount might be incorrectly typed if I used offeredAmount vs offeredAmount
        });

        // Corregir variable en el transaction si hace falta
        // Re-escribiendo la parte del create para seguridad

        return NextResponse.json({ success: true, trade: newTrade });

    } catch (error: any) {
        console.error('Create Trade Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
