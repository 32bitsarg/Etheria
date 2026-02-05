import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUnitCost, UnitType } from '@lootsystem/game-engine';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const { queueItemId } = await request.json();
        const player = await getAuthPlayer();

        if (!player || !player.city) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const queueItem = player.city.trainingQueue.find(q => q.id === queueItemId);
        if (!queueItem) return NextResponse.json({ error: 'Training not found' }, { status: 404 });

        const cost = getUnitCost(queueItem.unitType as UnitType);
        const refundWood = Math.floor((cost.wood || 0) * queueItem.count * 0.5);
        const refundIron = Math.floor((cost.iron || 0) * queueItem.count * 0.5);
        const refundGold = Math.floor((cost.gold || 0) * queueItem.count * 0.5);
        const refundPop = (cost.population || 0) * queueItem.count;

        const updated = await prisma.$transaction(async (tx) => {
            await tx.player.update({
                where: { id: player.id },
                data: {
                    wood: { increment: refundWood },
                    iron: { increment: refundIron },
                    gold: { increment: refundGold },
                    populationUsed: { decrement: refundPop }
                }
            });

            await tx.trainingQueueItem.delete({ where: { id: queueItemId } });

            return await tx.player.findUnique({
                where: { id: player.id },
                include: { city: { include: { buildings: true, constructionQueue: true, trainingQueue: true, units: true } } }
            });
        });

        return NextResponse.json({ success: true, player: updated });

    } catch (error) {
        console.error('V1 Cancel Training error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
