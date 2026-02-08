import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { reportId } = await request.json();

        if (!reportId) {
            return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
        }

        const player = await prisma.player.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        // Marcar el informe específico como leído
        await prisma.combatReport.update({
            where: {
                id: reportId,
                OR: [
                    { attackerId: player.id },
                    { defenderId: player.id }
                ]
            },
            data: { read: true }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking report as read:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
