import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UNIT_STATS, UnitType } from '@lootsystem/game-engine';

/**
 * GET /api/player/profile?playerId=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');

        if (!playerId) {
            return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
        }

        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                user: { select: { username: true, createdAt: true } },
                city: {
                    include: {
                        buildings: true,
                        units: true
                    }
                },
                attackerReports: {
                    take: 10,
                    orderBy: { timestamp: 'desc' },
                    select: { id: true, timestamp: true, won: true, targetCityName: true, attackerId: true, defenderId: true }
                },
                defenderReports: {
                    take: 10,
                    orderBy: { timestamp: 'desc' },
                    select: { id: true, timestamp: true, won: true, originCityName: true, attackerId: true, defenderId: true }
                },
                allianceMember: {
                    include: {
                        alliance: { select: { name: true, tag: true } }
                    }
                }
            }
        });

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        // Calculate Military Power
        let militaryPower = 0;
        if (player.city?.units) {
            for (const unit of player.city.units) {
                const stats = UNIT_STATS[unit.type as UnitType]?.stats;
                if (stats) {
                    militaryPower += unit.count * (stats.attack + stats.defense);
                }
            }
        }
        militaryPower = Math.floor(militaryPower / 10);

        // Calculate Winrate
        const totalAttacks = player.attackerReports.length;
        const totalDefenses = player.defenderReports.length;
        const totalBattles = totalAttacks + totalDefenses;

        const winsAsAttacker = player.attackerReports.filter(r => r.won).length;
        const winsAsDefender = player.defenderReports.filter(r => !r.won).length;

        const totalWins = winsAsAttacker + winsAsDefender;
        const winRate = totalBattles > 0 ? Math.floor((totalWins / totalBattles) * 100) : 0;

        // Simplify and anonimize Battle History
        const history = [
            ...player.attackerReports.map(r => ({
                id: r.id,
                timestamp: r.timestamp,
                won: r.won,
                type: 'Ataque',
                opponent: r.targetCityName
            })),
            ...player.defenderReports.map(r => ({
                id: r.id,
                timestamp: r.timestamp,
                won: !r.won,
                type: 'Defensa',
                opponent: r.originCityName
            }))
        ]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            profile: {
                id: player.id,
                username: player.user.username,
                race: player.race,
                level: (player as any).level || 1,
                experience: (player as any).experience || 0,
                bio: (player as any).bio || '',
                createdAt: player.user.createdAt,
                city: player.city?.name,
                alliance: player.allianceMember?.alliance,
                militaryPower,
                winRate,
                totalBattles,
                wins: totalWins,
                losses: totalBattles - totalWins,
                history
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PATCH /api/player/profile
 * Update bio
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { playerId, bio } = body;

        if (!playerId) {
            return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
        }

        await (prisma.player as any).update({
            where: { id: playerId },
            data: { bio }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
