import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UnitType, UNIT_STATS } from '@lootsystem/game-engine';
import { gameEvents, EVENTS } from '@/lib/gameEvents';
import { getAuthPlayer } from '@/lib/player-utils';

export async function POST(request: NextRequest) {
    try {
        const { targetCityId, units } = await request.json();
        const player = await getAuthPlayer();

        if (!player || !player.city) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!targetCityId || !units || Object.keys(units).length === 0) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

        const targetCity = await prisma.city.findUnique({ where: { id: targetCityId } });
        if (!targetCity) return NextResponse.json({ error: 'Target city not found' }, { status: 404 });
        if (targetCity.id === player.city.id) return NextResponse.json({ error: 'Cannot attack yourself' }, { status: 400 });

        // Validate units
        let minSpeed = Infinity;
        for (const [type, count] of Object.entries(units)) {
            const u = player.city.units.find(pu => pu.type === type);
            if (!u || u.count < (count as number)) return NextResponse.json({ error: `Not enough units: ${type}` }, { status: 400 });

            const stats = UNIT_STATS[type as UnitType];
            if (stats && stats.stats.speed < minSpeed) minSpeed = stats.stats.speed;
        }

        // Distance & Time
        const distance = Math.sqrt(Math.pow(targetCity.x - player.city.x, 2) + Math.pow(targetCity.y - player.city.y, 2));
        const travelTimeSeconds = Math.max(30, Math.floor((distance / minSpeed) * 10));
        const endTime = new Date(Date.now() + travelTimeSeconds * 1000);

        await prisma.$transaction(async (tx) => {
            for (const [type, count] of Object.entries(units)) {
                await tx.unit.update({ where: { cityId_type: { cityId: player.city!.id, type } }, data: { count: { decrement: count as number } } });
            }
            await tx.combatMovement.create({
                data: {
                    type: 'ATTACK', originCityId: player.city!.id, targetCityId,
                    units: Object.entries(units).map(([type, count]) => ({ type, count: count as number })) as any,
                    endTime
                }
            });
        });

        gameEvents.emit(EVENTS.ATTACK_INCOMING, { attackerId: player.id, targetPlayerId: targetCity.playerId, targetCityId: targetCity.id, originCityName: player.city.name, endTime });

        return NextResponse.json({ success: true, arrivalTime: endTime, travelTimeSeconds });
    } catch (error) {
        console.error('V1 Combat Attack error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
