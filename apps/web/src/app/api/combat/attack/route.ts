import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UnitType, UNIT_STATS } from '@lootsystem/game-engine';
import { gameEvents, EVENTS } from '@/lib/gameEvents';

/**
 * POST /api/combat/attack
 * Start a troop movement to attack another city
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { attackerPlayerId, targetCityId, units } = body;

        if (!attackerPlayerId || !targetCityId || !units || Object.keys(units).length === 0) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // 1. Obtener datos del atacante y su ciudad
        const attacker = await prisma.player.findFirst({
            where: {
                OR: [
                    { id: attackerPlayerId },
                    { userId: attackerPlayerId }
                ]
            },
            include: {
                city: {
                    include: { units: true }
                }
            }
        });

        if (!attacker || !attacker.city) {
            return NextResponse.json({ error: 'Attacker not found' }, { status: 404 });
        }

        // 2. Obtener datos de la ciudad objetivo
        const targetCity = await prisma.city.findUnique({
            where: { id: targetCityId }
        });

        if (!targetCity) {
            return NextResponse.json({ error: 'Target city not found' }, { status: 404 });
        }

        if (targetCity.id === attacker.city.id) {
            return NextResponse.json({ error: 'Cannot attack your own city' }, { status: 400 });
        }

        // 3. Validar tropas suficientes
        // units: { [unitType]: count }
        for (const [type, count] of Object.entries(units)) {
            const playerUnit = attacker.city.units.find(u => u.type === type);
            if (!playerUnit || playerUnit.count < (count as number)) {
                return NextResponse.json({ error: `Not enough units of type ${type}` }, { status: 400 });
            }
        }

        // 4. Calcular velocidad y tiempo de llegada
        // La velocidad del grupo es la de la unidad más lenta
        let minSpeed = Infinity;
        for (const type of Object.keys(units)) {
            const stats = UNIT_STATS[type as UnitType];
            if (stats && stats.stats.speed < minSpeed) {
                minSpeed = stats.stats.speed;
            }
        }

        // Distancia euclidiana
        const dx = targetCity.x - attacker.city.x;
        const dy = targetCity.y - attacker.city.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Tiempo en segundos = (Distancia / Velocidad) * Factor_Escala
        // Factor de escala ajustable para que los viajes duren razonablemente
        const TRAVEL_TIME_FACTOR = 10;
        const travelTimeSeconds = Math.max(30, Math.floor((distance / minSpeed) * TRAVEL_TIME_FACTOR));
        const endTime = new Date(Date.now() + travelTimeSeconds * 1000);

        // 5. Transacción: Quitar tropas de la ciudad + Crear movimiento
        await prisma.$transaction(async (tx) => {
            // Quitar unidades de la ciudad
            for (const [type, count] of Object.entries(units)) {
                await tx.unit.update({
                    where: {
                        cityId_type: {
                            cityId: attacker.city!.id,
                            type
                        }
                    },
                    data: {
                        count: { decrement: count as number }
                    }
                });
            }

            // Crear el movimiento
            // Almacenamos las unidades como un array de objetos { type, count } para consistencia
            const unitsArray = Object.entries(units).map(([type, count]) => ({ type, count: count as number }));

            await tx.combatMovement.create({
                data: {
                    type: 'ATTACK',
                    originCityId: attacker.city!.id,
                    targetCityId: targetCity.id,
                    units: unitsArray as any,
                    endTime: endTime
                }
            });
        });

        // Emitir evento para notificar al defensor en tiempo real
        gameEvents.emit(EVENTS.ATTACK_INCOMING, {
            attackerId: attacker.id,
            targetPlayerId: targetCity.playerId,
            targetCityId: targetCity.id,
            originCityName: attacker.city.name,
            endTime: endTime
        });

        return NextResponse.json({
            success: true,
            arrivalTime: endTime,
            travelTimeSeconds
        });

    } catch (error) {
        console.error('Attack API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
