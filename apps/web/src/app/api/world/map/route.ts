
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/world/map
 * Fetch all cities for the world map
 */
export async function GET() {
    try {
        const cities = await prisma.city.findMany({
            select: {
                id: true,
                name: true,
                x: true,
                y: true,
                player: {
                    select: {
                        race: true,
                        userId: true,
                        allianceMember: {
                            select: {
                                alliance: {
                                    select: {
                                        name: true,
                                        tag: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            cities
        });

    } catch (error) {
        console.error('World map fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
