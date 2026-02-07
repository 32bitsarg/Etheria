import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MarketEngine } from '@lootsystem/market';

export async function GET() {
    try {
        const engine = new MarketEngine();

        // 1. Obtener estado del sistema (AMM) y mejores órdenes
        const [marketState, bestBuyOrders, bestSellOrders] = await Promise.all([
            (prisma as any).marketState.upsert({
                where: { id: 'global' },
                update: {},
                create: { id: 'global' }
            }),
            (prisma as any).exchangeOrder.findMany({
                where: { type: 'BUY', status: { in: ['OPEN', 'PARTIAL'] } },
                orderBy: { price: 'desc' },
                take: 15
            }),
            (prisma as any).exchangeOrder.findMany({
                where: { type: 'SELL', status: { in: ['OPEN', 'PARTIAL'] } },
                orderBy: { price: 'asc' },
                take: 15
            })
        ]);

        const buyOrders = (bestBuyOrders as any[]).map((o) => ({
            id: o.id,
            playerId: o.playerId,
            type: 'BUY' as const,
            amount: o.amount,
            remainingAmount: o.amount,
            price: o.price,
            status: o.status as any,
            createdAt: o.createdAt
        }));

        const sellOrders = (bestSellOrders as any[]).map((o) => ({
            id: o.id,
            playerId: o.playerId,
            type: 'SELL' as const,
            amount: o.amount,
            remainingAmount: o.amount,
            price: o.price,
            status: o.status as any,
            createdAt: o.createdAt
        }));

        // 2. Calcular el precio de mercado priorizando el AMM si no hay órdenes
        const ammPrice = engine.getCurrentAMMPrice(marketState.etherReserve, marketState.doblonesReserve);
        const marketPrice = engine.getMarketPrice(buyOrders, sellOrders, ammPrice);

        return NextResponse.json({
            success: true,
            marketPrice,
            spread: {
                bestBuy: buyOrders[0]?.price || null,
                bestSell: sellOrders[0]?.price || null
            },
            orderBook: {
                buy: buyOrders,
                sell: sellOrders
            },
            amm: {
                price: ammPrice,
                liquidity: marketState.etherReserve
            }
        });
    } catch (error) {
        console.error('Market Rates API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
