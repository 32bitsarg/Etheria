import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    getUnitCost,
    getUnitTrainingTime,
    getUnitInfo,
    UnitType,
    BuildingType,
    getBuildingLevel
} from '@lootsystem/game-engine';

/**
 * POST /api/military/train
 * Start training units
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId, unitType, count } = body;

        if (!playerId || !unitType || !count || count <= 0) {
            return NextResponse.json(
                { error: 'Invalid parameters' },
                { status: 400 }
            );
        }

        const quantity = Math.floor(count); // Ensure integer

        // Get player with city
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        buildings: true,
                        trainingQueue: true,
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

        // Get unit info and costs
        const unitInfo = getUnitInfo(unitType as UnitType);
        if (!unitInfo) {
            return NextResponse.json(
                { error: 'Invalid unit type' },
                { status: 400 }
            );
        }

        // Check requirements
        for (const req of unitInfo.requirements) {
            const currentLevel = getBuildingLevel(player.city.buildings, req.building);
            if (currentLevel < req.level) {
                return NextResponse.json(
                    { error: `Requires ${req.building} level ${req.level}` },
                    { status: 400 }
                );
            }
        }

        // Calculate total cost
        const costPerUnit = getUnitCost(unitType as UnitType);
        const totalCost = {
            wood: (costPerUnit.wood || 0) * quantity,
            iron: (costPerUnit.iron || 0) * quantity,
            gold: (costPerUnit.gold || 0) * quantity,
            population: (costPerUnit.population || 0) * quantity,
        };

        // Check resources
        if (player.wood < totalCost.wood ||
            player.iron < totalCost.iron ||
            player.gold < totalCost.gold) {
            return NextResponse.json(
                { error: 'Insufficient resources' },
                { status: 400 }
            );
        }

        // Check population
        const availablePop = player.populationMax - player.populationUsed;
        if (availablePop < totalCost.population) {
            return NextResponse.json(
                { error: `Insufficient population (need ${totalCost.population})` },
                { status: 400 }
            );
        }

        // Calculate timing
        // If queue is not empty, start after the last item
        let startTime = new Date();
        const queue = player.city.trainingQueue.sort((a: any, b: any) =>
            new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        );

        if (queue.length > 0) {
            const lastItem = queue[queue.length - 1];
            startTime = new Date(lastItem.endTime);
            // Ensure start time is not in the past (if previous items finished)
            if (startTime < new Date()) {
                startTime = new Date();
            }
        }

        const trainingTimePerUnit = getUnitTrainingTime(unitType as UnitType);
        const totalTrainingTime = trainingTimePerUnit * quantity;
        const endTime = new Date(startTime.getTime() + (totalTrainingTime * 1000));

        // Transaction
        const [updatedPlayer, queueItem] = await prisma.$transaction([
            prisma.player.update({
                where: { id: playerId },
                data: {
                    wood: player.wood - totalCost.wood,
                    iron: player.iron - totalCost.iron,
                    gold: player.gold - totalCost.gold,
                    populationUsed: player.populationUsed + totalCost.population,
                },
            }),
            prisma.trainingQueueItem.create({
                data: {
                    cityId: player.city.id,
                    unitType,
                    count: quantity,
                    startTime,
                    endTime,
                },
            }),
        ]);

        // Get fresh state
        const refreshedPlayer = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                city: {
                    include: {
                        buildings: true,
                        constructionQueue: true,
                        trainingQueue: true,
                        units: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            player: refreshedPlayer,
        });

    } catch (error) {
        console.error('Training error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
