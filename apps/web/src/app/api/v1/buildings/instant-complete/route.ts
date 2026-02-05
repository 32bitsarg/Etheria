import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const { queueItemId } = await request.json();
        const player = await getAuthPlayer();

        if (!player || !player.city) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const queueItem = player.city.constructionQueue.find(q => q.id === queueItemId);
        if (!queueItem) return NextResponse.json({ error: 'Construction not found' }, { status: 404 });

        // Instant complete cost (e.g., 20 gold flat)
        const INSTANT_COST = 20;
        if (player.gold < INSTANT_COST) return NextResponse.json({ error: 'Insufficient gold' }, { status: 400 });

        const updated = await prisma.$transaction(async (tx) => {
            await tx.player.update({
                where: { id: player.id },
                data: { gold: { decrement: INSTANT_COST } }
            });

            await tx.building.update({
                where: { cityId_type: { cityId: player.city!.id, type: queueItem.buildingType } },
                data: { level: queueItem.targetLevel }
            });

            await tx.constructionQueueItem.delete({ where: { id: queueItemId } });

            return await tx.player.findUnique({
                where: { id: player.id },
                include: { city: { include: { buildings: true, constructionQueue: true, trainingQueue: true, units: true } } }
            });
        });

        return NextResponse.json({ success: true, player: updated });

    } catch (error) {
        console.error('V1 Instant Complete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
