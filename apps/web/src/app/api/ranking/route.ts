import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const players = await (prisma.player as any).findMany({
            take: limit,
            skip: offset,
            orderBy: [
                { militaryPower: 'desc' },
                { level: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                allianceMember: {
                    include: {
                        alliance: {
                            select: {
                                name: true,
                                tag: true
                            }
                        }
                    }
                },
                city: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const totalPlayers = await prisma.player.count();

        const ranking = players.map((p: any, index: number) => ({
            rank: offset + index + 1,
            id: p.id,
            username: p.user.username,
            race: p.race,
            level: p.level,
            militaryPower: p.militaryPower,
            cityName: p.city?.name,
            alliance: p.allianceMember?.alliance ? {
                name: p.allianceMember.alliance.name,
                tag: p.allianceMember.alliance.tag
            } : null
        }));

        return NextResponse.json({
            success: true,
            ranking,
            pagination: {
                total: totalPlayers,
                limit,
                offset
            }
        });
    } catch (error) {
        console.error('Ranking fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
