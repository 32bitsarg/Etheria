import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/buildings/instant-complete
 * Complete a construction instantly (only for levels 1-4)
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
                        buildings: true,
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

        // Check level limit for instant complete
        const INSTANT_COMPLETE_MAX_LEVEL = 4;
        if (queueItem.targetLevel > INSTANT_COMPLETE_MAX_LEVEL) {
            return NextResponse.json(
                { error: `Instant complete only available for levels 1-${INSTANT_COMPLETE_MAX_LEVEL}` },
                { status: 400 }
            );
        }

        // Find the building
        const building = player.city.buildings.find(
            (b: { type: string }) => b.type === queueItem.buildingType
        );

        // Transaction: update building level + remove from queue
        await prisma.$transaction([
            // Update or create building
            building
                ? prisma.building.update({
                    where: { id: building.id },
                    data: { level: queueItem.targetLevel },
                })
                : prisma.building.create({
                    data: {
                        cityId: player.city.id,
                        type: queueItem.buildingType,
                        level: queueItem.targetLevel,
                    },
                }),
            // Remove from queue
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
        });

    } catch (error) {
        console.error('Instant complete error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
