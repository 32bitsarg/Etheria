import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUnitCost, UnitType, MAX_TRAINING_QUEUE, getUnitTrainingTime } from '@lootsystem/game-engine';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const { unitType, count } = await request.json();
        const player = await getAuthPlayer();

        if (!player || !player.city) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (player.city.trainingQueue.length >= MAX_TRAINING_QUEUE) {
            return NextResponse.json({ error: `Training queue full (${MAX_TRAINING_QUEUE})` }, { status: 400 });
        }

        if (count <= 0) return NextResponse.json({ error: 'Invalid count' }, { status: 400 });

        const cost = getUnitCost(unitType as UnitType);
        const unitTrainingTime = getUnitTrainingTime(unitType as UnitType);
        const totalWood = (cost.wood || 0) * count;
        const totalIron = (cost.iron || 0) * count;
        const totalGold = (cost.gold || 0) * count;
        const totalPop = (cost.population || 0) * count;

        if (player.wood < totalWood || player.iron < totalIron || player.gold < totalGold) {
            return NextResponse.json({ error: 'Insufficient resources' }, { status: 400 });
        }

        const availablePop = player.populationMax - player.populationUsed;
        if (totalPop > availablePop) {
            return NextResponse.json({ error: 'Insufficient population' }, { status: 400 });
        }

        const trainingTime = (unitTrainingTime || 60) * count;
        const endTime = new Date(Date.now() + trainingTime * 1000);

        const updated = await prisma.$transaction(async (tx) => {
            await tx.player.update({
                where: { id: player.id },
                data: {
                    wood: { decrement: totalWood },
                    iron: { decrement: totalIron },
                    gold: { decrement: totalGold },
                    populationUsed: { increment: totalPop }
                }
            });

            await tx.trainingQueueItem.create({
                data: { cityId: player.city!.id, unitType, count, endTime }
            });

            return await tx.player.findUnique({
                where: { id: player.id },
                include: { city: { include: { buildings: true, constructionQueue: true, trainingQueue: true, units: true } } }
            });
        });

        return NextResponse.json({ success: true, player: updated });

    } catch (error) {
        console.error('V1 Training error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
