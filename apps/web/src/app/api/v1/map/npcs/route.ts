import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/map/npcs
 * Lista campamentos NPC en una zona del mapa
 * Query params: x1, y1, x2, y2 (área rectangular)
 * includeDestroyed: si es true, incluye campamentos destruidos
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const x1 = parseInt(searchParams.get('x1') || '0');
        const y1 = parseInt(searchParams.get('y1') || '0');
        const x2 = parseInt(searchParams.get('x2') || '100');
        const y2 = parseInt(searchParams.get('y2') || '100');
        const includeDestroyed = searchParams.get('includeDestroyed') === 'true';

        const camps = await (prisma as any).nPCCamp.findMany({
            where: {
                x: { gte: x1, lte: x2 },
                y: { gte: y1, lte: y2 },
                // Incluir destruidos solo si se solicita
                ...(includeDestroyed ? {} : { isDestroyed: false }),
            },
            select: {
                id: true,
                type: true,
                tier: true,
                x: true,
                y: true,
                isDestroyed: true,
                respawnAt: true,
            },
            orderBy: [{ tier: 'asc' }, { x: 'asc' }],
        });

        // Mapear a formato frontend con imagen correspondiente
        const campsWithImages = camps.map((camp: any) => ({
            ...camp,
            image: getCampImage(camp.type, camp.tier, camp.isDestroyed),
            name: getCampName(camp.type, camp.tier),
        }));

        return NextResponse.json({
            success: true,
            camps: campsWithImages,
            count: camps.length,
        });
    } catch (error) {
        console.error('Error fetching NPC camps:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getCampImage(type: string, tier: number, isDestroyed: boolean): string {
    // Si está destruido, mostrar imagen de derrota
    if (isDestroyed) {
        return '/assets/raids/barbarosdefeat.webp';
    }

    if (type.startsWith('BARBARIAN')) {
        return `/assets/raids/barbarost${tier}.webp`;
    }
    // Para otros tipos en el futuro
    return `/assets/raids/barbarost1.webp`;
}

function getCampName(type: string, tier: number): string {
    const names: Record<string, Record<number, string>> = {
        'BARBARIAN_T1': { 1: 'Aldea Nómada' },
        'BARBARIAN_T2': { 2: 'Campamento Fortificado' },
        'RUIN_T3': { 3: 'Ruinas Antiguas' },
    };
    return names[type]?.[tier] || `Campamento Tier ${tier}`;
}

