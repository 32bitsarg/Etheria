
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { playerId } = body;

        if (!playerId) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
        }

        const member = await prisma.allianceMember.findUnique({
            where: { playerId }
        });

        if (!member) {
            return NextResponse.json({ error: 'No perteneces a ninguna alianza' }, { status: 400 });
        }

        // Prevent leader from leaving without transferring or dissolving
        if (member.rank === 'LEADER') {
            // Check if only member
            const count = await prisma.allianceMember.count({
                where: { allianceId: member.allianceId }
            });

            if (count > 1) {
                return NextResponse.json({ error: 'El líder no puede salir sin transferir liderazgo primero. Usa disolver si eres el último.' }, { status: 400 });
            }
            // If leader is alone, allow leave (which effectively makes empty alliance, or we autodelete)
            // Ideally we should prefer dissolve, but for simplicity let's allow deleting the member and if count is 0 delete alliance.
        }

        await prisma.allianceMember.delete({
            where: { playerId }
        });

        // Cleanup empty alliance
        const membersLeft = await prisma.allianceMember.count({
            where: { allianceId: member.allianceId }
        });

        if (membersLeft === 0) {
            await prisma.alliance.delete({
                where: { id: member.allianceId }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error leaving alliance:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
