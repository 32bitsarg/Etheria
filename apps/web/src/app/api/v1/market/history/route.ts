import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Obtener trades de los últimos 24 horas
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const history = await (prisma as any).marketHistory.findMany({
            where: { timestamp: { gte: yesterday } },
            orderBy: { timestamp: 'asc' }
        });

        // Agrupar por intervalos (ej: 30 minutos)
        const INTERVAL_MS = 30 * 60 * 1000;
        const candles: any[] = [];

        if (history.length > 0) {
            let currentCandle: any = null;
            let currentIntervalStart = 0;

            for (const trade of history) {
                const tradeTime = new Date(trade.timestamp).getTime();
                const intervalStart = Math.floor(tradeTime / INTERVAL_MS) * INTERVAL_MS;

                if (currentCandle && intervalStart === currentIntervalStart) {
                    // Actualizar vela actual
                    currentCandle.high = Math.max(currentCandle.high, trade.price);
                    currentCandle.low = Math.min(currentCandle.low, trade.price);
                    currentCandle.close = trade.price;
                    currentCandle.volume += trade.volume;
                } else {
                    // Cerrar vela anterior y empezar nueva
                    if (currentCandle) candles.push(currentCandle);

                    currentIntervalStart = intervalStart;
                    currentCandle = {
                        time: new Date(intervalStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        open: trade.price,
                        high: trade.price,
                        low: trade.price,
                        close: trade.price,
                        volume: trade.volume
                    };
                }
            }
            if (currentCandle) candles.push(currentCandle);
        }

        // Obtener los últimos 30 trades individuales para el panel de trades recientes
        const recentTrades = await (prisma as any).marketHistory.findMany({
            orderBy: { timestamp: 'desc' },
            take: 30
        });

        return NextResponse.json({
            success: true,
            history: candles,
            recentTrades: recentTrades.map((t: any) => ({
                id: t.id,
                price: t.price,
                volume: t.volume,
                type: t.type,
                time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            }))
        });
    } catch (error) {
        console.error('Market History API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
