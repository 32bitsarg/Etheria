import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    getProductionPerHour,
    BuildingType,
    resolveBattle,
    UnitType,
    UNIT_STATS,
    getUpgradeCost,
    getUnitCost
} from '@lootsystem/game-engine';
import { gameEvents, EVENTS } from '@/lib/gameEvents';
import { getAuthPlayer } from '@/lib/player-utils';

type BuildingRecord = { type: string; level: number };
type QueueRecord = { id: string; buildingType: string; targetLevel: number; endTime: Date };

const RACE_BONUSES: Record<string, { wood: number; iron: number; gold: number; pop: number }> = {
    elfo: { wood: 0.15, iron: 0, gold: 0, pop: 0 },
    humano: { wood: 0, iron: 0, gold: 0.10, pop: 0 },
    orco: { wood: 0, iron: 0.12, gold: 0, pop: 0.10 },
    enano: { wood: 0, iron: 0.18, gold: 0.05, pop: 0 },
};

const getXPForLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.8, level - 1));
};

export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();

        if (!player || !player.city) {
            return NextResponse.json({ error: 'Player context not found' }, { status: 401 });
        }

        const now = new Date();
        const lastUpdate = player.lastResourceUpdate;
        const elapsedHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

        // --- Production & Storage ---
        const raceBonus = RACE_BONUSES[player.race] || { wood: 0, iron: 0, gold: 0, pop: 0 };
        const buildings = player.city.buildings;

        const getLvl = (type: string) => buildings.find(b => b.type === type)?.level ?? 0;

        const woodPerHour = getProductionPerHour(BuildingType.LUMBER_MILL, getLvl(BuildingType.LUMBER_MILL)) * (1 + raceBonus.wood);
        const ironPerHour = getProductionPerHour(BuildingType.IRON_MINE, getLvl(BuildingType.IRON_MINE)) * (1 + raceBonus.iron);
        const goldPerHour = getProductionPerHour(BuildingType.GOLD_MINE, getLvl(BuildingType.GOLD_MINE)) * (1 + raceBonus.gold);

        const warehouseLevel = getLvl(BuildingType.WAREHOUSE);
        const maxStorage = Math.floor(5000 * Math.pow(1.3, warehouseLevel));

        const newWood = Math.min(maxStorage, player.wood + woodPerHour * elapsedHours);
        const newIron = Math.min(maxStorage, player.iron + ironPerHour * elapsedHours);
        const newGold = Math.min(maxStorage, player.gold + goldPerHour * elapsedHours);

        // --- Completed Tasks ---
        const completedConstructions = player.city.constructionQueue.filter(q => q.endTime <= now);
        const completedTraining = player.city.trainingQueue.filter(q => q.endTime <= now);

        // --- Arriving Events (Attacks/Returns) ---
        const arrivingMovements = await prisma.combatMovement.findMany({
            where: { targetCityId: player.city.id, endTime: { lt: now } },
            include: { originCity: { include: { player: true } } }
        });

        const returningMovements = await prisma.combatMovement.findMany({
            where: { originCityId: player.city.id, type: 'RETURN', endTime: { lt: now } }
        });

        // --- Progression & Power Recalculation ---
        let xpGained = 0;
        const unitUpdates: Record<string, number> = {};

        for (const q of completedTraining) {
            unitUpdates[q.unitType] = (unitUpdates[q.unitType] || 0) + q.count;
            const cost = getUnitCost(q.unitType as UnitType);
            xpGained += q.count * (cost.population || 1) * 2;
        }

        for (const q of completedConstructions) {
            const cost = getUpgradeCost(q.buildingType as BuildingType, q.targetLevel);
            const totalRes = (cost.wood ?? 0) + (cost.iron ?? 0) + (cost.gold ?? 0);
            xpGained += (q.targetLevel * 10) + Math.floor(totalRes / 50);
        }

        // Handle Level up
        let currentLevel = player.level;
        let currentXP = player.experience + xpGained;
        let leveledUp = false;
        while (currentXP >= getXPForLevel(currentLevel + 1)) {
            currentXP -= getXPForLevel(currentLevel + 1);
            currentLevel++;
            leveledUp = true;
        }

        // Power calculation
        const currentUnitsMap: Record<string, number> = {};
        player.city.units.forEach(u => currentUnitsMap[u.type] = u.count);
        Object.entries(unitUpdates).forEach(([t, c]) => currentUnitsMap[t] = (currentUnitsMap[t] || 0) + c);

        let power = 0;
        Object.entries(currentUnitsMap).forEach(([t, c]) => {
            const stats = UNIT_STATS[t as UnitType]?.stats;
            if (stats) power += c * (stats.attack + stats.defense);
        });
        power = Math.floor(power / 10);

        // --- Transactional Update ---
        await prisma.$transaction(async (tx) => {
            await (tx.player as any).update({
                where: { id: player.id },
                data: {
                    wood: newWood, iron: newIron, gold: newGold,
                    experience: currentXP, level: currentLevel,
                    militaryPower: power, lastResourceUpdate: now
                }
            });

            if (leveledUp) {
                gameEvents.emit('LEVEL_UP', { targetPlayerId: player.id, newLevel: currentLevel });
            }

            // Apply buildings
            for (const q of completedConstructions) {
                await tx.building.update({
                    where: { cityId_type: { cityId: player.city!.id, type: q.buildingType } },
                    data: { level: q.targetLevel }
                });
            }
            if (completedConstructions.length > 0) {
                await tx.constructionQueueItem.deleteMany({ where: { id: { in: completedConstructions.map(q => q.id) } } });
            }

            // Apply units
            for (const [type, count] of Object.entries(unitUpdates)) {
                await tx.unit.upsert({
                    where: { cityId_type: { cityId: player.city!.id, type } },
                    create: { cityId: player.city!.id, type, count },
                    update: { count: { increment: count } }
                });
            }
            if (completedTraining.length > 0) {
                await tx.trainingQueueItem.deleteMany({ where: { id: { in: completedTraining.map(q => q.id) } } });
            }

            // --- Combat Resolution ---
            for (const move of arrivingMovements) {
                if (move.type === 'ATTACK') {
                    const df = await tx.city.findUnique({
                        where: { id: move.targetCityId },
                        include: { units: true, player: true }
                    });
                    if (!df) continue;

                    const atkUnits = Array.isArray(move.units) ? move.units : [];
                    const defUnits = df.units.map(u => ({ type: u.type, count: u.count }));
                    const res = resolveBattle(atkUnits as any, defUnits, { wood: df.player.wood, iron: df.player.iron, gold: df.player.gold });

                    // Update defender
                    for (const loss of res.defenderLosses) {
                        await tx.unit.update({ where: { cityId_type: { cityId: df.id, type: loss.type } }, data: { count: { decrement: loss.count } } });
                    }
                    await tx.player.update({
                        where: { id: df.playerId },
                        data: {
                            wood: { decrement: res.lootedResources.wood },
                            iron: { decrement: res.lootedResources.iron },
                            gold: { decrement: res.lootedResources.gold }
                        }
                    });

                    // Create report
                    const atkCity = await tx.city.findUnique({ where: { id: move.originCityId }, select: { playerId: true, name: true } });
                    await tx.combatReport.create({
                        data: {
                            defenderId: df.playerId, attackerId: atkCity?.playerId || '',
                            originCityName: atkCity?.name || 'Ciudad', targetCityName: df.name,
                            won: res.won, lootedWood: res.lootedResources.wood,
                            lootedIron: res.lootedResources.iron, lootedGold: res.lootedResources.gold,
                            troopSummary: {
                                attackerInitial: atkUnits, attackerLosses: res.attackerLosses,
                                defenderInitial: defUnits, defenderLosses: res.defenderLosses
                            } as any
                        }
                    });

                    gameEvents.emit(EVENTS.BATTLE_REPORT, { attackerId: atkCity?.playerId || '', defenderId: df.playerId, won: res.won });

                    // Return survivors
                    const survivors = res.attackerRemaining.filter((u: any) => u.count > 0);
                    if (survivors.length > 0) {
                        const travelTime = move.endTime.getTime() - move.startTime.getTime();
                        await tx.combatMovement.create({
                            data: {
                                type: 'RETURN', originCityId: move.targetCityId, targetCityId: move.originCityId,
                                units: survivors as any, wood: res.lootedResources.wood,
                                iron: res.lootedResources.iron, gold: res.lootedResources.gold,
                                endTime: new Date(Date.now() + travelTime)
                            }
                        });
                    }
                    await tx.combatMovement.delete({ where: { id: move.id } });
                }
            }

            // Return processing
            for (const ret of returningMovements) {
                const units = Array.isArray(ret.units) ? ret.units : [];
                for (const u of units as any[]) {
                    await tx.unit.upsert({
                        where: { cityId_type: { cityId: ret.targetCityId, type: u.type } },
                        create: { cityId: ret.targetCityId, type: u.type, count: u.count },
                        update: { count: { increment: u.count } }
                    });
                }
                const city = await tx.city.findUnique({ where: { id: ret.targetCityId }, select: { playerId: true } });
                if (city) {
                    await tx.player.update({
                        where: { id: city.playerId },
                        data: { wood: { increment: ret.wood }, iron: { increment: ret.iron }, gold: { increment: ret.gold } }
                    });
                }
                await tx.combatMovement.delete({ where: { id: ret.id } });
            }
        });

        // Return refreshed data
        const refreshed = await prisma.player.findUnique({
            where: { id: player.id },
            include: {
                city: {
                    include: {
                        buildings: true, constructionQueue: true, trainingQueue: true, units: true,
                        originMovements: { include: { targetCity: true } },
                        targetMovements: { include: { originCity: true } }
                    }
                },
                allianceMember: { include: { alliance: true } }
            }
        });

        return NextResponse.json({ success: true, player: refreshed });

    } catch (error: any) {
        console.error('V1 Tick error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
