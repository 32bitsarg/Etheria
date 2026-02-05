import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const alliance = await prisma.alliance.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        player: {
                            include: { user: { select: { username: true } } }
                        }
                    }
                }
            }
        });

        if (!alliance) return NextResponse.json({ error: 'Alianza no encontrada' }, { status: 404 });

        return NextResponse.json({ success: true, alliance });
    } catch (error) {
        console.error('V1 Alliance GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
