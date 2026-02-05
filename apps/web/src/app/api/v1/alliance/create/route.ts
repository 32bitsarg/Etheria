import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const { name, tag } = await request.json();
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (player.allianceMember) return NextResponse.json({ error: 'Ya perteneces a una alianza' }, { status: 400 });

        if (!name || !tag) return NextResponse.json({ error: 'Nombre y Tag requeridos' }, { status: 400 });

        const exists = await prisma.alliance.findFirst({
            where: {
                OR: [
                    { name: { equals: name, mode: 'insensitive' } },
                    { tag: { equals: tag, mode: 'insensitive' } }
                ]
            }
        });

        if (exists) return NextResponse.json({ error: 'Nombre o Tag ya en uso' }, { status: 400 });

        const alliance = await prisma.alliance.create({
            data: {
                name, tag,
                members: { create: { playerId: player.id, rank: 'LEADER' } }
            }
        });

        return NextResponse.json({ success: true, alliance });
    } catch (error) {
        console.error('V1 Alliance Create error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
