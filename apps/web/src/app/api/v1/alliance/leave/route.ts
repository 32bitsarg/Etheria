import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();

        if (!player || !player.allianceMember) return NextResponse.json({ error: 'No perteneces a una alianza' }, { status: 400 });

        if (player.allianceMember.rank === 'LEADER') {
            return NextResponse.json({ error: 'El líder debe disolver la alianza o transferir el liderazgo' }, { status: 400 });
        }

        await prisma.allianceMember.delete({ where: { id: player.allianceMember.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('V1 Alliance Leave error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
