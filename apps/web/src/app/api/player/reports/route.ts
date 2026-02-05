import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');

        if (!playerId) {
            return NextResponse.json(
                { error: 'Player ID is required' },
                { status: 400 }
            );
        }

        const reports = await prisma.combatReport.findMany({
            where: {
                OR: [
                    { attackerId: playerId },
                    { defenderId: playerId }
                ]
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 50 // Limit to last 50 reports
        });

        return NextResponse.json({
            success: true,
            reports
        });

    } catch (error: any) {
        console.error('Fetch reports error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
