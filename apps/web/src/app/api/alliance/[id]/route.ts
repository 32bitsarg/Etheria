
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        // If 'list' is passed, return list of all alliances
        if (id === 'list') {
            const alliances = await prisma.alliance.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { members: true }
                    }
                }
            });
            return NextResponse.json(alliances);
        }

        const alliance = await prisma.alliance.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        player: {
                            select: {
                                id: true,
                                race: true,
                                // Add user name if needed, assuming city name is player name for now or stored in player
                                city: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!alliance) return NextResponse.json({ error: 'Alianza no encontrada' }, { status: 404 });

        return NextResponse.json(alliance);
    } catch (error) {
        console.error('Error getting alliance:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
