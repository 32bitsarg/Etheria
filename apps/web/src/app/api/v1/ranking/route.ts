import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple in-memory cache for ranking
let cachedRanking: any = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const now = Date.now();

        // Only cache the first page (offset 0, limit 50)
        const isDefaultQuery = offset === 0 && limit === 50;

        if (isDefaultQuery && cachedRanking && (now - lastCacheTime < CACHE_TTL)) {
            return NextResponse.json({ success: true, ...cachedRanking, cached: true });
        }

        const players = await (prisma.player as any).findMany({
            take: limit,
            skip: offset,
            orderBy: [{ militaryPower: 'desc' }, { level: 'desc' }],
            include: {
                user: { select: { username: true } },
                allianceMember: { include: { alliance: { select: { name: true, tag: true } } } },
                city: { select: { name: true } }
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

        const responseData = {
            ranking,
            pagination: { total: totalPlayers, limit, offset }
        };

        if (isDefaultQuery) {
            cachedRanking = responseData;
            lastCacheTime = now;
        }

        return NextResponse.json({ success: true, ...responseData });

    } catch (error) {
        console.error('V1 Ranking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
