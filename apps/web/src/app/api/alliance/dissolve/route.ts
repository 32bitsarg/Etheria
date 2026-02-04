
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { playerId } = body;

        console.log("Dissolving alliance for player:", playerId);

        if (!playerId) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
        }

        const member = await prisma.allianceMember.findUnique({
            where: { playerId }
        });

        if (!member) {
            return NextResponse.json({ error: 'No perteneces a ninguna alianza' }, { status: 400 });
        }

        if (member.rank !== 'LEADER') {
            return NextResponse.json({ error: 'Solo el líder puede disolver la alianza' }, { status: 403 });
        }

        // Delete Alliance (Cascade will delete members)
        await prisma.alliance.delete({
            where: { id: member.allianceId }
        });

        console.log("Alliance dissolved:", member.allianceId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error dissolving alliance:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
