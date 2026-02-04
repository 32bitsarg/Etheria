import { ItemBase, TipoItem, NivelItem, TipoStat } from '../types';

/**
 * Items base en español
 */
export const ITEMS_DEFAULT: ItemBase[] = [
    // === ESPADAS ===
    {
        id: 'espada_corta',
        nombre: 'Espada Corta',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 2, max: 2 },
            { stat: TipoStat.DAÑO_MAX, min: 7, max: 7 },
        ],
    },
    {
        id: 'espada_larga',
        nombre: 'Espada Larga',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 5, max: 5 },
            { stat: TipoStat.DAÑO_MAX, min: 15, max: 15 },
        ],
    },
    {
        id: 'espada_ancha',
        nombre: 'Espada Ancha',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 18,
        nivelCalidad: 18,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 8, max: 8 },
            { stat: TipoStat.DAÑO_MAX, min: 22, max: 22 },
        ],
    },
    {
        id: 'espadon',
        nombre: 'Espadón',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 30,
        nivelCalidad: 30,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 15, max: 15 },
            { stat: TipoStat.DAÑO_MAX, min: 40, max: 40 },
        ],
    },

    // === HACHAS ===
    {
        id: 'hacha_mano',
        nombre: 'Hacha de Mano',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 3, max: 3 },
            { stat: TipoStat.DAÑO_MAX, min: 6, max: 6 },
        ],
    },
    {
        id: 'hacha_batalla',
        nombre: 'Hacha de Batalla',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 12, max: 12 },
            { stat: TipoStat.DAÑO_MAX, min: 32, max: 32 },
        ],
    },

    // === YELMOS ===
    {
        id: 'gorra',
        nombre: 'Gorra',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 3, max: 5 }],
    },
    {
        id: 'yelmo',
        nombre: 'Yelmo',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 12,
        nivelCalidad: 12,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 15, max: 20 }],
    },
    {
        id: 'corona',
        nombre: 'Corona',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 30,
        nivelCalidad: 30,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 35, max: 50 }],
    },

    // === PECHERAS ===
    {
        id: 'armadura_cuero',
        nombre: 'Armadura de Cuero',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 8, max: 11 }],
    },
    {
        id: 'cota_malla',
        nombre: 'Cota de Malla',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 25, max: 35 }],
    },
    {
        id: 'armadura_placas',
        nombre: 'Armadura de Placas',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 45, max: 60 }],
    },

    // === GUANTES ===
    {
        id: 'guantes_cuero',
        nombre: 'Guantes de Cuero',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 2, max: 4 }],
    },
    {
        id: 'guanteletes',
        nombre: 'Guanteletes',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 10, max: 15 }],
    },

    // === BOTAS ===
    {
        id: 'botas_cuero',
        nombre: 'Botas de Cuero',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 2, max: 4 }],
    },
    {
        id: 'botas_pesadas',
        nombre: 'Botas Pesadas',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 10, max: 15 }],
    },

    // === ESCUDOS ===
    {
        id: 'escudo_madera',
        nombre: 'Escudo de Madera',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 5, max: 8 },
            { stat: TipoStat.PROB_BLOQUEO, min: 20, max: 20 },
        ],
    },
    {
        id: 'escudo_torre',
        nombre: 'Escudo Torre',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 25, max: 40 },
            { stat: TipoStat.PROB_BLOQUEO, min: 35, max: 35 },
        ],
    },

    // === JOYERÍA ===
    {
        id: 'anillo',
        nombre: 'Anillo',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
    },
    {
        id: 'amuleto',
        nombre: 'Amuleto',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
    },

    // === ARCOS ===
    {
        id: 'arco_corto',
        nombre: 'Arco Corto',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 1, max: 1 },
            { stat: TipoStat.DAÑO_MAX, min: 5, max: 5 },
        ],
    },
    {
        id: 'arco_largo',
        nombre: 'Arco Largo',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 3, max: 3 },
            { stat: TipoStat.DAÑO_MAX, min: 12, max: 12 },
        ],
    },

    // === CONSUMIBLES ===
    {
        id: 'pocion_vida',
        nombre: 'Poción de Vida',
        tipo: TipoItem.POCION,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
        esApilable: true,
        maxApilado: 20,
    },
    {
        id: 'pocion_mana',
        nombre: 'Poción de Maná',
        tipo: TipoItem.POCION,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
        esApilable: true,
        maxApilado: 20,
    },
    {
        id: 'oro',
        nombre: 'Oro',
        tipo: TipoItem.ORO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
        esApilable: true,
        maxApilado: 999999,
    },
];

// Aliases
export const DEFAULT_ITEMS = ITEMS_DEFAULT;

export function obtenerItemPorId(id: string): ItemBase | undefined {
    return ITEMS_DEFAULT.find((item) => item.id === id);
}

export const getItemById = obtenerItemPorId;

export function obtenerItemsPorTipo(tipo: TipoItem): ItemBase[] {
    return ITEMS_DEFAULT.filter((item) => item.tipo === tipo);
}

export const getItemsByType = obtenerItemsPorTipo;

export function obtenerItemsPorNivel(nivel: NivelItem): ItemBase[] {
    return ITEMS_DEFAULT.filter((item) => item.nivel === nivel);
}

export const getItemsByTier = obtenerItemsPorNivel;

export function obtenerItemsValidosParaNivel(nivel: number): ItemBase[] {
    return ITEMS_DEFAULT.filter((item) => item.nivelRequerido <= nivel);
}

export const getValidItemsForLevel = obtenerItemsValidosParaNivel;
