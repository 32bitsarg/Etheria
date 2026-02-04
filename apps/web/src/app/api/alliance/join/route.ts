
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { allianceId, playerId } = body;

        if (!allianceId || !playerId) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
        }

        // Check if player already in an alliance
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: { allianceMember: true }
        });

        if (!player) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
        if (player.allianceMember) {
            return NextResponse.json({ error: 'Ya perteneces a una alianza' }, { status: 400 });
        }

        // Join
        await prisma.allianceMember.create({
            data: {
                allianceId,
                playerId,
                rank: 'MEMBER'
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error joining alliance:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
