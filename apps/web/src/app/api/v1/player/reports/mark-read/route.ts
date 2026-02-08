import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST() {
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

        // Marcar todos los informes del jugador como leídos
        await prisma.combatReport.updateMany({
            where: {
                OR: [
                    { attackerId: player.id },
                    { defenderId: player.id }
                ],
                read: false
            },
            data: {
                read: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking reports as read:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
