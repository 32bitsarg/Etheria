import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUnitCost, UnitType } from '@lootsystem/game-engine';

/**
 * POST /api/military/cancel
 * Cancel unit training
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId, queueItemId } = body;

        if (!playerId || !queueItemId) {
            return NextResponse.json(
                { error: 'Invalid parameters' },
                { status: 400 }
            );
        }

        // Get player with training queue
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        trainingQueue: true,
                    },
                },
            },
        });

        if (!player || !player.city) {
            return NextResponse.json(
                { error: 'Player or city not found' },
                { status: 404 }
            );
        }

        // Find queue item
        const queueItem = player.city.trainingQueue.find(
            (item: { id: string }) => item.id === queueItemId
        );

        if (!queueItem) {
            return NextResponse.json(
                { error: 'Queue item not found' },
                { status: 404 }
            );
        }

        // Calculate refund
        const unitCost = getUnitCost(queueItem.unitType as UnitType);
        const count = queueItem.count;

        const refund = {
            wood: Math.floor((unitCost.wood || 0) * count * 0.5),
            iron: Math.floor((unitCost.iron || 0) * count * 0.5),
            gold: Math.floor((unitCost.gold || 0) * count * 0.5),
            population: (unitCost.population || 0) * count, // 100% pop refund
        };

        // Transaction
        await prisma.$transaction([
            prisma.player.update({
                where: { id: playerId },
                data: {
                    wood: player.wood + refund.wood,
                    iron: player.iron + refund.iron,
                    gold: player.gold + refund.gold,
                    populationUsed: Math.max(0, player.populationUsed - refund.population),
                },
            }),
            prisma.trainingQueueItem.delete({
                where: { id: queueItemId },
            }),
        ]);

        // Get fresh state
        const refreshedPlayer = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        buildings: true,
                        constructionQueue: true,
                        trainingQueue: true,
                        units: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            player: refreshedPlayer,
            refund,
        });

    } catch (error) {
        console.error('Cancel training error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
