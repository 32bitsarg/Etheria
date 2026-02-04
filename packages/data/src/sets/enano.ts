/**
 * Sets por Raza - ENANO
 * 10 sets temáticos para la raza Enano
 */

import { Conjunto, ItemConjunto, TipoItem, NivelItem, TipoStat, Rareza } from '@lootsystem/core';

// ============================================
// SETS ENANO
// ============================================

export const SETS_ENANO: Conjunto[] = [
    // 1. Set inicial - Minero de las Profundidades
    {
        id: 'enano_minero',
        nombre: 'Minero de las Profundidades',
        items: ['enano_minero_pico', 'enano_minero_yelmo', 'enano_minero_pechera'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VITALIDAD, valor: 15 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.HALLAZGO_ORO, valor: 50 },
            { stat: TipoStat.VIDA, valor: 50 },
        ],
    },
    // 2. Set de herrero - Maestro Herrero
    {
        id: 'enano_herrero',
        nombre: 'Maestro Herrero',
        items: ['enano_herrero_martillo', 'enano_herrero_yelmo', 'enano_herrero_pechera', 'enano_herrero_guantes'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 15 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DEFENSA, valor: 35 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.RESIST_FUEGO, valor: 30 },
            { stat: TipoStat.DEFENSA_PORCENTAJE, valor: 20 },
        ],
    },
    // 3. Set de defensor - Defensor de la Montaña
    {
        id: 'enano_defensor',
        nombre: 'Defensor de la Montaña',
        items: ['enano_defensor_hacha', 'enano_defensor_yelmo', 'enano_defensor_pechera', 'enano_defensor_escudo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DEFENSA, valor: 40 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.PROB_BLOQUEO, valor: 12 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REDUCCION_DAÑO, valor: 10 },
            { stat: TipoStat.VIDA, valor: 80 },
        ],
    },
    // 4. Set de piedra - Corazón de Piedra
    {
        id: 'enano_piedra',
        nombre: 'Corazón de Piedra',
        items: ['enano_piedra_martillo', 'enano_piedra_yelmo', 'enano_piedra_pechera', 'enano_piedra_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VITALIDAD, valor: 20 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 12 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, valor: 30 },
            { stat: TipoStat.REDUCCION_DAÑO, valor: 8 },
        ],
    },
    // 5. Set de guerra - Martillo de Guerra
    {
        id: 'enano_martillo_guerra',
        nombre: 'Martillo de Guerra',
        items: ['enano_guerra_martillo', 'enano_guerra_yelmo', 'enano_guerra_guantes'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 35 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.FUERZA, valor: 25 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, valor: 15 },
        ],
    },
    // 6. Set de runas - Runas Ancestrales
    {
        id: 'enano_runas',
        nombre: 'Runas Ancestrales',
        items: ['enano_runas_hacha', 'enano_runas_yelmo', 'enano_runas_pechera', 'enano_runas_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.MANA, valor: 40 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 15 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_RAYO, valor: 30 },
            { stat: TipoStat.DEFENSA, valor: 50 },
        ],
    },
    // 7. Set de forja - Forjador de Leyendas
    {
        id: 'enano_forjador',
        nombre: 'Forjador de Leyendas',
        items: ['enano_forja_martillo', 'enano_forja_yelmo', 'enano_forja_pechera', 'enano_forja_guantes', 'enano_forja_cinturon'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 20 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DEFENSA_PORCENTAJE, valor: 25 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.RESIST_FUEGO, valor: 35 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_FUEGO, valor: 40 },
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 45 },
        ],
    },
    // 8. Set de oro - Señor del Tesoro
    {
        id: 'enano_tesoro',
        nombre: 'Señor del Tesoro',
        items: ['enano_tesoro_hacha', 'enano_tesoro_yelmo', 'enano_tesoro_anillo', 'enano_tesoro_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.HALLAZGO_ORO, valor: 60 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.HALLAZGO_MAGICO, valor: 25 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.TODOS_ATRIBUTOS, valor: 10 },
            { stat: TipoStat.VIDA, valor: 60 },
        ],
    },
    // 9. Set legendario - Guardián de las Minas
    {
        id: 'enano_guardian_minas',
        nombre: 'Guardián de las Minas',
        items: ['enano_guardian_hacha', 'enano_guardian_yelmo', 'enano_guardian_pechera', 'enano_guardian_escudo', 'enano_guardian_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DEFENSA, valor: 50 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 90 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 18 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REDUCCION_DAÑO, valor: 12 },
            { stat: TipoStat.PROB_BLOQUEO, valor: 15 },
        ],
    },
    // 10. Set supremo - Rey Bajo la Montaña
    {
        id: 'enano_rey_montaña',
        nombre: 'Rey Bajo la Montaña',
        items: ['enano_rey_hacha', 'enano_rey_corona', 'enano_rey_pechera', 'enano_rey_guantes', 'enano_rey_botas', 'enano_rey_anillo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VITALIDAD, valor: 30 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DEFENSA_PORCENTAJE, valor: 40 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.VIDA, valor: 130 }] },
            { piezasRequeridas: 5, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 25 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REDUCCION_DAÑO, valor: 15 },
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 55 },
            { stat: TipoStat.HALLAZGO_MAGICO, valor: 35 },
        ],
    },
];

// ============================================
// ITEMS DE SETS ENANO (samples)
// ============================================

export const ITEMS_SETS_ENANO: ItemConjunto[] = [
    // === Minero de las Profundidades ===
    {
        id: 'enano_minero_pico',
        nombre: 'Pico del Minero',
        nombreConjunto: 'Minero de las Profundidades',
        conjuntoId: 'enano_minero',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 6,
        nivelCalidad: 6,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 5, max: 5 },
            { stat: TipoStat.DAÑO_MAX, min: 12, max: 12 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.HALLAZGO_ORO, min: 20, max: 35 },
            { stat: TipoStat.FUERZA, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 6,
    },
    {
        id: 'enano_minero_yelmo',
        nombre: 'Casco del Minero',
        nombreConjunto: 'Minero de las Profundidades',
        conjuntoId: 'enano_minero',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 6,
        nivelCalidad: 6,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 12, max: 18 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 25, max: 35 },
            { stat: TipoStat.VITALIDAD, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 6,
    },
    {
        id: 'enano_minero_pechera',
        nombre: 'Chaleco del Minero',
        nombreConjunto: 'Minero de las Profundidades',
        conjuntoId: 'enano_minero',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 6,
        nivelCalidad: 6,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 25, max: 35 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 30, max: 45 },
            { stat: TipoStat.RESIST_TODO, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 6,
    },

    // === Defensor de la Montaña ===
    {
        id: 'enano_defensor_hacha',
        nombre: 'Hacha del Defensor',
        nombreConjunto: 'Defensor de la Montaña',
        conjuntoId: 'enano_defensor',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 15, max: 15 },
            { stat: TipoStat.DAÑO_MAX, min: 35, max: 35 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 50, max: 75 },
            { stat: TipoStat.FUERZA, min: 12, max: 18 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },
    {
        id: 'enano_defensor_yelmo',
        nombre: 'Yelmo del Defensor',
        nombreConjunto: 'Defensor de la Montaña',
        conjuntoId: 'enano_defensor',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 35, max: 50 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 50, max: 70 },
            { stat: TipoStat.RESIST_TODO, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },
    {
        id: 'enano_defensor_pechera',
        nombre: 'Coraza del Defensor',
        nombreConjunto: 'Defensor de la Montaña',
        conjuntoId: 'enano_defensor',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 70, max: 95 }],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 25, max: 40 },
            { stat: TipoStat.VIDA, min: 60, max: 85 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },
    {
        id: 'enano_defensor_escudo',
        nombre: 'Escudo del Defensor',
        nombreConjunto: 'Defensor de la Montaña',
        conjuntoId: 'enano_defensor',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 55, max: 75 },
            { stat: TipoStat.PROB_BLOQUEO, min: 35, max: 35 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.PROB_BLOQUEO, min: 10, max: 15 },
            { stat: TipoStat.RESIST_TODO, min: 12, max: 18 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 20,
    },

    // === Rey Bajo la Montaña (set supremo) ===
    {
        id: 'enano_rey_hacha',
        nombre: 'Gran Hacha del Rey',
        nombreConjunto: 'Rey Bajo la Montaña',
        conjuntoId: 'enano_rey_montaña',
        tipo: TipoItem.HACHA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 42, max: 42 },
            { stat: TipoStat.DAÑO_MAX, min: 90, max: 90 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 160, max: 220 },
            { stat: TipoStat.FUERZA, min: 28, max: 40 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'enano_rey_corona',
        nombre: 'Corona del Rey Bajo la Montaña',
        nombreConjunto: 'Rey Bajo la Montaña',
        conjuntoId: 'enano_rey_montaña',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 80, max: 110 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 130, max: 180 },
            { stat: TipoStat.TODOS_ATRIBUTOS, min: 12, max: 18 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'enano_rey_pechera',
        nombre: 'Armadura Real Enana',
        nombreConjunto: 'Rey Bajo la Montaña',
        conjuntoId: 'enano_rey_montaña',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 170, max: 220 }],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 55, max: 80 },
            { stat: TipoStat.RESIST_TODO, min: 22, max: 32 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'enano_rey_guantes',
        nombre: 'Guanteletes del Rey',
        nombreConjunto: 'Rey Bajo la Montaña',
        conjuntoId: 'enano_rey_montaña',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 45, max: 62 }],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 20, max: 30 },
            { stat: TipoStat.VITALIDAD, min: 18, max: 25 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'enano_rey_botas',
        nombre: 'Botas del Rey',
        nombreConjunto: 'Rey Bajo la Montaña',
        conjuntoId: 'enano_rey_montaña',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 42, max: 58 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 70, max: 100 },
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 12, max: 18 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'enano_rey_anillo',
        nombre: 'Sello del Rey',
        nombreConjunto: 'Rey Bajo la Montaña',
        conjuntoId: 'enano_rey_montaña',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.HALLAZGO_MAGICO, min: 25, max: 40 },
            { stat: TipoStat.HALLAZGO_ORO, min: 40, max: 60 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
];
