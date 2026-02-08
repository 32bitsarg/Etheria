import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

/**
 * GET /api/v1/raids/reports
 * Lista los informes de asaltos NPC del jugador
 */
export async function GET() {
    try {
        const player = await getAuthPlayer();
        if (!player) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Por ahora usamos CombatReport filtrando por NPCs
        // En el futuro podríamos tener una tabla separada RaidReport
        const reports = await (prisma as any).combatReport.findMany({
            where: {
                attackerId: player.id,
                // Identificar raids por nombre de ciudad objetivo que empieza con NPC_
                targetCityName: { startsWith: 'NPC_' },
            },
            orderBy: { timestamp: 'desc' },
            take: 50,
        });

        return NextResponse.json({
            success: true,
            reports: reports.map((r: any) => ({
                id: r.id,
                campName: r.targetCityName.replace('NPC_', ''),
                won: r.won,
                loot: {
                    wood: r.lootedWood,
                    iron: r.lootedIron,
                    gold: r.lootedGold,
                },
                troopSummary: r.troopSummary,
                timestamp: r.timestamp,
                read: r.read,
            })),
        });
    } catch (error) {
        console.error('Raid Reports Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
