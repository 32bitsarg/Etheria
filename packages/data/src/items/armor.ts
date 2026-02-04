import { ItemBase, TipoItem, NivelItem, TipoStat } from '@lootsystem/core';

// ============================================
// YELMOS
// ============================================

export const YELMOS: ItemBase[] = [
    {
        id: 'gorra_cuero',
        nombre: 'Gorra de Cuero',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 5, max: 8 }],
    },
    {
        id: 'casco',
        nombre: 'Casco',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 12, max: 18 }],
    },
    {
        id: 'yelmo_acero',
        nombre: 'Yelmo de Acero',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 16,
        nivelCalidad: 16,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 22, max: 32 }],
    },
    {
        id: 'yelmo_placas',
        nombre: 'Yelmo de Placas',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 26,
        nivelCalidad: 26,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 38, max: 52 }],
    },
    {
        id: 'corona',
        nombre: 'Corona',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 35,
        nivelCalidad: 35,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 50, max: 70 }],
    },
    {
        id: 'tiara',
        nombre: 'Tiara',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 65, max: 90 }],
    },
];

// ============================================
// ARMADURAS
// ============================================

export const ARMADURAS: ItemBase[] = [
    {
        id: 'chaleco_cuero',
        nombre: 'Chaleco de Cuero',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 10, max: 15 }],
    },
    {
        id: 'armadura_cuero',
        nombre: 'Armadura de Cuero',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 18, max: 28 }],
    },
    {
        id: 'cota_malla',
        nombre: 'Cota de Malla',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 16,
        nivelCalidad: 16,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 35, max: 50 }],
    },
    {
        id: 'armadura_placas',
        nombre: 'Armadura de Placas',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 26,
        nivelCalidad: 26,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 60, max: 85 }],
    },
    {
        id: 'armadura_completa',
        nombre: 'Armadura Completa',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 36,
        nivelCalidad: 36,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 90, max: 120 }],
    },
    {
        id: 'armadura_sagrada',
        nombre: 'Armadura Sagrada',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 130, max: 170 }],
    },
];

// ============================================
// GUANTES
// ============================================

export const GUANTES: ItemBase[] = [
    {
        id: 'guantes_cuero',
        nombre: 'Guantes de Cuero',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 3, max: 5 }],
    },
    {
        id: 'guantes_malla',
        nombre: 'Guantes de Malla',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 12,
        nivelCalidad: 12,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 8, max: 14 }],
    },
    {
        id: 'guanteletes',
        nombre: 'Guanteletes',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 18, max: 28 }],
    },
    {
        id: 'guanteletes_guerra',
        nombre: 'Guanteletes de Guerra',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.ELITE,
        nivelRequerido: 42,
        nivelCalidad: 42,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 32, max: 45 }],
    },
];

// ============================================
// BOTAS
// ============================================

export const BOTAS: ItemBase[] = [
    {
        id: 'botas_cuero',
        nombre: 'Botas de Cuero',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 3, max: 5 }],
    },
    {
        id: 'botas_malla',
        nombre: 'Botas de Malla',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 12,
        nivelCalidad: 12,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 8, max: 14 }],
    },
    {
        id: 'botas_placas',
        nombre: 'Botas de Placas',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 18, max: 28 }],
    },
    {
        id: 'botas_guerra',
        nombre: 'Botas de Guerra',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.ELITE,
        nivelRequerido: 42,
        nivelCalidad: 42,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 32, max: 45 }],
    },
];

// ============================================
// ESCUDOS
// ============================================

export const ESCUDOS: ItemBase[] = [
    {
        id: 'escudo_madera',
        nombre: 'Escudo de Madera',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 5, max: 10 },
            { stat: TipoStat.PROB_BLOQUEO, min: 18, max: 18 },
        ],
    },
    {
        id: 'rodela',
        nombre: 'Rodela',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 15, max: 25 },
            { stat: TipoStat.PROB_BLOQUEO, min: 24, max: 24 },
        ],
    },
    {
        id: 'escudo_acero',
        nombre: 'Escudo de Acero',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 18,
        nivelCalidad: 18,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 28, max: 42 },
            { stat: TipoStat.PROB_BLOQUEO, min: 30, max: 30 },
        ],
    },
    {
        id: 'escudo_torre',
        nombre: 'Escudo Torre',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 28,
        nivelCalidad: 28,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 50, max: 75 },
            { stat: TipoStat.PROB_BLOQUEO, min: 38, max: 38 },
        ],
    },
    {
        id: 'escudo_heraldico',
        nombre: 'Escudo Heráldico',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 85, max: 120 },
            { stat: TipoStat.PROB_BLOQUEO, min: 45, max: 45 },
        ],
    },
];

// ============================================
// CINTURONES
// ============================================

export const CINTURONES: ItemBase[] = [
    {
        id: 'cinturon_cuero',
        nombre: 'Cinturón de Cuero',
        tipo: TipoItem.CINTURON,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 2, max: 4 }],
    },
    {
        id: 'cinturon_malla',
        nombre: 'Cinturón de Malla',
        tipo: TipoItem.CINTURON,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 12,
        nivelCalidad: 12,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 6, max: 10 }],
    },
    {
        id: 'cinturon_guerra',
        nombre: 'Cinturón de Guerra',
        tipo: TipoItem.CINTURON,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 28,
        nivelCalidad: 28,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 14, max: 22 }],
    },
];
