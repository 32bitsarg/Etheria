import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();

        if (!player || !player.allianceMember || player.allianceMember.rank !== 'LEADER') {
            return NextResponse.json({ error: 'Solo el líder puede disolver la alianza' }, { status: 403 });
        }

        await prisma.alliance.delete({ where: { id: player.allianceMember.allianceId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('V1 Alliance Dissolve error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
