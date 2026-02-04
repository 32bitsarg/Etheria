import { ItemBase, TipoItem, NivelItem, TipoStat } from '@lootsystem/core';

// ============================================
// ESPADAS
// ============================================

export const ESPADAS: ItemBase[] = [
    {
        id: 'daga',
        nombre: 'Daga',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 2, max: 2 },
            { stat: TipoStat.DAÑO_MAX, min: 6, max: 6 },
        ],
    },
    {
        id: 'espada_corta',
        nombre: 'Espada Corta',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 5,
        nivelCalidad: 5,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 4, max: 4 },
            { stat: TipoStat.DAÑO_MAX, min: 10, max: 10 },
        ],
    },
    {
        id: 'espada_larga',
        nombre: 'Espada Larga',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 12,
        nivelCalidad: 12,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 8, max: 8 },
            { stat: TipoStat.DAÑO_MAX, min: 18, max: 18 },
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
            { stat: TipoStat.DAÑO_MIN, min: 12, max: 12 },
            { stat: TipoStat.DAÑO_MAX, min: 26, max: 26 },
        ],
    },
    {
        id: 'espada_bastarda',
        nombre: 'Espada Bastarda',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 16, max: 16 },
            { stat: TipoStat.DAÑO_MAX, min: 35, max: 35 },
        ],
    },
    {
        id: 'mandoble',
        nombre: 'Mandoble',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 32,
        nivelCalidad: 32,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 22, max: 22 },
            { stat: TipoStat.DAÑO_MAX, min: 48, max: 48 },
        ],
    },
    {
        id: 'espada_runica',
        nombre: 'Espada Rúnica',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 35, max: 35 },
            { stat: TipoStat.DAÑO_MAX, min: 70, max: 70 },
        ],
    },
];

// ============================================
// HACHAS
// ============================================

export const HACHAS: ItemBase[] = [
    {
        id: 'hacha_mano',
        nombre: 'Hacha de Mano',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 3, max: 3 },
            { stat: TipoStat.DAÑO_MAX, min: 8, max: 8 },
        ],
    },
    {
        id: 'hacha_doble',
        nombre: 'Hacha Doble',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 8, max: 8 },
            { stat: TipoStat.DAÑO_MAX, min: 20, max: 20 },
        ],
    },
    {
        id: 'hacha_batalla',
        nombre: 'Hacha de Batalla',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 18,
        nivelCalidad: 18,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 14, max: 14 },
            { stat: TipoStat.DAÑO_MAX, min: 32, max: 32 },
        ],
    },
    {
        id: 'hacha_guerra',
        nombre: 'Hacha de Guerra',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 28,
        nivelCalidad: 28,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 20, max: 20 },
            { stat: TipoStat.DAÑO_MAX, min: 45, max: 45 },
        ],
    },
    {
        id: 'gran_hacha',
        nombre: 'Gran Hacha',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 42,
        nivelCalidad: 42,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 32, max: 32 },
            { stat: TipoStat.DAÑO_MAX, min: 68, max: 68 },
        ],
    },
];

// ============================================
// ARCOS
// ============================================

export const ARCOS: ItemBase[] = [
    {
        id: 'arco_corto',
        nombre: 'Arco Corto',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 2, max: 2 },
            { stat: TipoStat.DAÑO_MAX, min: 7, max: 7 },
        ],
    },
    {
        id: 'arco_largo',
        nombre: 'Arco Largo',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 12,
        nivelCalidad: 12,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 5, max: 5 },
            { stat: TipoStat.DAÑO_MAX, min: 15, max: 15 },
        ],
    },
    {
        id: 'arco_compuesto',
        nombre: 'Arco Compuesto',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 10, max: 10 },
            { stat: TipoStat.DAÑO_MAX, min: 25, max: 25 },
        ],
    },
    {
        id: 'arco_guerra',
        nombre: 'Arco de Guerra',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 30,
        nivelCalidad: 30,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 16, max: 16 },
            { stat: TipoStat.DAÑO_MAX, min: 38, max: 38 },
        ],
    },
    {
        id: 'arco_elfico',
        nombre: 'Arco Élfico',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 28, max: 28 },
            { stat: TipoStat.DAÑO_MAX, min: 55, max: 55 },
        ],
    },
];
