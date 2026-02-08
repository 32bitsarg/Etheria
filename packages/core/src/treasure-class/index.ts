import { TreasureClass, EntradaTC } from '../types';

/**
 * Treasure Classes por defecto
 */
export const TREASURE_CLASSES_DEFAULT: TreasureClass[] = [
    // === TCs BASE DE ARMAS ===
    {
        id: 'tc_armas_normal',
        nombre: 'Armas Normales',
        nivel: 1,
        picks: 1,
        noDrop: 0,
        entradas: [
            { itemId: 'espada_corta', peso: 30 },
            { itemId: 'hacha_mano', peso: 30 },
            { itemId: 'espada_larga', peso: 20 },
            { itemId: 'hacha_batalla', peso: 15 },
            { itemId: 'arco_corto', peso: 25 },
            { itemId: 'arco_largo', peso: 15 },
        ],
    },
    {
        id: 'tc_armas_avanzadas',
        nombre: 'Armas Avanzadas',
        nivel: 20,
        picks: 1,
        noDrop: 0,
        entradas: [
            { itemId: 'espada_ancha', peso: 25 },
            { itemId: 'espadon', peso: 20 },
            { itemId: 'hacha_batalla', peso: 25 },
            { itemId: 'arco_largo', peso: 30 },
        ],
    },

    // === TCs BASE DE ARMADURAS ===
    {
        id: 'tc_armadura_normal',
        nombre: 'Armadura Normal',
        nivel: 1,
        picks: 1,
        noDrop: 0,
        entradas: [
            { itemId: 'gorra', peso: 25 },
            { itemId: 'armadura_cuero', peso: 25 },
            { itemId: 'guantes_cuero', peso: 20 },
            { itemId: 'botas_cuero', peso: 20 },
            { itemId: 'escudo_madera', peso: 15 },
        ],
    },
    {
        id: 'tc_armadura_avanzada',
        nombre: 'Armadura Avanzada',
        nivel: 15,
        picks: 1,
        noDrop: 0,
        entradas: [
            { itemId: 'yelmo', peso: 20 },
            { itemId: 'corona', peso: 10 },
            { itemId: 'cota_malla', peso: 20 },
            { itemId: 'armadura_placas', peso: 15 },
            { itemId: 'guanteletes', peso: 15 },
            { itemId: 'botas_pesadas', peso: 15 },
            { itemId: 'escudo_torre', peso: 10 },
        ],
    },

    // === TC JOYERÍA ===
    {
        id: 'tc_joyeria',
        nombre: 'Joyería',
        nivel: 1,
        picks: 1,
        noDrop: 0,
        entradas: [
            { itemId: 'anillo', peso: 60 },
            { itemId: 'amuleto', peso: 40 },
        ],
    },

    // === TC CONSUMIBLES ===
    {
        id: 'tc_consumibles',
        nombre: 'Consumibles',
        nivel: 1,
        picks: 1,
        noDrop: 0,
        entradas: [
            { itemId: 'pocion_vida', peso: 60 },
            { itemId: 'pocion_mana', peso: 40 },
        ],
    },

    // === TCs DE MONSTRUOS ===
    {
        id: 'tc_monstruo_normal',
        nombre: 'Monstruo Normal',
        nivel: 1,
        picks: 1,
        noDrop: 70, // 70% chance de no dropear nada
        entradas: [
            { itemId: 'oro', peso: 15 },
            { tcRef: 'tc_consumibles', peso: 8 },
            { tcRef: 'tc_armas_normal', peso: 4 },
            { tcRef: 'tc_armadura_normal', peso: 3 },
        ],
    },
    {
        id: 'tc_monstruo_campeon',
        nombre: 'Monstruo Campeón',
        nivel: 10,
        picks: 2,
        noDrop: 40,
        modificadorLegendario: 1.5,
        modificadorRaro: 1.3,
        entradas: [
            { itemId: 'oro', peso: 20 },
            { tcRef: 'tc_consumibles', peso: 12 },
            { tcRef: 'tc_armas_normal', peso: 18 },
            { tcRef: 'tc_armadura_normal', peso: 18 },
            { tcRef: 'tc_joyeria', peso: 8 },
        ],
    },
    {
        id: 'tc_monstruo_elite',
        nombre: 'Monstruo Élite',
        nivel: 20,
        picks: 3,
        noDrop: 25,
        modificadorLegendario: 2.5,
        modificadorConjunto: 2,
        modificadorRaro: 1.8,
        entradas: [
            { itemId: 'oro', peso: 15 },
            { tcRef: 'tc_consumibles', peso: 10 },
            { tcRef: 'tc_armas_avanzadas', peso: 22 },
            { tcRef: 'tc_armadura_avanzada', peso: 22 },
            { tcRef: 'tc_joyeria', peso: 15 },
        ],
    },
    {
        id: 'tc_jefe_acto1',
        nombre: 'Jefe del Acto 1',
        nivel: 25,
        picks: 5,
        noDrop: 10,
        modificadorLegendario: 4,
        modificadorConjunto: 3,
        modificadorRaro: 2.5,
        entradas: [
            { itemId: 'oro', peso: 15 },
            { tcRef: 'tc_consumibles', peso: 8 },
            { tcRef: 'tc_armas_avanzadas', peso: 25 },
            { tcRef: 'tc_armadura_avanzada', peso: 25 },
            { tcRef: 'tc_joyeria', peso: 20 },
        ],
    },
    {
        id: 'tc_jefe_final',
        nombre: 'Jefe Final',
        nivel: 40,
        picks: 7,
        noDrop: 5,
        modificadorLegendario: 6,
        modificadorConjunto: 5,
        modificadorRaro: 3,
        entradas: [
            { itemId: 'oro', peso: 10 },
            { tcRef: 'tc_armas_avanzadas', peso: 28 },
            { tcRef: 'tc_armadura_avanzada', peso: 28 },
            { tcRef: 'tc_joyeria', peso: 25 },
        ],
    },

    // === TCs DE CAMPAMENTOS NPC (RECURSOS) ===
    {
        id: 'tc_campamento_barbaro_t1',
        nombre: 'Campamento Bárbaro Tier 1',
        nivel: 1,
        picks: 3, // 3 rolls de loot
        noDrop: 10, // 10% chance de no dropear en cada pick
        entradas: [
            { itemId: 'recurso_madera', peso: 40 },   // Alta prob de madera
            { itemId: 'recurso_hierro', peso: 30 },   // Media prob de hierro
            { itemId: 'recurso_doblones', peso: 20 }, // Baja prob de doblones
        ],
    },
    {
        id: 'tc_campamento_barbaro_t2',
        nombre: 'Campamento Bárbaro Tier 2',
        nivel: 5,
        picks: 5, // 5 rolls de loot
        noDrop: 5,
        entradas: [
            { itemId: 'recurso_madera', peso: 35 },
            { itemId: 'recurso_hierro', peso: 35 },
            { itemId: 'recurso_oro', peso: 15 },
            { itemId: 'recurso_doblones', peso: 15 },
        ],
    },
    {
        id: 'tc_ruina_t3',
        nombre: 'Ruinas Antiguas Tier 3',
        nivel: 15,
        picks: 4,
        noDrop: 5,
        modificadorRaro: 1.5,
        entradas: [
            { itemId: 'recurso_hierro', peso: 25 },
            { itemId: 'recurso_oro', peso: 30 },
            { itemId: 'recurso_doblones', peso: 25 },
            { itemId: 'recurso_ether', peso: 20 },
        ],
    },
];

// Aliases
export const DEFAULT_TREASURE_CLASSES = TREASURE_CLASSES_DEFAULT;

export function obtenerTCPorId(id: string): TreasureClass | undefined {
    return TREASURE_CLASSES_DEFAULT.find((tc) => tc.id === id);
}

export const getTreasureClassById = obtenerTCPorId;

export function obtenerTCsPorNivel(nivelMax: number): TreasureClass[] {
    return TREASURE_CLASSES_DEFAULT.filter((tc) => !tc.nivel || tc.nivel <= nivelMax);
}

export const getTreasureClassesByLevel = obtenerTCsPorNivel;

/**
 * Calcular peso total de una TC (incluyendo noDrop)
 */
export function calcularPesoTotal(tc: TreasureClass): number {
    const pesoEntradas = tc.entradas.reduce((sum, e) => sum + e.peso, 0);
    return pesoEntradas + tc.noDrop;
}

export const calculateTotalWeight = calcularPesoTotal;

/**
 * Hacer roll en una treasure class
 * Retorna la entrada seleccionada o null para no drop
 */
export function rollEnTreasureClass(tc: TreasureClass): EntradaTC | null {
    const pesoTotal = calcularPesoTotal(tc);
    let roll = Math.random() * pesoTotal;

    // Verificar no drop primero
    if (roll < tc.noDrop) {
        return null;
    }
    roll -= tc.noDrop;

    // Encontrar entrada seleccionada
    for (const entrada of tc.entradas) {
        roll -= entrada.peso;
        if (roll <= 0) {
            return entrada;
        }
    }

    // Fallback a última entrada
    return tc.entradas[tc.entradas.length - 1] || null;
}

export const rollOnTreasureClass = rollEnTreasureClass;
