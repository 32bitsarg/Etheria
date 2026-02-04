import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createInitialBuildings, BuildingState } from '@lootsystem/game-engine';

/**
 * POST /api/player/create
 * Create player with race selection and city
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, race, cityName } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!race || !['elfo', 'humano', 'orco', 'enano'].includes(race)) {
            return NextResponse.json(
                { error: 'Invalid race selection' },
                { status: 400 }
            );
        }

        if (!cityName || cityName.trim().length < 2) {
            return NextResponse.json(
                { error: 'City name must be at least 2 characters' },
                { status: 400 }
            );
        }

        // Check if player already exists
        const existingPlayer = await prisma.player.findUnique({
            where: { userId },
        });

        if (existingPlayer) {
            return NextResponse.json(
                { error: 'Player already exists for this user' },
                { status: 400 }
            );
        }

        // Create initial buildings data
        const initialBuildings = createInitialBuildings();

        // Create player with city and buildings
        const player = await prisma.player.create({
            data: {
                userId,
                race,
                wood: 500,
                iron: 300,
                gold: 200,
                populationUsed: 0,
                populationMax: 200,
                city: {
                    create: {
                        name: cityName.trim(),
                        x: Math.floor(Math.random() * 100),
                        y: Math.floor(Math.random() * 100),
                        buildings: {
                            create: initialBuildings.map((b: BuildingState) => ({
                                type: b.type,
                                level: b.level,
                            })),
                        },
                    },
                },
            },
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
            player,
        });

    } catch (error) {
        console.error('Player creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/player/create?userId=xxx
 * Get player data (with resource update)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const player = await prisma.player.findUnique({
            where: { userId },
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

        if (!player) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            player,
        });

    } catch (error) {
        console.error('Get player error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
