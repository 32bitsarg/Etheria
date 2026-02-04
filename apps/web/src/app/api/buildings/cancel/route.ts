import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUpgradeCost, BuildingType } from '@lootsystem/game-engine';

/**
 * POST /api/buildings/cancel
 * Cancel a construction and refund 50% of resources
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId, queueItemId } = body;

        if (!playerId || !queueItemId) {
            return NextResponse.json(
                { error: 'Player ID and queue item ID are required' },
                { status: 400 }
            );
        }

        // Get player with city
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        constructionQueue: true,
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

        // Find the queue item
        const queueItem = player.city.constructionQueue.find(
            (item: { id: string }) => item.id === queueItemId
        );

        if (!queueItem) {
            return NextResponse.json(
                { error: 'Queue item not found' },
                { status: 404 }
            );
        }

        // Calculate 50% refund for resources, 100% refund for population
        const cost = getUpgradeCost(queueItem.buildingType as BuildingType, queueItem.targetLevel);
        const refundWood = Math.floor((cost.wood ?? 0) * 0.5);
        const refundIron = Math.floor((cost.iron ?? 0) * 0.5);
        const refundGold = Math.floor((cost.gold ?? 0) * 0.5);
        const refundPopulation = cost.population ?? 0; // Full population refund

        // Transaction: refund resources + population + remove from queue
        await prisma.$transaction([
            prisma.player.update({
                where: { id: playerId },
                data: {
                    wood: player.wood + refundWood,
                    iron: player.iron + refundIron,
                    gold: player.gold + refundGold,
                    populationUsed: Math.max(0, player.populationUsed - refundPopulation),
                },
            }),
            prisma.constructionQueueItem.delete({
                where: { id: queueItemId },
            }),
        ]);

        // Get updated player state
        const refreshedPlayer = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        buildings: true,
                        constructionQueue: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            player: refreshedPlayer,
            refund: { wood: refundWood, iron: refundIron, gold: refundGold },
        });

    } catch (error) {
        console.error('Cancel construction error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
