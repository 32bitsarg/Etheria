import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    getProductionPerHour,
    BuildingType
} from '@lootsystem/game-engine';

// Types for Prisma results
type BuildingRecord = { type: string; level: number };
type QueueRecord = { id: string; buildingType: string; targetLevel: number; endTime: Date };

// Race production bonuses
const RACE_BONUSES: Record<string, { wood: number; iron: number; gold: number; pop: number }> = {
    elfo: { wood: 0.15, iron: 0, gold: 0, pop: 0 },
    humano: { wood: 0, iron: 0, gold: 0.10, pop: 0 },
    orco: { wood: 0, iron: 0.12, gold: 0, pop: 0.10 },
    enano: { wood: 0, iron: 0.18, gold: 0.05, pop: 0 },
};

/**
 * POST /api/player/tick
 * Process game tick - update resources and complete constructions
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId } = body;

        if (!playerId) {
            return NextResponse.json(
                { error: 'Player ID is required' },
                { status: 400 }
            );
        }

        // Get player with full data
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        buildings: true,
                        constructionQueue: true,
                        trainingQueue: true,
                    },
                },
            },
        });

        if (!player || !player.city) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }

        const now = new Date();
        const lastUpdate = player.lastResourceUpdate;
        const elapsedHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

        // Calculate production rates
        const raceBonus = RACE_BONUSES[player.race] || { wood: 0, iron: 0, gold: 0, pop: 0 };

        const lumberLevel = player.city.buildings.find((b: BuildingRecord) => b.type === BuildingType.LUMBER_MILL)?.level ?? 0;
        const ironLevel = player.city.buildings.find((b: BuildingRecord) => b.type === BuildingType.IRON_MINE)?.level ?? 0;
        const goldLevel = player.city.buildings.find((b: BuildingRecord) => b.type === BuildingType.GOLD_MINE)?.level ?? 0;
        const warehouseLevel = player.city.buildings.find((b: BuildingRecord) => b.type === BuildingType.WAREHOUSE)?.level ?? 0;

        const woodPerHour = getProductionPerHour(BuildingType.LUMBER_MILL, lumberLevel) * (1 + raceBonus.wood);
        const ironPerHour = getProductionPerHour(BuildingType.IRON_MINE, ironLevel) * (1 + raceBonus.iron);
        const goldPerHour = getProductionPerHour(BuildingType.GOLD_MINE, goldLevel) * (1 + raceBonus.gold);

        // Storage limits
        const baseStorage = 5000;
        const storageMultiplier = Math.pow(1.3, warehouseLevel);
        const maxStorage = Math.floor(baseStorage * storageMultiplier);

        // Calculate new resources (capped at max)
        const newWood = Math.min(maxStorage, player.wood + woodPerHour * elapsedHours);
        const newIron = Math.min(maxStorage, player.iron + ironPerHour * elapsedHours);
        const newGold = Math.min(maxStorage, player.gold + goldPerHour * elapsedHours);

        // Check completed constructions
        const completedConstructions = player.city.constructionQueue.filter(
            (item: QueueRecord) => item.endTime <= now
        );

        // Check completed training
        const completedTraining = player.city.trainingQueue.filter(
            (item: any) => item.endTime <= now
        );

        // Prepare building updates
        const buildingUpdates: { type: string; level: number }[] = [];
        for (const completed of completedConstructions) {
            buildingUpdates.push({
                type: completed.buildingType,
                level: completed.targetLevel,
            });
        }

        // Prepare unit updates
        const unitUpdates: Record<string, number> = {};
        for (const completed of completedTraining) {
            const current = unitUpdates[completed.unitType] || 0;
            unitUpdates[completed.unitType] = current + completed.count;
        }

        // Update database in transaction
        await prisma.$transaction(async (tx) => {
            // Update player resources
            await tx.player.update({
                where: { id: playerId },
                data: {
                    wood: newWood,
                    iron: newIron,
                    gold: newGold,
                    lastResourceUpdate: now,
                },
            });

            // Update completed buildings
            for (const building of buildingUpdates) {
                await tx.building.update({
                    where: {
                        cityId_type: {
                            cityId: player.city!.id,
                            type: building.type,
                        },
                    },
                    data: {
                        level: building.level,
                    },
                });
            }

            // Remove completed construction queue items
            if (completedConstructions.length > 0) {
                await tx.constructionQueueItem.deleteMany({
                    where: {
                        id: {
                            in: completedConstructions.map((q: QueueRecord) => q.id),
                        },
                    },
                });
            }

            // Update units
            for (const [unitType, count] of Object.entries(unitUpdates)) {
                await tx.unit.upsert({
                    where: {
                        cityId_type: {
                            cityId: player.city!.id,
                            type: unitType,
                        },
                    },
                    create: {
                        cityId: player.city!.id,
                        type: unitType,
                        count: count,
                    },
                    update: {
                        count: { increment: count },
                    },
                });
            }

            // Remove completed training queue items
            if (completedTraining.length > 0) {
                await tx.trainingQueueItem.deleteMany({
                    where: {
                        id: {
                            in: completedTraining.map((q: any) => q.id),
                        },
                    },
                });
            }
        });

        // Get updated player
        const updatedPlayer = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        buildings: true,
                        constructionQueue: true,
                        trainingQueue: true,
                        units: true, // Now this will be clean
                    },
                },
                allianceMember: {
                    include: {
                        alliance: true
                    }
                }
            },
        });

        return NextResponse.json({
            success: true,
            player: updatedPlayer,
            buildingsCompleted: buildingUpdates.length,
        });

    } catch (error) {
        console.error('Tick error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
