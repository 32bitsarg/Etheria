import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UNIT_STATS, UnitType } from '@lootsystem/game-engine';
import { getAuthPlayer } from '@/lib/player-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');

        if (!playerId) return NextResponse.json({ error: 'Player ID required' }, { status: 400 });

        const player = await (prisma.player as any).findUnique({
            where: { id: playerId },
            include: {
                user: { select: { username: true, createdAt: true } },
                city: { include: { buildings: true, units: true } },
                attackerReports: { take: 10, orderBy: { timestamp: 'desc' }, select: { id: true, timestamp: true, won: true, targetCityName: true } },
                defenderReports: { take: 10, orderBy: { timestamp: 'desc' }, select: { id: true, timestamp: true, won: true, originCityName: true } },
                allianceMember: { include: { alliance: { select: { name: true, tag: true } } } }
            }
        });

        if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

        // Calculate lifetime stats
        const totalAttackerWins = await (prisma.combatReport as any).count({ where: { attackerId: player.id, won: true } });
        const totalAttackerLosses = await (prisma.combatReport as any).count({ where: { attackerId: player.id, won: false } });
        const totalDefenderWins = await (prisma.combatReport as any).count({ where: { defenderId: player.id, won: false } });
        const totalDefenderLosses = await (prisma.combatReport as any).count({ where: { defenderId: player.id, won: true } });

        const wins = totalAttackerWins + totalDefenderWins;
        const losses = totalAttackerLosses + totalDefenderLosses;
        const totalBattles = wins + losses;
        const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

        const history = [
            ...player.attackerReports.map((r: any) => ({ id: r.id, timestamp: r.timestamp, won: r.won, type: 'Ataque', opponent: r.targetCityName })),
            ...player.defenderReports.map((r: any) => ({ id: r.id, timestamp: r.timestamp, won: !r.won, type: 'Defensa', opponent: r.originCityName }))
        ].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

        return NextResponse.json({
            success: true,
            profile: {
                id: player.id, username: player.user.username, race: player.race,
                level: player.level, experience: player.experience, bio: player.bio || '',
                createdAt: player.user.createdAt, city: player.city?.name,
                alliance: player.allianceMember?.alliance, militaryPower: player.militaryPower,
                wins, losses, totalBattles, winRate,
                history
            }
        });
    } catch (error) {
        console.error('V1 Profile GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { bio } = await request.json();
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await (prisma.player as any).update({
            where: { id: player.id },
            data: { bio }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('V1 Profile PATCH error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
