
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, tag, playerId } = body;

        if (!name || !tag || !playerId) {
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

        // Check if name or tag exists
        const exists = await prisma.alliance.findFirst({
            where: {
                OR: [
                    { name: { equals: name, mode: 'insensitive' } },
                    { tag: { equals: tag, mode: 'insensitive' } }
                ]
            }
        });

        if (exists) {
            return NextResponse.json({ error: 'Nombre o Tag ya en uso' }, { status: 400 });
        }

        // Create Alliance
        const alliance = await prisma.alliance.create({
            data: {
                name,
                tag,
                members: {
                    create: {
                        playerId,
                        rank: 'LEADER'
                    }
                }
            }
        });

        return NextResponse.json({ success: true, alliance });
    } catch (error) {
        console.error('Error creating alliance:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
