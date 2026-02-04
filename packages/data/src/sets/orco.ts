/**
 * Sets por Raza - ORCO
 * 10 sets temáticos para la raza Orco
 */

import { Conjunto, ItemConjunto, TipoItem, NivelItem, TipoStat, Rareza } from '@lootsystem/core';

// ============================================
// SETS ORCO
// ============================================

export const SETS_ORCO: Conjunto[] = [
    // 1. Set inicial - Guerrero de Clan
    {
        id: 'orco_guerrero_clan',
        nombre: 'Guerrero de Clan',
        items: ['orco_clan_hacha', 'orco_clan_yelmo', 'orco_clan_pechera'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 18 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 25 },
            { stat: TipoStat.VIDA, valor: 40 },
        ],
    },
    // 2. Set berserker - Furia Desatada
    {
        id: 'orco_furia_desatada',
        nombre: 'Furia Desatada',
        items: ['orco_furia_hacha', 'orco_furia_yelmo', 'orco_furia_pechera', 'orco_furia_guantes'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 35 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VELOCIDAD_ATAQUE, valor: 15 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.ROBO_VIDA, valor: 8 },
            { stat: TipoStat.VIDA, valor: 60 },
        ],
    },
    // 3. Set de sangre - Sed de Sangre
    {
        id: 'orco_sed_sangre',
        nombre: 'Sed de Sangre',
        items: ['orco_sangre_hacha', 'orco_sangre_yelmo', 'orco_sangre_anillo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.ROBO_VIDA, valor: 5 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.VIDA, valor: 80 },
            { stat: TipoStat.REGEN_VIDA, valor: 10 },
        ],
    },
    // 4. Set de brutalidad - Brutalidad Salvaje
    {
        id: 'orco_brutalidad',
        nombre: 'Brutalidad Salvaje',
        items: ['orco_bruto_maza', 'orco_bruto_pechera', 'orco_bruto_guantes', 'orco_bruto_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 25 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 40 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.PROB_CRITICO, valor: 15 },
            { stat: TipoStat.DAÑO_CRITICO, valor: 50 },
        ],
    },
    // 5. Set de destrucción - Destructor
    {
        id: 'orco_destructor',
        nombre: 'Destructor',
        items: ['orco_destructor_hacha', 'orco_destructor_yelmo', 'orco_destructor_pechera', 'orco_destructor_cinturon'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 50 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.FUERZA, valor: 30 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REDUCCION_DAÑO, valor: 8 },
            { stat: TipoStat.VIDA, valor: 100 },
        ],
    },
    // 6. Set de guerra - Señor de la Guerra
    {
        id: 'orco_señor_guerra',
        nombre: 'Señor de la Guerra',
        items: ['orco_señor_hacha', 'orco_señor_yelmo', 'orco_señor_pechera', 'orco_señor_guantes', 'orco_señor_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DEFENSA, valor: 40 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 80 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 45 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.RESIST_TODO, valor: 15 },
            { stat: TipoStat.ROBO_VIDA, valor: 6 },
        ],
    },
    // 7. Set de huesos - Coleccionista de Huesos
    {
        id: 'orco_huesos',
        nombre: 'Coleccionista de Huesos',
        items: ['orco_huesos_maza', 'orco_huesos_yelmo', 'orco_huesos_pechera', 'orco_huesos_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VIDA, valor: 50 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.RESIST_VENENO, valor: 30 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_VENENO, valor: 40 },
            { stat: TipoStat.DEFENSA, valor: 50 },
        ],
    },
    // 8. Set de fuego - Incendiario
    {
        id: 'orco_incendiario',
        nombre: 'Incendiario',
        items: ['orco_fuego_hacha', 'orco_fuego_yelmo', 'orco_fuego_guantes'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DAÑO_FUEGO, valor: 25 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.RESIST_FUEGO, valor: 40 },
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 35 },
        ],
    },
    // 9. Set legendario - Campeón de la Horda
    {
        id: 'orco_campeon_horda',
        nombre: 'Campeón de la Horda',
        items: ['orco_campeon_hacha', 'orco_campeon_yelmo', 'orco_campeon_pechera', 'orco_campeon_guantes', 'orco_campeon_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 30 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 100 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 60 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.ROBO_VIDA, valor: 10 },
            { stat: TipoStat.PROB_CRITICO, valor: 20 },
        ],
    },
    // 10. Set supremo - Jefe de Guerra Supremo
    {
        id: 'orco_jefe_supremo',
        nombre: 'Jefe de Guerra Supremo',
        items: ['orco_jefe_hacha', 'orco_jefe_yelmo', 'orco_jefe_pechera', 'orco_jefe_guantes', 'orco_jefe_botas', 'orco_jefe_anillo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 35 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 120 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 70 }] },
            { piezasRequeridas: 5, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 20 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_CRITICO, valor: 80 },
            { stat: TipoStat.PROB_CRITICO, valor: 25 },
            { stat: TipoStat.ROBO_VIDA, valor: 12 },
        ],
    },
];

// ============================================
// ITEMS DE SETS ORCO (samples)
// ============================================

export const ITEMS_SETS_ORCO: ItemConjunto[] = [
    // === Guerrero de Clan ===
    {
        id: 'orco_clan_hacha',
        nombre: 'Hacha del Clan',
        nombreConjunto: 'Guerrero de Clan',
        conjuntoId: 'orco_guerrero_clan',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 8, max: 8 },
            { stat: TipoStat.DAÑO_MAX, min: 18, max: 18 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 8, max: 12 },
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 20, max: 35 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },
    {
        id: 'orco_clan_yelmo',
        nombre: 'Cráneo del Clan',
        nombreConjunto: 'Guerrero de Clan',
        conjuntoId: 'orco_guerrero_clan',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 14, max: 20 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 25, max: 40 },
            { stat: TipoStat.FUERZA, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },
    {
        id: 'orco_clan_pechera',
        nombre: 'Armadura del Clan',
        nombreConjunto: 'Guerrero de Clan',
        conjuntoId: 'orco_guerrero_clan',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 30, max: 42 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 35, max: 50 },
            { stat: TipoStat.RESIST_FUEGO, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },

    // === Jefe de Guerra Supremo (set supremo) ===
    {
        id: 'orco_jefe_hacha',
        nombre: 'Gran Hacha del Jefe',
        nombreConjunto: 'Jefe de Guerra Supremo',
        conjuntoId: 'orco_jefe_supremo',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 45, max: 45 },
            { stat: TipoStat.DAÑO_MAX, min: 95, max: 95 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 180, max: 250 },
            { stat: TipoStat.FUERZA, min: 30, max: 45 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'orco_jefe_yelmo',
        nombre: 'Cráneo del Jefe Supremo',
        nombreConjunto: 'Jefe de Guerra Supremo',
        conjuntoId: 'orco_jefe_supremo',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 75, max: 100 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 120, max: 180 },
            { stat: TipoStat.FUERZA, min: 20, max: 30 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'orco_jefe_pechera',
        nombre: 'Armadura del Jefe Supremo',
        nombreConjunto: 'Jefe de Guerra Supremo',
        conjuntoId: 'orco_jefe_supremo',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 160, max: 210 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 100, max: 150 },
            { stat: TipoStat.RESIST_TODO, min: 18, max: 28 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'orco_jefe_guantes',
        nombre: 'Garras del Jefe',
        nombreConjunto: 'Jefe de Guerra Supremo',
        conjuntoId: 'orco_jefe_supremo',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 42, max: 58 }],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 22, max: 32 },
            { stat: TipoStat.ROBO_VIDA, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'orco_jefe_botas',
        nombre: 'Pisadas del Jefe',
        nombreConjunto: 'Jefe de Guerra Supremo',
        conjuntoId: 'orco_jefe_supremo',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 40, max: 55 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 60, max: 90 },
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 15, max: 22 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'orco_jefe_anillo',
        nombre: 'Anillo del Jefe Supremo',
        nombreConjunto: 'Jefe de Guerra Supremo',
        conjuntoId: 'orco_jefe_supremo',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 18, max: 28 },
            { stat: TipoStat.PROB_CRITICO, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
];
