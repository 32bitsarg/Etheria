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
import { GeneradorLoot, DEFAULT_TREASURE_CLASSES, DEFAULT_ITEMS } from '@lootsystem/core';

type BuildingRecord = { type: string; level: number };
type QueueRecord = { id: string; buildingType: string; targetLevel: number; endTime: Date };

const RACE_BONUSES: Record<string, { wood: number; iron: number; gold: number; doblones: number; pop: number }> = {
    elfo: { wood: 0.15, iron: 0, gold: 0, doblones: 0, pop: 0 },
    humano: { wood: 0.10, iron: 0.10, gold: 0.10, doblones: 0.10, pop: 0.10 },
    orco: { wood: 0, iron: 0.12, gold: 0, doblones: 0, pop: 0.10 },
    enano: { wood: 0, iron: 0.18, gold: 0.05, doblones: 0.05, pop: 0 },
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
        const doblonesPerHour = getProductionPerHour(BuildingType.TOWN_HALL, getLvl(BuildingType.TOWN_HALL)) * (1 + raceBonus.doblones);

        const warehouseLevel = getLvl(BuildingType.WAREHOUSE);
        const maxStorage = Math.floor(5000 * Math.pow(1.3, warehouseLevel));

        const newWood = Math.min(maxStorage, player.wood + woodPerHour * elapsedHours);
        const newIron = Math.min(maxStorage, player.iron + ironPerHour * elapsedHours);
        const newGold = Math.min(maxStorage, player.gold + goldPerHour * elapsedHours);
        const newDoblones = Math.min(maxStorage, ((player as any).doblones || 0) + doblonesPerHour * elapsedHours);

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

        // --- Raids NPC ---
        const arrivingRaids = await (prisma as any).raidMovement.findMany({
            where: { playerId: player.id, status: 'TRAVELING', endTime: { lt: now } }
        });

        const returningRaids = await (prisma as any).raidMovement.findMany({
            where: { playerId: player.id, status: 'RETURNING', endTime: { lt: now } }
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
                    wood: newWood, iron: newIron, gold: newGold, doblones: newDoblones,
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

            // --- Raid NPC Resolution ---
            const txAny = tx as any;
            for (const raid of arrivingRaids) {
                // Obtener campamento objetivo
                const camp = await txAny.nPCCamp.findUnique({ where: { id: raid.targetCampId } });
                if (!camp || camp.isDestroyed) {
                    // Campamento ya destruido, devolver tropas
                    const travelTime = raid.endTime.getTime() - raid.startTime.getTime();
                    await txAny.raidMovement.update({
                        where: { id: raid.id },
                        data: { status: 'RETURNING', endTime: new Date(Date.now() + travelTime) }
                    });
                    continue;
                }

                // Calcular poder del atacante
                const attackerUnits = Array.isArray(raid.units) ? raid.units : [];
                let attackPower = 0;
                for (const u of attackerUnits as any[]) {
                    const stats = UNIT_STATS[u.type as UnitType];
                    attackPower += (stats?.stats?.attack ?? 10) * u.count;
                }

                // Calcular poder del defensor (NPC)
                const npcUnits = camp.units || {};
                let defensePower = 0;
                const NPC_STATS: Record<string, { attack: number; defense: number }> = {
                    barbarian_light: { attack: 8, defense: 5 },
                    barbarian_archer: { attack: 12, defense: 3 },
                    guardian: { attack: 25, defense: 20 },
                };
                for (const [unitType, count] of Object.entries(npcUnits)) {
                    const npcStat = NPC_STATS[unitType as keyof typeof NPC_STATS] || { attack: 5, defense: 5 };
                    defensePower += npcStat.defense * (count as number);
                }

                const victory = attackPower > defensePower;
                const travelTime = raid.endTime.getTime() - raid.startTime.getTime();

                if (victory) {
                    // Victoria: generar loot y marcar campamento como destruido
                    const generador = new GeneradorLoot(
                        { nivelJugador: player.level },
                        { items: DEFAULT_ITEMS, treasureClasses: DEFAULT_TREASURE_CLASSES }
                    );
                    const lootResult = generador.generarDesdeTC(camp.treasureClassId, {
                        nivelMonstruo: camp.tier * 5,
                        esJefe: camp.tier >= 3
                    });

                    // Convertir loot a recursos
                    let lootWood = 0, lootIron = 0, lootGold = 0, lootDoblones = 0, lootEther = 0;
                    for (const item of lootResult.items) {
                        const cantidad = item.cantidad || 1;
                        if (item.itemBase.id === 'recurso_madera') lootWood += cantidad * 100;
                        else if (item.itemBase.id === 'recurso_hierro') lootIron += cantidad * 100;
                        else if (item.itemBase.id === 'recurso_oro') lootGold += cantidad * 50;
                        else if (item.itemBase.id === 'recurso_doblones') lootDoblones += cantidad * 10;
                        else if (item.itemBase.id === 'recurso_ether') lootEther += cantidad;
                    }

                    // Calcular bajas del atacante (10-30% de las tropas)
                    const lossRatio = 0.1 + Math.random() * 0.2 * (defensePower / attackPower);
                    const survivingUnits = attackerUnits.map((u: any) => ({
                        type: u.type,
                        count: Math.max(1, Math.floor(u.count * (1 - lossRatio)))
                    }));

                    // Generar reporte de victoria
                    const attackerLosses = (attackerUnits as any[]).map(u => {
                        const surviving = survivingUnits.find((s: any) => s.type === u.type);
                        return { type: u.type, count: u.count - (surviving?.count ?? 0) };
                    });
                    const city = await tx.city.findUnique({ where: { id: raid.originCityId }, select: { name: true } });
                    const campName = getCampName(camp.type, camp.tier);

                    await tx.combatReport.create({
                        data: {
                            attackerId: player.id,
                            originCityName: city?.name || 'Ciudad',
                            targetCityName: campName,
                            won: true,
                            lootedWood: lootWood,
                            lootedIron: lootIron,
                            lootedGold: lootGold,
                            lootedDoblones: lootDoblones,
                            lootedEther: lootEther,
                            troopSummary: {
                                attackerInitial: attackerUnits,
                                attackerLosses: attackerLosses,
                                defenderInitial: Object.entries(npcUnits).map(([type, count]) => ({ type, count })),
                                defenderLosses: Object.entries(npcUnits).map(([type, count]) => ({ type, count }))
                            } as any
                        }
                    });

                    gameEvents.emit(EVENTS.BATTLE_REPORT, {
                        attackerId: player.id,
                        attackerUserId: player.userId,
                        won: true
                    });

                    // Destruir campamento
                    const respawnHours = camp.tier === 1 ? 4 : camp.tier === 2 ? 8 : 12;
                    await txAny.nPCCamp.update({
                        where: { id: camp.id },
                        data: {
                            isDestroyed: true,
                            respawnAt: new Date(Date.now() + respawnHours * 60 * 60 * 1000),
                            lastAttack: new Date()
                        }
                    });

                    // Dar XP al jugador
                    const xpEarned = camp.tier * 50;
                    await tx.player.update({
                        where: { id: player.id },
                        data: {
                            experience: { increment: xpEarned },
                            wood: { increment: lootWood },
                            iron: { increment: lootIron },
                            gold: { increment: lootGold },
                            doblones: { increment: lootDoblones }
                        }
                    });

                    // Marcar raid como resuelta y crear retorno
                    await txAny.raidMovement.update({
                        where: { id: raid.id },
                        data: {
                            status: 'RETURNING',
                            units: survivingUnits,
                            endTime: new Date(Date.now() + travelTime)
                        }
                    });
                } else {
                    // Derrota: perder todas las tropas
                    const city = await tx.city.findUnique({ where: { id: raid.originCityId }, select: { name: true } });
                    const campName = getCampName(camp.type, camp.tier);

                    await tx.combatReport.create({
                        data: {
                            attackerId: player.id,
                            originCityName: city?.name || 'Ciudad',
                            targetCityName: campName,
                            won: false,
                            lootedWood: 0,
                            lootedIron: 0,
                            lootedGold: 0,
                            lootedDoblones: 0,
                            lootedEther: 0,
                            troopSummary: {
                                attackerInitial: attackerUnits,
                                attackerLosses: attackerUnits,
                                defenderInitial: Object.entries(npcUnits).map(([type, count]) => ({ type, count })),
                                defenderLosses: []
                            } as any
                        }
                    });

                    gameEvents.emit(EVENTS.BATTLE_REPORT, {
                        attackerId: player.id,
                        attackerUserId: player.userId,
                        won: false
                    });

                    await txAny.raidMovement.delete({ where: { id: raid.id } });

                    // Actualizar último ataque del campamento
                    await txAny.nPCCamp.update({
                        where: { id: camp.id },
                        data: { lastAttack: new Date() }
                    });
                }
            }

            // --- Raid Returns ---
            for (const raid of returningRaids) {
                const units = Array.isArray(raid.units) ? raid.units : [];
                for (const u of units as any[]) {
                    await tx.unit.upsert({
                        where: { cityId_type: { cityId: raid.originCityId, type: u.type } },
                        create: { cityId: raid.originCityId, type: u.type, count: u.count },
                        update: { count: { increment: u.count } }
                    });
                }
                await txAny.raidMovement.delete({ where: { id: raid.id } });
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

function getCampName(type: string, tier: number): string {
    const names: Record<string, Record<number, string>> = {
        'BARBARIAN_T1': { 1: 'Aldea Nómada' },
        'BARBARIAN_T2': { 2: 'Campamento Fortificado' },
        'RUIN_T3': { 3: 'Ruinas Antiguas' },
    };
    return names[type]?.[tier] || `Campamento Tier ${tier}`;
}

