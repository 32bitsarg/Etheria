import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const { allianceId } = await request.json();
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (player.allianceMember) return NextResponse.json({ error: 'Ya perteneces a una alianza' }, { status: 400 });

        const alliance = await prisma.alliance.findUnique({ where: { id: allianceId } });
        if (!alliance) return NextResponse.json({ error: 'Alianza no encontrada' }, { status: 404 });

        await prisma.allianceMember.create({
            data: { allianceId, playerId: player.id, rank: 'MEMBER' }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('V1 Alliance Join error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
