import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/admin/grant-resources
 * Grant resources to a player (for testing/admin purposes)
 * 
 * This should be protected in production!
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId, wood = 0, iron = 0, gold = 0 } = body;

        if (!playerId) {
            return NextResponse.json(
                { error: 'Player ID is required' },
                { status: 400 }
            );
        }

        // Get current player
        const player = await prisma.player.findUnique({
            where: { id: playerId },
        });

        if (!player) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }

        // Update resources
        const updatedPlayer = await prisma.player.update({
            where: { id: playerId },
            data: {
                wood: player.wood + wood,
                iron: player.iron + iron,
                gold: player.gold + gold,
            },
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
            player: updatedPlayer,
            granted: { wood, iron, gold },
        });

    } catch (error) {
        console.error('Grant resources error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
