import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const player = await prisma.player.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        const reports = await prisma.combatReport.findMany({
            where: {
                OR: [
                    { attackerId: player.id },
                    { defenderId: player.id }
                ]
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 50
        });

        return NextResponse.json({ success: true, reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
