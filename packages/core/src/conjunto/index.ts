import { ItemConjunto, Conjunto, TipoItem, NivelItem, TipoStat, Rareza } from '../types';

/**
 * Definición de Conjuntos
 */
export const CONJUNTOS_DEFAULT: Conjunto[] = [
    {
        id: 'conjunto_guerrero',
        nombre: 'Armadura del Guerrero Inmortal',
        items: ['guerrero_yelmo', 'guerrero_pechera', 'guerrero_guantes'],
        bonuses: [
            {
                piezasRequeridas: 2,
                modificadores: [
                    { stat: TipoStat.FUERZA, valor: 20 },
                    { stat: TipoStat.VIDA, valor: 50 },
                ],
            },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 50 },
            { stat: TipoStat.DEFENSA_PORCENTAJE, valor: 30 },
            { stat: TipoStat.REDUCCION_DAÑO, valor: 10 },
        ],
    },
    {
        id: 'conjunto_mago',
        nombre: 'Vestiduras del Archimago',
        items: ['mago_yelmo', 'mago_pechera', 'mago_guantes', 'mago_amuleto'],
        bonuses: [
            {
                piezasRequeridas: 2,
                modificadores: [
                    { stat: TipoStat.MANA, valor: 80 },
                    { stat: TipoStat.REGEN_MANA, valor: 10 },
                ],
            },
            {
                piezasRequeridas: 3,
                modificadores: [
                    { stat: TipoStat.RESIST_TODO, valor: 15 },
                    { stat: TipoStat.ENERGIA, valor: 25 },
                ],
            },
        ],
        bonusCompleto: [
            { stat: TipoStat.MANA_PORCENTAJE, valor: 50 },
            { stat: TipoStat.REDUCCION_DAÑO, valor: 5 },
        ],
    },
    {
        id: 'conjunto_cazador',
        nombre: 'Equipo del Cazador Nocturno',
        items: ['cazador_yelmo', 'cazador_pechera', 'cazador_botas'],
        bonuses: [
            {
                piezasRequeridas: 2,
                modificadores: [
                    { stat: TipoStat.DESTREZA, valor: 25 },
                    { stat: TipoStat.VELOCIDAD_ATAQUE, valor: 15 },
                ],
            },
        ],
        bonusCompleto: [
            { stat: TipoStat.PROB_CRITICO, valor: 20 },
            { stat: TipoStat.DAÑO_CRITICO, valor: 50 },
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, valor: 20 },
        ],
    },
];

/**
 * Items de Conjunto
 */
export const ITEMS_CONJUNTO_DEFAULT: ItemConjunto[] = [
    // === CONJUNTO GUERRERO ===
    {
        id: 'guerrero_yelmo',
        nombre: 'Corona',
        nombreConjunto: 'Armadura del Guerrero Inmortal',
        conjuntoId: 'conjunto_guerrero',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 35, max: 45 }],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 10, max: 15 },
            { stat: TipoStat.VIDA, min: 30, max: 50 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },
    {
        id: 'guerrero_pechera',
        nombre: 'Armadura de Placas',
        nombreConjunto: 'Armadura del Guerrero Inmortal',
        conjuntoId: 'conjunto_guerrero',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 60, max: 80 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 50, max: 80 },
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 20, max: 30 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },
    {
        id: 'guerrero_guantes',
        nombre: 'Guanteletes',
        nombreConjunto: 'Armadura del Guerrero Inmortal',
        conjuntoId: 'conjunto_guerrero',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 15, max: 25 }],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 8, max: 12 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },

    // === CONJUNTO MAGO ===
    {
        id: 'mago_yelmo',
        nombre: 'Gorra',
        nombreConjunto: 'Vestiduras del Archimago',
        conjuntoId: 'conjunto_mago',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 10, max: 15 }],
        modificadoresFijos: [
            { stat: TipoStat.MANA, min: 40, max: 60 },
            { stat: TipoStat.ENERGIA, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },
    {
        id: 'mago_pechera',
        nombre: 'Armadura de Cuero',
        nombreConjunto: 'Vestiduras del Archimago',
        conjuntoId: 'conjunto_mago',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 15, max: 25 }],
        modificadoresFijos: [
            { stat: TipoStat.MANA, min: 60, max: 100 },
            { stat: TipoStat.REGEN_MANA, min: 5, max: 10 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },
    {
        id: 'mago_guantes',
        nombre: 'Guantes de Cuero',
        nombreConjunto: 'Vestiduras del Archimago',
        conjuntoId: 'conjunto_mago',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 5, max: 10 }],
        modificadoresFijos: [
            { stat: TipoStat.ENERGIA, min: 8, max: 12 },
            { stat: TipoStat.MANA, min: 20, max: 35 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },
    {
        id: 'mago_amuleto',
        nombre: 'Amuleto',
        nombreConjunto: 'Vestiduras del Archimago',
        conjuntoId: 'conjunto_mago',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.MANA, min: 30, max: 50 },
            { stat: TipoStat.RESIST_TODO, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },

    // === CONJUNTO CAZADOR ===
    {
        id: 'cazador_yelmo',
        nombre: 'Gorra',
        nombreConjunto: 'Equipo del Cazador Nocturno',
        conjuntoId: 'conjunto_cazador',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 18,
        nivelCalidad: 18,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 8, max: 12 }],
        modificadoresFijos: [
            { stat: TipoStat.DESTREZA, min: 10, max: 15 },
            { stat: TipoStat.PROB_CRITICO, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 18,
    },
    {
        id: 'cazador_pechera',
        nombre: 'Armadura de Cuero',
        nombreConjunto: 'Equipo del Cazador Nocturno',
        conjuntoId: 'conjunto_cazador',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 18,
        nivelCalidad: 18,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 20, max: 30 }],
        modificadoresFijos: [
            { stat: TipoStat.DESTREZA, min: 12, max: 18 },
            { stat: TipoStat.VIDA, min: 25, max: 40 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 18,
    },
    {
        id: 'cazador_botas',
        nombre: 'Botas de Cuero',
        nombreConjunto: 'Equipo del Cazador Nocturno',
        conjuntoId: 'conjunto_cazador',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 18,
        nivelCalidad: 18,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 5, max: 10 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 15, max: 25 },
            { stat: TipoStat.DESTREZA, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 18,
    },
];

// Aliases
export const DEFAULT_SETS = CONJUNTOS_DEFAULT;
export const DEFAULT_SET_ITEMS = ITEMS_CONJUNTO_DEFAULT;

export function obtenerConjuntoPorId(id: string): Conjunto | undefined {
    return CONJUNTOS_DEFAULT.find((c) => c.id === id);
}

export function obtenerItemConjuntoPorId(id: string): ItemConjunto | undefined {
    return ITEMS_CONJUNTO_DEFAULT.find((item) => item.id === id);
}

export function obtenerItemsDeConjunto(conjuntoId: string): ItemConjunto[] {
    return ITEMS_CONJUNTO_DEFAULT.filter((item) => item.conjuntoId === conjuntoId);
}

export function obtenerItemsConjuntoParaNivel(nivel: number): ItemConjunto[] {
    return ITEMS_CONJUNTO_DEFAULT.filter((item) => item.nivelDrop <= nivel);
}

/**
 * Seleccionar un item de conjunto aleatorio válido para el nivel
 */
export function seleccionarItemConjuntoAleatorio(
    nivelMonstruo: number,
    tipoItemPermitido?: TipoItem
): ItemConjunto | null {
    let candidatos = obtenerItemsConjuntoParaNivel(nivelMonstruo);

    if (tipoItemPermitido) {
        candidatos = candidatos.filter((c) => c.tipo === tipoItemPermitido);
    }

    if (candidatos.length === 0) return null;

    const indice = Math.floor(Math.random() * candidatos.length);
    return candidatos[indice];
}

/**
 * Calcular bonuses de conjunto según piezas equipadas
 */
export function calcularBonusConjunto(
    conjuntoId: string,
    piezasEquipadas: number
): { stat: TipoStat; valor: number }[] {
    const conjunto = obtenerConjuntoPorId(conjuntoId);
    if (!conjunto) return [];

    const bonuses: { stat: TipoStat; valor: number }[] = [];

    // Agregar bonuses parciales
    for (const bonus of conjunto.bonuses) {
        if (piezasEquipadas >= bonus.piezasRequeridas) {
            bonuses.push(...bonus.modificadores);
        }
    }

    // Agregar bonus completo si aplica
    if (conjunto.bonusCompleto && piezasEquipadas >= conjunto.items.length) {
        bonuses.push(...conjunto.bonusCompleto);
    }

    return bonuses;
}
