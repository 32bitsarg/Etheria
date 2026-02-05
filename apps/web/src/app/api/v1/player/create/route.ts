import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createInitialBuildings, BuildingState } from '@lootsystem/game-engine';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { race, cityName } = body;
        const headersList = await headers();
        const userId = headersList.get('x-user-id');

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!race || !['elfo', 'humano', 'orco', 'enano'].includes(race)) {
            return NextResponse.json({ error: 'Invalid race selection' }, { status: 400 });
        }

        if (!cityName || cityName.trim().length < 2) {
            return NextResponse.json({ error: 'City name too short' }, { status: 400 });
        }

        const existingPlayer = await prisma.player.findUnique({ where: { userId } });
        if (existingPlayer) return NextResponse.json({ error: 'Player already exists' }, { status: 400 });

        const initialBuildings = createInitialBuildings();

        // Find island logic
        let x = 0, y = 0, isFound = false, attempts = 0;
        const GRID_COUNT = 20;
        const CAPACITIES = { large: 8, medium: 5, mini: 3 };

        while (!isFound && attempts < 50) {
            x = Math.floor(Math.random() * 100);
            y = Math.floor(Math.random() * 100);
            const col = Math.floor(x / (100 / GRID_COUNT));
            const row = Math.floor(y / (100 / GRID_COUNT));
            const seed = row * GRID_COUNT + col;
            const type = seed % 3 === 0 ? 'large' : seed % 2 === 0 ? 'medium' : 'mini';
            const maxCapacity = CAPACITIES[type];

            const inhabitantCount = await prisma.city.count({
                where: { x: { gte: col * 5, lt: (col + 1) * 5 }, y: { gte: row * 5, lt: (row + 1) * 5 } }
            });

            if (inhabitantCount < maxCapacity) isFound = true;
            attempts++;
        }

        const player = await prisma.player.create({
            data: {
                userId, race, wood: 500, iron: 300, gold: 200, populationUsed: 0, populationMax: 200,
                city: {
                    create: {
                        name: cityName.trim(), x, y,
                        buildings: { create: initialBuildings.map((b: BuildingState) => ({ type: b.type, level: b.level })) }
                    }
                }
            },
            include: { city: { include: { buildings: true, constructionQueue: true, trainingQueue: true, units: true } } }
        });

        return NextResponse.json({ success: true, player });

    } catch (error) {
        console.error('V1 Create Player error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
