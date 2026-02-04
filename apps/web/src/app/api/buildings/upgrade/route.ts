import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    getUpgradeCost,
    getBuildTime,
    BuildingType,
    getMaxPopulation,
    MAX_CONSTRUCTION_QUEUE
} from '@lootsystem/game-engine';

/**
 * POST /api/buildings/upgrade
 * Start building upgrade
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId, buildingType } = body;

        if (!playerId || !buildingType) {
            return NextResponse.json(
                { error: 'Player ID and building type are required' },
                { status: 400 }
            );
        }

        // Get player with city and buildings
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

        // Check queue limit
        if (player.city.constructionQueue.length >= MAX_CONSTRUCTION_QUEUE) {
            return NextResponse.json(
                { error: `Construction queue full (max ${MAX_CONSTRUCTION_QUEUE})` },
                { status: 400 }
            );
        }

        // Check if already in queue
        const inQueue = player.city.constructionQueue.some(
            (item: { buildingType: string }) => item.buildingType === buildingType
        );
        if (inQueue) {
            return NextResponse.json(
                { error: 'Building already in construction queue' },
                { status: 400 }
            );
        }

        // Get current building level
        const building = player.city.buildings.find((b: { type: string; level: number }) => b.type === buildingType);
        const currentLevel = building?.level ?? 0;
        const targetLevel = currentLevel + 1;

        // Get upgrade cost
        const cost = getUpgradeCost(buildingType as BuildingType, targetLevel);

        // Check resources
        if (player.wood < (cost.wood ?? 0) ||
            player.iron < (cost.iron ?? 0) ||
            player.gold < (cost.gold ?? 0)) {
            return NextResponse.json(
                { error: 'Insufficient resources' },
                { status: 400 }
            );
        }

        // Calculate max population based on farm level
        const farmBuilding = player.city.buildings.find((b: { type: string }) => b.type === BuildingType.FARM);
        const farmLevel = farmBuilding?.level ?? 0;
        const maxPopulation = 100 + (farmLevel * 50); // Base 100 + 50 per farm level

        // Check population
        const populationCost = cost.population ?? 0;
        const availablePopulation = maxPopulation - player.populationUsed;

        if (populationCost > 0 && availablePopulation < populationCost) {
            return NextResponse.json(
                { error: `Insufficient population (need ${populationCost}, have ${availablePopulation} available)` },
                { status: 400 }
            );
        }

        // Calculate end time
        const buildTimeSeconds = getBuildTime(buildingType as BuildingType, targetLevel);
        const endTime = new Date(Date.now() + buildTimeSeconds * 1000);

        // Transaction: deduct resources + population + add to queue
        const [updatedPlayer, queueItem] = await prisma.$transaction([
            prisma.player.update({
                where: { id: playerId },
                data: {
                    wood: player.wood - (cost.wood ?? 0),
                    iron: player.iron - (cost.iron ?? 0),
                    gold: player.gold - (cost.gold ?? 0),
                    populationUsed: player.populationUsed + populationCost,
                },
            }),
            prisma.constructionQueueItem.create({
                data: {
                    cityId: player.city.id,
                    buildingType,
                    targetLevel,
                    endTime,
                },
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
        console.error('Building upgrade error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
