import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MarketEngine, OrderType } from '@lootsystem/market';
import { getAuthPlayer } from '@/lib/player-utils';
import { gameEvents, EVENTS } from '@/lib/gameEvents';

// Definir interfaces locales para evitar errores de tipo en tiempo de compilación
interface ExchangeOrderRaw {
    id: string;
    playerId: string;
    type: string;
    amount: number;
    price: number;
    status: string;
    createdAt: Date;
}

export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();
        if (!player) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const type = body.type as OrderType;
        const amount = Number(body.amount);
        const price = body.price ? Number(body.price) : null;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const engine = new MarketEngine();

        // 1. Obtener estado del mercado (AMM) + órdenes de jugadores
        // Usamos (prisma as any) para evitar errores si el cliente local está desincronizado
        const [marketState, orderBookRaw] = await Promise.all([
            (prisma as any).marketState.upsert({
                where: { id: 'global' },
                update: {},
                create: { id: 'global' }
            }),
            (prisma as any).exchangeOrder.findMany({
                where: {
                    type: type === 'BUY' ? 'SELL' : 'BUY',
                    status: { in: ['OPEN', 'PARTIAL'] }
                },
                orderBy: { price: type === 'BUY' ? 'asc' : 'desc' },
                take: 50
            })
        ]);

        const orderBook = (orderBookRaw as ExchangeOrderRaw[]).map((o) => ({
            id: o.id,
            playerId: o.playerId,
            type: (type === 'BUY' ? 'SELL' : 'BUY') as OrderType,
            amount: o.amount,
            remainingAmount: o.amount, // En matching usamos la cantidad actual de la orden
            price: o.price,
            status: o.status as any,
            createdAt: o.createdAt
        }));

        // 2. Ejecutar matching (Jugadores primero)
        const result = engine.matchOrder(type, amount, orderBook);
        let remainingToProcess = amount - result.executedAmount;

        let ammDoblonesAffected = 0;
        let ammEtherAffected = 0;
        let finalEtherReserve = marketState.etherReserve;
        let finalDoblonesReserve = marketState.doblonesReserve;

        // 3. AMM prové liquidez si es a mercado
        if (remainingToProcess > 0 && !price) {
            try {
                const ammMatch = engine.calculateAMMTrade(
                    type,
                    remainingToProcess,
                    marketState.etherReserve,
                    marketState.doblonesReserve
                );

                ammDoblonesAffected = ammMatch.costInDoblones;
                ammEtherAffected = remainingToProcess;
                finalEtherReserve = ammMatch.newEtherReserve;
                finalDoblonesReserve = ammMatch.newDoblonesReserve;
                remainingToProcess = 0;
            } catch (err: any) {
                console.warn('AMM Liquidity failed:', err.message);
            }
        }

        const totalEtherExecuted = result.executedAmount + ammEtherAffected;

        // 4. Transacción
        await prisma.$transaction(async (tx) => {
            const txAny = tx as any;
            const playerDoblonesPart = type === 'BUY' ? result.totalCost : -result.totalCost;
            const totalCostForUser = playerDoblonesPart + ammDoblonesAffected;

            if (type === 'BUY') {
                const executedCostWithTax = (result.totalCost + ammDoblonesAffected) * 1.02;
                const remainingCostWithTax = (remainingToProcess * (price || 0)) * 1.02;
                const totalDeduction = executedCostWithTax + remainingCostWithTax;

                if ((player as any).doblones < totalDeduction) throw new Error('Fondos insuficientes en Doblones');

                await txAny.player.update({
                    where: { id: player.id },
                    data: {
                        doblones: { decrement: totalDeduction },
                        etherFragments: { increment: totalEtherExecuted }
                    }
                });
            } else {
                const totalEtherToLock = totalEtherExecuted + remainingToProcess;
                if ((player as any).etherFragments < totalEtherToLock) throw new Error('Fragmentos de Éter insuficientes');

                const receiveAmount = Math.abs(totalCostForUser) * 0.98;
                await txAny.player.update({
                    where: { id: player.id },
                    data: {
                        etherFragments: { decrement: totalEtherToLock },
                        doblones: { increment: receiveAmount }
                    }
                });
            }

            // Actualizar órdenes matcheadas
            for (const match of result.matches) {
                const originalOrder = (orderBookRaw as ExchangeOrderRaw[]).find(o => o.id === match.orderId);
                if (!originalOrder) continue;

                const isFullyFilled = match.amount >= originalOrder.amount - 0.0001;

                await txAny.exchangeOrder.update({
                    where: { id: match.orderId },
                    data: {
                        amount: { decrement: match.amount },
                        status: isFullyFilled ? 'FILLED' : 'PARTIAL'
                    }
                });

                await txAny.player.update({
                    where: { id: originalOrder.playerId },
                    data: type === 'BUY'
                        ? { doblones: { increment: match.amount * match.price } }
                        : { etherFragments: { increment: match.amount } }
                });
            }

            // Actualizar AMM
            if (ammEtherAffected > 0) {
                await txAny.marketState.update({
                    where: { id: 'global' },
                    data: {
                        etherReserve: finalEtherReserve,
                        doblonesReserve: finalDoblonesReserve,
                        lastUpdate: new Date()
                    }
                });
            }

            // Crear orden abierta
            if (remainingToProcess > 0 && price) {
                await txAny.exchangeOrder.create({
                    data: {
                        playerId: player.id,
                        type,
                        amount: remainingToProcess,
                        price,
                        status: 'OPEN'
                    }
                });
            }

            // Historial
            if (totalEtherExecuted > 0) {
                const avgPriceInTx = Math.abs(totalCostForUser / totalEtherExecuted);
                await txAny.marketHistory.create({
                    data: {
                        price: avgPriceInTx,
                        volume: totalEtherExecuted,
                        type: type
                    }
                });
            }
        });

        // 5. Notificar
        if (totalEtherExecuted > 0) {
            const finalPrice = finalEtherReserve > 0 ? finalDoblonesReserve / finalEtherReserve : marketState.doblonesReserve / marketState.etherReserve;
            gameEvents.emit(EVENTS.ORDER_FILLED, {
                userId: (player as any).userId,
                orderType: type,
                amount: totalEtherExecuted,
                price: finalPrice
            });
        }

        return NextResponse.json({
            success: true,
            executedAmount: totalEtherExecuted,
            averagePrice: totalEtherExecuted > 0 ? Math.abs((result.totalCost + ammDoblonesAffected) / totalEtherExecuted) : 0,
            remainingAmount: remainingToProcess
        });

    } catch (error: any) {
        console.error('Market Exchange API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
