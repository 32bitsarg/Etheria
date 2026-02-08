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
        const { reportId, all } = await request.json();

        const player = await prisma.player.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        if (all) {
            // Eliminar todos los informes del jugador
            await prisma.combatReport.deleteMany({
                where: {
                    OR: [
                        { attackerId: player.id },
                        { defenderId: player.id }
                    ]
                }
            });
        } else if (reportId) {
            // Eliminar solo uno
            await prisma.combatReport.delete({
                where: {
                    id: reportId,
                    OR: [
                        { attackerId: player.id },
                        { defenderId: player.id }
                    ]
                }
            });
        } else {
            return NextResponse.json({ error: 'Action required' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
