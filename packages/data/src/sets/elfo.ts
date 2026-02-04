/**
 * Sets por Raza - ELFO
 * 10 sets temáticos para la raza Elfo
 */

import { Conjunto, ItemConjunto, TipoItem, NivelItem, TipoStat, Rareza } from '@lootsystem/core';

// ============================================
// SETS ELFO
// ============================================

export const SETS_ELFO: Conjunto[] = [
    // 1. Set inicial - Cazador del Bosque
    {
        id: 'elfo_cazador_bosque',
        nombre: 'Cazador del Bosque',
        items: ['elfo_cazador_arco', 'elfo_cazador_yelmo', 'elfo_cazador_pechera'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DESTREZA, valor: 15 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.PROB_CRITICO, valor: 10 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, valor: 15 },
        ],
    },
    // 2. Set mágico - Susurros del Viento
    {
        id: 'elfo_susurros_viento',
        nombre: 'Susurros del Viento',
        items: ['elfo_viento_yelmo', 'elfo_viento_pechera', 'elfo_viento_botas', 'elfo_viento_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VELOCIDAD_MOVIMIENTO, valor: 15 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.MANA, valor: 50 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REGEN_MANA, valor: 10 },
            { stat: TipoStat.RESIST_TODO, valor: 10 },
        ],
    },
    // 3. Set de arquero - Ojo de Águila
    {
        id: 'elfo_ojo_aguila',
        nombre: 'Ojo de Águila',
        items: ['elfo_aguila_arco', 'elfo_aguila_guantes', 'elfo_aguila_yelmo', 'elfo_aguila_anillo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 20 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.PROB_CRITICO, valor: 8 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_CRITICO, valor: 50 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, valor: 20 },
        ],
    },
    // 4. Set de la naturaleza - Guardián del Bosque
    {
        id: 'elfo_guardian_bosque',
        nombre: 'Guardián del Bosque',
        items: ['elfo_guardian_baston', 'elfo_guardian_pechera', 'elfo_guardian_yelmo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VIDA, valor: 40 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REGEN_VIDA, valor: 8 },
            { stat: TipoStat.RESIST_VENENO, valor: 30 },
        ],
    },
    // 5. Set nocturno - Sombra Lunar
    {
        id: 'elfo_sombra_lunar',
        nombre: 'Sombra Lunar',
        items: ['elfo_lunar_daga', 'elfo_lunar_pechera', 'elfo_lunar_guantes', 'elfo_lunar_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DESTREZA, valor: 20 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VELOCIDAD_MOVIMIENTO, valor: 10 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.PROB_CRITICO, valor: 15 },
            { stat: TipoStat.ROBO_VIDA, valor: 5 },
        ],
    },
    // 6. Set arcano - Arcano de la Luna
    {
        id: 'elfo_arcano_luna',
        nombre: 'Arcano de la Luna',
        items: ['elfo_arcano_varita', 'elfo_arcano_yelmo', 'elfo_arcano_pechera', 'elfo_arcano_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.MANA, valor: 80 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.ENERGIA, valor: 20 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_FRIO, valor: 30 },
            { stat: TipoStat.REGEN_MANA, valor: 15 },
        ],
    },
    // 7. Set de élite - Centinela Élfico
    {
        id: 'elfo_centinela',
        nombre: 'Centinela Élfico',
        items: ['elfo_centinela_arco', 'elfo_centinela_yelmo', 'elfo_centinela_pechera', 'elfo_centinela_guantes', 'elfo_centinela_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DEFENSA, valor: 30 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 60 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 15 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 40 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, valor: 25 },
        ],
    },
    // 8. Set de la hoja - Danzarín de Hojas
    {
        id: 'elfo_danzarin_hojas',
        nombre: 'Danzarín de Hojas',
        items: ['elfo_hojas_espada', 'elfo_hojas_pechera', 'elfo_hojas_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VELOCIDAD_ATAQUE, valor: 20 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DESTREZA, valor: 25 },
            { stat: TipoStat.REDUCCION_DAÑO, valor: 5 },
        ],
    },
    // 9. Set legendario - Luz de Estrellas
    {
        id: 'elfo_luz_estrellas',
        nombre: 'Luz de Estrellas',
        items: ['elfo_estrellas_arco', 'elfo_estrellas_yelmo', 'elfo_estrellas_pechera', 'elfo_estrellas_guantes', 'elfo_estrellas_anillo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.HALLAZGO_MAGICO, valor: 25 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.BONUS_EXPERIENCIA, valor: 15 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.MANA, valor: 100 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_RAYO, valor: 50 },
            { stat: TipoStat.PROB_CRITICO, valor: 20 },
        ],
    },
    // 10. Set supremo - Corona del Alto Elfo
    {
        id: 'elfo_alto_elfo',
        nombre: 'Corona del Alto Elfo',
        items: ['elfo_alto_arco', 'elfo_alto_corona', 'elfo_alto_pechera', 'elfo_alto_guantes', 'elfo_alto_botas', 'elfo_alto_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.TODOS_ATRIBUTOS, valor: 10 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 80 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.MANA, valor: 80 }] },
            { piezasRequeridas: 5, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 20 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 60 },
            { stat: TipoStat.PROB_CRITICO, valor: 25 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, valor: 30 },
        ],
    },
];

// ============================================
// ITEMS DE SETS ELFO
// ============================================

export const ITEMS_SETS_ELFO: ItemConjunto[] = [
    // === Cazador del Bosque ===
    {
        id: 'elfo_cazador_arco',
        nombre: 'Arco del Cazador',
        nombreConjunto: 'Cazador del Bosque',
        conjuntoId: 'elfo_cazador_bosque',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 8, max: 8 },
            { stat: TipoStat.DAÑO_MAX, min: 18, max: 18 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DESTREZA, min: 8, max: 12 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 10,
    },
    {
        id: 'elfo_cazador_yelmo',
        nombre: 'Capucha del Cazador',
        nombreConjunto: 'Cazador del Bosque',
        conjuntoId: 'elfo_cazador_bosque',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 15, max: 22 }],
        modificadoresFijos: [
            { stat: TipoStat.DESTREZA, min: 5, max: 8 },
            { stat: TipoStat.VIDA, min: 20, max: 30 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 10,
    },
    {
        id: 'elfo_cazador_pechera',
        nombre: 'Túnica del Cazador',
        nombreConjunto: 'Cazador del Bosque',
        conjuntoId: 'elfo_cazador_bosque',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 10,
        nivelCalidad: 10,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 25, max: 35 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 25, max: 40 },
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 5, max: 10 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 10,
    },

    // === Susurros del Viento ===
    {
        id: 'elfo_viento_yelmo',
        nombre: 'Diadema del Viento',
        nombreConjunto: 'Susurros del Viento',
        conjuntoId: 'elfo_susurros_viento',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 18, max: 28 }],
        modificadoresFijos: [
            { stat: TipoStat.MANA, min: 30, max: 45 },
            { stat: TipoStat.REGEN_MANA, min: 3, max: 5 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 15,
    },
    {
        id: 'elfo_viento_pechera',
        nombre: 'Manto del Viento',
        nombreConjunto: 'Susurros del Viento',
        conjuntoId: 'elfo_susurros_viento',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 30, max: 45 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 8, max: 12 },
            { stat: TipoStat.ENERGIA, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 15,
    },
    {
        id: 'elfo_viento_botas',
        nombre: 'Pasos del Viento',
        nombreConjunto: 'Susurros del Viento',
        conjuntoId: 'elfo_susurros_viento',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 10, max: 16 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 15, max: 20 },
            { stat: TipoStat.DESTREZA, min: 6, max: 10 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 15,
    },
    {
        id: 'elfo_viento_amuleto',
        nombre: 'Colgante del Viento',
        nombreConjunto: 'Susurros del Viento',
        conjuntoId: 'elfo_susurros_viento',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.MANA, min: 25, max: 40 },
            { stat: TipoStat.RESIST_FRIO, min: 15, max: 25 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 15,
    },

    // === Ojo de Águila ===
    {
        id: 'elfo_aguila_arco',
        nombre: 'Arco del Águila',
        nombreConjunto: 'Ojo de Águila',
        conjuntoId: 'elfo_ojo_aguila',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 18, max: 18 },
            { stat: TipoStat.DAÑO_MAX, min: 40, max: 40 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 60, max: 90 },
            { stat: TipoStat.PROB_CRITICO, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },
    {
        id: 'elfo_aguila_guantes',
        nombre: 'Guantes del Águila',
        nombreConjunto: 'Ojo de Águila',
        conjuntoId: 'elfo_ojo_aguila',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 20, max: 30 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 12, max: 18 },
            { stat: TipoStat.DESTREZA, min: 12, max: 18 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },
    {
        id: 'elfo_aguila_yelmo',
        nombre: 'Yelmo del Águila',
        nombreConjunto: 'Ojo de Águila',
        conjuntoId: 'elfo_ojo_aguila',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 35, max: 50 }],
        modificadoresFijos: [
            { stat: TipoStat.DESTREZA, min: 15, max: 22 },
            { stat: TipoStat.VIDA, min: 40, max: 60 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },
    {
        id: 'elfo_aguila_anillo',
        nombre: 'Anillo del Águila',
        nombreConjunto: 'Ojo de Águila',
        conjuntoId: 'elfo_ojo_aguila',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.PROB_CRITICO, min: 5, max: 8 },
            { stat: TipoStat.DAÑO_CRITICO, min: 25, max: 40 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 25,
    },

    // === Luz de Estrellas (set legendario) ===
    {
        id: 'elfo_estrellas_arco',
        nombre: 'Arco Estelar',
        nombreConjunto: 'Luz de Estrellas',
        conjuntoId: 'elfo_luz_estrellas',
        tipo: TipoItem.ARCO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 35, max: 35 },
            { stat: TipoStat.DAÑO_MAX, min: 70, max: 70 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 120, max: 160 },
            { stat: TipoStat.DAÑO_RAYO, min: 20, max: 40 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 45,
    },
    {
        id: 'elfo_estrellas_yelmo',
        nombre: 'Corona Estelar',
        nombreConjunto: 'Luz de Estrellas',
        conjuntoId: 'elfo_luz_estrellas',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 65, max: 90 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 80, max: 120 },
            { stat: TipoStat.MANA, min: 60, max: 90 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 45,
    },
    {
        id: 'elfo_estrellas_pechera',
        nombre: 'Manto Estelar',
        nombreConjunto: 'Luz de Estrellas',
        conjuntoId: 'elfo_luz_estrellas',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 130, max: 170 }],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 40, max: 60 },
            { stat: TipoStat.RESIST_TODO, min: 15, max: 25 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 45,
    },
    {
        id: 'elfo_estrellas_guantes',
        nombre: 'Guantes Estelares',
        nombreConjunto: 'Luz de Estrellas',
        conjuntoId: 'elfo_luz_estrellas',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 35, max: 50 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 18, max: 25 },
            { stat: TipoStat.PROB_CRITICO, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 45,
    },
    {
        id: 'elfo_estrellas_anillo',
        nombre: 'Anillo de las Estrellas',
        nombreConjunto: 'Luz de Estrellas',
        conjuntoId: 'elfo_luz_estrellas',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 45,
        nivelCalidad: 45,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.HALLAZGO_MAGICO, min: 20, max: 35 },
            { stat: TipoStat.BONUS_EXPERIENCIA, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 45,
    },
];
