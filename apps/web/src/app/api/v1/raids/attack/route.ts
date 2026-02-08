import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';
import { UnitType, UNIT_STATS } from '@lootsystem/game-engine';

/**
 * POST /api/v1/raids/attack
 * Inicia un ataque a un campamento NPC (crea marcha)
 */
export async function POST(request: NextRequest) {
    try {
        const player = await getAuthPlayer();
        if (!player) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { campId, units } = body;

        if (!campId || !units || Object.keys(units).length === 0) {
            return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
        }

        // Obtener campamento
        const camp = await (prisma as any).nPCCamp.findUnique({
            where: { id: campId },
        });

        if (!camp) {
            return NextResponse.json({ error: 'Campamento no encontrado' }, { status: 404 });
        }

        if (camp.isDestroyed) {
            return NextResponse.json({ error: 'Este campamento ya fue destruido' }, { status: 400 });
        }

        // Obtener ciudad del jugador
        const city = await (prisma as any).city.findUnique({
            where: { playerId: player.id },
            include: { units: true },
        });

        if (!city) {
            return NextResponse.json({ error: 'No tienes una ciudad' }, { status: 400 });
        }

        // Verificar que el jugador tiene las unidades
        const playerUnits = city.units.reduce((acc: Record<string, number>, u: any) => {
            acc[u.type] = u.count;
            return acc;
        }, {});

        let minSpeed = Infinity;
        for (const [unitType, count] of Object.entries(units)) {
            if (!playerUnits[unitType] || playerUnits[unitType] < (count as number)) {
                return NextResponse.json({
                    error: `No tienes suficientes ${unitType}`
                }, { status: 400 });
            }

            // Calcular velocidad mínima de la marcha
            const stats = UNIT_STATS[unitType as UnitType];
            if (stats && stats.stats.speed < minSpeed) {
                minSpeed = stats.stats.speed;
            }
        }

        // Calcular distancia y tiempo de viaje
        // Las coordenadas del campamento (0-100) -> convertir a escala comparable con ciudad
        const campWorldX = camp.x;
        const campWorldY = camp.y;

        const distance = Math.sqrt(
            Math.pow(campWorldX - city.x, 2) +
            Math.pow(campWorldY - city.y, 2)
        );

        // Tiempo mínimo 30 segundos, máximo basado en distancia y velocidad
        const travelTimeSeconds = Math.max(30, Math.floor((distance / (minSpeed || 5)) * 10));
        const endTime = new Date(Date.now() + travelTimeSeconds * 1000);

        // Crear la marcha y descontar unidades
        await prisma.$transaction(async (tx) => {
            const txAny = tx as any;

            // Descontar unidades del jugador
            for (const [unitType, count] of Object.entries(units)) {
                await txAny.unit.update({
                    where: { cityId_type: { cityId: city.id, type: unitType } },
                    data: { count: { decrement: count as number } },
                });
            }

            // Crear movimiento de raid
            await txAny.raidMovement.create({
                data: {
                    playerId: player.id,
                    originCityId: city.id,
                    targetCampId: campId,
                    units: Object.entries(units).map(([type, count]) => ({ type, count })),
                    endTime,
                    status: 'TRAVELING',
                },
            });
        });

        return NextResponse.json({
            success: true,
            message: '¡Tropas enviadas!',
            arrivalTime: endTime,
            travelTimeSeconds,
            campName: getCampName(camp.type, camp.tier),
        });

    } catch (error) {
        console.error('Raid Attack Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
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
