import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/v1/raids/respawn
 * Cron job para respawnear campamentos destruidos
 * Debería ejecutarse cada hora
 */
export async function POST(request: Request) {
    try {
        // Verificar clave de API para seguridad
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const now = new Date();

        // Buscar campamentos que deben respawnear
        const campsToRespawn = await (prisma as any).nPCCamp.findMany({
            where: {
                isDestroyed: true,
                respawnAt: { lte: now },
            },
        });

        if (campsToRespawn.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No hay campamentos para respawnear',
                respawned: 0,
            });
        }

        // Generar nuevas posiciones y unidades para cada campamento
        const mapSize = 100;
        const updates = [];

        for (const camp of campsToRespawn) {
            // Nueva posición aleatoria (mantener en zona de tier similar)
            const zone = camp.tier === 1 ? { min: 0, max: 35 } :
                camp.tier === 2 ? { min: 25, max: 50 } :
                    { min: 40, max: 50 };

            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * (zone.max - zone.min) + zone.min;
            const center = mapSize / 2;

            const newX = Math.round(center + Math.cos(angle) * distance);
            const newY = Math.round(center + Math.sin(angle) * distance);

            // Regenerar unidades según tier
            let newUnits: Record<string, number> = {};
            if (camp.tier === 1) {
                newUnits = { barbarian_light: Math.floor(Math.random() * 11) + 5 };
            } else if (camp.tier === 2) {
                newUnits = {
                    barbarian_light: Math.floor(Math.random() * 21) + 20,
                    barbarian_archer: Math.floor(Math.random() * 11) + 5,
                };
            } else {
                newUnits = { guardian: Math.floor(Math.random() * 16) + 10 };
            }

            updates.push(
                (prisma as any).nPCCamp.update({
                    where: { id: camp.id },
                    data: {
                        x: Math.max(0, Math.min(mapSize, newX)),
                        y: Math.max(0, Math.min(mapSize, newY)),
                        units: newUnits,
                        isDestroyed: false,
                        respawnAt: null,
                        lastAttack: null,
                    },
                })
            );
        }

        await Promise.all(updates);

        console.log(`[Raids Respawn] ${campsToRespawn.length} campamentos respawneados`);

        return NextResponse.json({
            success: true,
            message: `${campsToRespawn.length} campamentos respawneados`,
            respawned: campsToRespawn.length,
        });

    } catch (error) {
        console.error('Raids Respawn Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

/**
 * GET para verificar estado actual
 */
export async function GET() {
    try {
        const destroyed = await (prisma as any).nPCCamp.count({
            where: { isDestroyed: true },
        });

        const active = await (prisma as any).nPCCamp.count({
            where: { isDestroyed: false },
        });

        const pendingRespawn = await (prisma as any).nPCCamp.count({
            where: {
                isDestroyed: true,
                respawnAt: { lte: new Date() },
            },
        });

        return NextResponse.json({
            success: true,
            stats: {
                active,
                destroyed,
                pendingRespawn,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
