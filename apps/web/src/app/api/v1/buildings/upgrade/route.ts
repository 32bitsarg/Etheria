import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUpgradeCost, getBuildTime, BuildingType, MAX_CONSTRUCTION_QUEUE } from '@lootsystem/game-engine';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { buildingType } = body;
        const player = await getAuthPlayer();

        if (!player || !player.city) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (player.city.constructionQueue.length >= MAX_CONSTRUCTION_QUEUE) {
            return NextResponse.json({ error: `Queue full (${MAX_CONSTRUCTION_QUEUE})` }, { status: 400 });
        }

        if (player.city.constructionQueue.some(q => q.buildingType === buildingType)) {
            return NextResponse.json({ error: 'Already in queue' }, { status: 400 });
        }

        const level = player.city.buildings.find(b => b.type === buildingType)?.level ?? 0;
        const targetLevel = level + 1;
        const cost = getUpgradeCost(buildingType as BuildingType, targetLevel);

        if (player.wood < (cost.wood ?? 0) || player.iron < (cost.iron ?? 0) || player.gold < (cost.gold ?? 0)) {
            return NextResponse.json({ error: 'Insufficient resources' }, { status: 400 });
        }

        const availablePop = player.populationMax - player.populationUsed;
        if ((cost.population ?? 0) > availablePop) {
            return NextResponse.json({ error: 'Insufficient population' }, { status: 400 });
        }

        const buildTime = getBuildTime(buildingType as BuildingType, targetLevel);
        const endTime = new Date(Date.now() + buildTime * 1000);

        const updated = await prisma.$transaction(async (tx) => {
            await tx.player.update({
                where: { id: player.id },
                data: {
                    wood: { decrement: cost.wood || 0 },
                    iron: { decrement: cost.iron || 0 },
                    gold: { decrement: cost.gold || 0 },
                    populationUsed: { increment: cost.population || 0 }
                }
            });

            await tx.constructionQueueItem.create({
                data: { cityId: player.city!.id, buildingType, targetLevel, endTime }
            });

            return await tx.player.findUnique({
                where: { id: player.id },
                include: { city: { include: { buildings: true, constructionQueue: true, trainingQueue: true, units: true } } }
            });
        });

        return NextResponse.json({ success: true, player: updated });

    } catch (error) {
        console.error('V1 Upgrade error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
