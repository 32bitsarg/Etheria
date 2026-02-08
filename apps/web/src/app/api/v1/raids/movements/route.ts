import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

/**
 * GET /api/v1/raids/movements
 * Obtiene las raids activas del jugador (en viaje o retornando)
 */
export async function GET() {
    try {
        const player = await getAuthPlayer();
        if (!player) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Obtener movimientos de raid activos
        const raids = await (prisma as any).raidMovement.findMany({
            where: {
                playerId: player.id,
                status: { in: ['TRAVELING', 'RETURNING'] },
            },
            orderBy: { endTime: 'asc' },
        });

        // Obtener info de campamentos para los raids en viaje
        const campIds = raids
            .filter((r: any) => r.status === 'TRAVELING')
            .map((r: any) => r.targetCampId);

        const camps = await (prisma as any).nPCCamp.findMany({
            where: { id: { in: campIds } },
            select: { id: true, type: true, tier: true },
        });

        const campMap = new Map<string, { id: string; type: string; tier: number }>(
            camps.map((c: any) => [c.id, c])
        );

        // Formatear para el frontend
        const formattedRaids = raids.map((raid: any) => {
            const camp = campMap.get(raid.targetCampId);
            const campName = camp
                ? getCampName(camp.type, camp.tier)
                : 'Campamento desconocido';

            return {
                id: raid.id,
                type: raid.status === 'TRAVELING' ? 'RAID' : 'RAID_RETURN',
                endTime: raid.endTime,
                campName,
                units: raid.units,
                status: raid.status,
            };
        });

        return NextResponse.json({
            success: true,
            raids: formattedRaids,
        });

    } catch (error) {
        console.error('Raids Movements Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

function getCampName(type: string, tier: number): string {
    const names: Record<string, Record<number, string>> = {
        'BARBARIAN_T1': { 1: 'Aldea Nómada' },
        'BARBARIAN_T2': { 2: 'Campamento Fortificado' },
        'RUIN_T3': { 3: 'Ruinas Antiguas' },
    };
    return names[type]?.[tier] || `Campamento Tier ${tier}`;
}
