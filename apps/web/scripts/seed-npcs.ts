/**
 * Script para generar campamentos NPC en el mapa
 * Ejecutar con: DATABASE_URL="..." npx tsx scripts/seed-npcs.ts
 */

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lootsystem?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configuración de generación
const CONFIG = {
    mapSize: 100, // Mapa de 100x100
    campsPerTier: {
        1: 40, // Tier 1: 40 campamentos (zona central)
        2: 25, // Tier 2: 25 campamentos (zona intermedia)
        3: 10, // Tier 3: 10 ruinas (zona exterior)
    },
    zoneRanges: {
        1: { minDist: 0, maxDist: 35 },   // Centro
        2: { minDist: 25, maxDist: 50 },  // Intermedio
        3: { minDist: 40, maxDist: 50 },  // Exterior
    },
};

// Definiciones de campamentos
const CAMP_DEFINITIONS = {
    1: {
        type: 'BARBARIAN_T1',
        treasureClassId: 'tc_campamento_barbaro_t1',
        units: { barbarian_light: () => randomInt(5, 15) },
    },
    2: {
        type: 'BARBARIAN_T2',
        treasureClassId: 'tc_campamento_barbaro_t2',
        units: {
            barbarian_light: () => randomInt(20, 40),
            barbarian_archer: () => randomInt(5, 15),
        },
    },
    3: {
        type: 'RUIN_T3',
        treasureClassId: 'tc_ruina_t3',
        units: {
            guardian: () => randomInt(10, 25),
        },
    },
};

const GRID_COUNT = 20; // Mismo valor que en WorldMap.tsx

function getCell(val: number): number {
    return Math.floor(Math.min(99, Math.max(0, val)) / (100 / GRID_COUNT));
}

function getCellKey(x: number, y: number): string {
    return `${getCell(x)},${getCell(y)}`;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPosition(tier: number): { x: number; y: number } {
    const center = CONFIG.mapSize / 2;
    const zone = CONFIG.zoneRanges[tier as keyof typeof CONFIG.zoneRanges];

    // Generar ángulo y distancia aleatoria
    const angle = Math.random() * 2 * Math.PI;
    const distance = randomInt(zone.minDist, zone.maxDist);

    const x = Math.round(center + Math.cos(angle) * distance);
    const y = Math.round(center + Math.sin(angle) * distance);

    // Asegurar que esté dentro del mapa
    return {
        x: Math.max(0, Math.min(CONFIG.mapSize, x)),
        y: Math.max(0, Math.min(CONFIG.mapSize, y)),
    };
}

async function seedNPCCamps() {
    console.log('🏕️ Generando campamentos NPC...\n');

    // Limpiar campamentos existentes
    await (prisma as any).nPCCamp.deleteMany({});
    console.log('✓ Campamentos anteriores eliminados');

    const createdCamps: any[] = [];
    const usedCells = new Set<string>(); // Usamos celdas, no posiciones exactas

    for (const [tierStr, count] of Object.entries(CONFIG.campsPerTier)) {
        const tier = parseInt(tierStr);
        const def = CAMP_DEFINITIONS[tier as keyof typeof CAMP_DEFINITIONS];

        console.log(`\n📍 Generando ${count} campamentos Tier ${tier} (${def.type})...`);

        for (let i = 0; i < count; i++) {
            // Encontrar celda/isla única
            let pos: { x: number; y: number };
            let cellKey: string;
            let attempts = 0;
            do {
                pos = getRandomPosition(tier);
                cellKey = getCellKey(pos.x, pos.y);
                attempts++;
            } while (usedCells.has(cellKey) && attempts < 500);

            if (attempts >= 500) {
                console.log(`  ⚠️ No se encontró celda libre para Tier ${tier}, saltando...`);
                continue;
            }

            usedCells.add(cellKey);

            // Generar unidades
            const units: Record<string, number> = {};
            for (const [unitType, generator] of Object.entries(def.units)) {
                units[unitType] = (generator as () => number)();
            }

            const camp = await (prisma as any).nPCCamp.create({
                data: {
                    type: def.type,
                    tier,
                    x: pos.x,
                    y: pos.y,
                    units,
                    treasureClassId: def.treasureClassId,
                    isDestroyed: false,
                },
            });

            createdCamps.push(camp);
            process.stdout.write(`  ✓ Camp ${i + 1}/${count} en isla (${getCell(pos.x)}, ${getCell(pos.y)})\r`);
        }
        console.log(''); // Nueva línea
    }

    console.log(`\n✅ Total: ${createdCamps.length} campamentos creados`);

    // Mostrar estadísticas
    const stats = createdCamps.reduce((acc, c) => {
        acc[c.tier] = (acc[c.tier] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    console.log('\n📊 Distribución:');
    for (const [tier, count] of Object.entries(stats)) {
        console.log(`   Tier ${tier}: ${count} campamentos`);
    }
}

seedNPCCamps()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
