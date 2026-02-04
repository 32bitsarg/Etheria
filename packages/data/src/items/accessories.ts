import { ItemBase, TipoItem, NivelItem, TipoStat } from '@lootsystem/core';

// ============================================
// JOYERÍA
// ============================================

export const JOYERIA: ItemBase[] = [
    {
        id: 'anillo_simple',
        nombre: 'Anillo Simple',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
    },
    {
        id: 'anillo_oro',
        nombre: 'Anillo de Oro',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [],
    },
    {
        id: 'anillo_diamante',
        nombre: 'Anillo de Diamante',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 40,
        nivelCalidad: 40,
        statsBase: [],
    },
    {
        id: 'amuleto_simple',
        nombre: 'Amuleto Simple',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 1,
        nivelCalidad: 1,
        statsBase: [],
    },
    {
        id: 'amuleto_plata',
        nombre: 'Amuleto de Plata',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [],
    },
    {
        id: 'amuleto_arcano',
        nombre: 'Amuleto Arcano',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 40,
        nivelCalidad: 40,
        statsBase: [],
    },
];
