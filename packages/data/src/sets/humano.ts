/**
 * Sets por Raza - HUMANO
 * 10 sets temáticos para la raza Humano
 */

import { Conjunto, ItemConjunto, TipoItem, NivelItem, TipoStat, Rareza } from '@lootsystem/core';

// ============================================
// SETS HUMANO
// ============================================

export const SETS_HUMANO: Conjunto[] = [
    // 1. Set inicial - Soldado de la Guardia
    {
        id: 'humano_soldado_guardia',
        nombre: 'Soldado de la Guardia',
        items: ['humano_guardia_espada', 'humano_guardia_yelmo', 'humano_guardia_pechera', 'humano_guardia_escudo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DEFENSA, valor: 25 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 40 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REDUCCION_DAÑO, valor: 5 },
            { stat: TipoStat.PROB_BLOQUEO, valor: 10 },
        ],
    },
    // 2. Set de mercenario - Mercenario Errante
    {
        id: 'humano_mercenario',
        nombre: 'Mercenario Errante',
        items: ['humano_mercenario_espada', 'humano_mercenario_pechera', 'humano_mercenario_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 25 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.HALLAZGO_ORO, valor: 40 },
            { stat: TipoStat.BONUS_EXPERIENCIA, valor: 15 },
        ],
    },
    // 3. Set de caballero - Caballero del Reino
    {
        id: 'humano_caballero',
        nombre: 'Caballero del Reino',
        items: ['humano_caballero_espada', 'humano_caballero_yelmo', 'humano_caballero_pechera', 'humano_caballero_guantes', 'humano_caballero_escudo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 15 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DEFENSA_PORCENTAJE, valor: 20 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.VIDA, valor: 60 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 35 },
            { stat: TipoStat.PROB_BLOQUEO, valor: 15 },
        ],
    },
    // 4. Set de paladín - Paladín Sagrado
    {
        id: 'humano_paladin',
        nombre: 'Paladín Sagrado',
        items: ['humano_paladin_maza', 'humano_paladin_yelmo', 'humano_paladin_pechera', 'humano_paladin_escudo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 15 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 50 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.REGEN_VIDA, valor: 10 },
            { stat: TipoStat.DAÑO_FUEGO, valor: 25 },
        ],
    },
    // 5. Set de explorador - Explorador del Camino
    {
        id: 'humano_explorador',
        nombre: 'Explorador del Camino',
        items: ['humano_explorador_arco', 'humano_explorador_yelmo', 'humano_explorador_pechera', 'humano_explorador_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.VELOCIDAD_MOVIMIENTO, valor: 15 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DESTREZA, valor: 18 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.HALLAZGO_MAGICO, valor: 25 },
            { stat: TipoStat.BONUS_EXPERIENCIA, valor: 20 },
        ],
    },
    // 6. Set de noble - Vestiduras Nobles
    {
        id: 'humano_noble',
        nombre: 'Vestiduras Nobles',
        items: ['humano_noble_espada', 'humano_noble_pechera', 'humano_noble_anillo', 'humano_noble_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.HALLAZGO_ORO, valor: 50 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.TODOS_ATRIBUTOS, valor: 8 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.HALLAZGO_MAGICO, valor: 30 },
            { stat: TipoStat.BONUS_EXPERIENCIA, valor: 15 },
        ],
    },
    // 7. Set de cruzado - Cruzado de la Luz
    {
        id: 'humano_cruzado',
        nombre: 'Cruzado de la Luz',
        items: ['humano_cruzado_espada', 'humano_cruzado_yelmo', 'humano_cruzado_pechera', 'humano_cruzado_escudo', 'humano_cruzado_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.DEFENSA, valor: 40 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.RESIST_TODO, valor: 12 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.VIDA, valor: 80 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_FUEGO, valor: 35 },
            { stat: TipoStat.REDUCCION_DAÑO, valor: 8 },
        ],
    },
    // 8. Set de mago de batalla - Mago de Batalla
    {
        id: 'humano_mago_batalla',
        nombre: 'Mago de Batalla',
        items: ['humano_mago_espada', 'humano_mago_yelmo', 'humano_mago_pechera', 'humano_mago_amuleto'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.MANA, valor: 60 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.DAÑO_RAYO, valor: 20 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.DAÑO_PORCENTAJE, valor: 30 },
            { stat: TipoStat.REGEN_MANA, valor: 12 },
        ],
    },
    // 9. Set legendario - Campeón del Imperio
    {
        id: 'humano_campeon',
        nombre: 'Campeón del Imperio',
        items: ['humano_campeon_espada', 'humano_campeon_yelmo', 'humano_campeon_pechera', 'humano_campeon_guantes', 'humano_campeon_botas'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.FUERZA, valor: 20 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 70 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 40 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.PROB_CRITICO, valor: 18 },
            { stat: TipoStat.DAÑO_CRITICO, valor: 60 },
        ],
    },
    // 10. Set supremo - Rey de los Humanos
    {
        id: 'humano_rey',
        nombre: 'Rey de los Humanos',
        items: ['humano_rey_espada', 'humano_rey_corona', 'humano_rey_pechera', 'humano_rey_guantes', 'humano_rey_botas', 'humano_rey_anillo'],
        bonuses: [
            { piezasRequeridas: 2, modificadores: [{ stat: TipoStat.TODOS_ATRIBUTOS, valor: 12 }] },
            { piezasRequeridas: 3, modificadores: [{ stat: TipoStat.VIDA, valor: 100 }] },
            { piezasRequeridas: 4, modificadores: [{ stat: TipoStat.DEFENSA_PORCENTAJE, valor: 30 }] },
            { piezasRequeridas: 5, modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, valor: 50 }] },
        ],
        bonusCompleto: [
            { stat: TipoStat.BONUS_EXPERIENCIA, valor: 25 },
            { stat: TipoStat.HALLAZGO_MAGICO, valor: 40 },
            { stat: TipoStat.PROB_CRITICO, valor: 20 },
        ],
    },
];

// ============================================
// ITEMS DE SETS HUMANO (samples)
// ============================================

export const ITEMS_SETS_HUMANO: ItemConjunto[] = [
    // === Soldado de la Guardia ===
    {
        id: 'humano_guardia_espada',
        nombre: 'Espada del Guardia',
        nombreConjunto: 'Soldado de la Guardia',
        conjuntoId: 'humano_soldado_guardia',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 6, max: 6 },
            { stat: TipoStat.DAÑO_MAX, min: 14, max: 14 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 6, max: 10 },
            { stat: TipoStat.DEFENSA, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },
    {
        id: 'humano_guardia_yelmo',
        nombre: 'Yelmo del Guardia',
        nombreConjunto: 'Soldado de la Guardia',
        conjuntoId: 'humano_soldado_guardia',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 12, max: 18 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 20, max: 30 },
            { stat: TipoStat.FUERZA, min: 4, max: 6 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },
    {
        id: 'humano_guardia_pechera',
        nombre: 'Coraza del Guardia',
        nombreConjunto: 'Soldado de la Guardia',
        conjuntoId: 'humano_soldado_guardia',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 28, max: 38 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 30, max: 45 },
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },
    {
        id: 'humano_guardia_escudo',
        nombre: 'Escudo del Guardia',
        nombreConjunto: 'Soldado de la Guardia',
        conjuntoId: 'humano_soldado_guardia',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 8,
        nivelCalidad: 8,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 15, max: 22 },
            { stat: TipoStat.PROB_BLOQUEO, min: 22, max: 22 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA, min: 15, max: 25 },
            { stat: TipoStat.RESIST_TODO, min: 5, max: 8 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 8,
    },

    // === Caballero del Reino ===
    {
        id: 'humano_caballero_espada',
        nombre: 'Espada del Caballero',
        nombreConjunto: 'Caballero del Reino',
        conjuntoId: 'humano_caballero',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 22,
        nivelCalidad: 22,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 14, max: 14 },
            { stat: TipoStat.DAÑO_MAX, min: 32, max: 32 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 50, max: 80 },
            { stat: TipoStat.FUERZA, min: 12, max: 18 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 22,
    },
    {
        id: 'humano_caballero_yelmo',
        nombre: 'Yelmo del Caballero',
        nombreConjunto: 'Caballero del Reino',
        conjuntoId: 'humano_caballero',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 22,
        nivelCalidad: 22,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 32, max: 45 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 40, max: 60 },
            { stat: TipoStat.RESIST_TODO, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 22,
    },
    {
        id: 'humano_caballero_pechera',
        nombre: 'Armadura del Caballero',
        nombreConjunto: 'Caballero del Reino',
        conjuntoId: 'humano_caballero',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 22,
        nivelCalidad: 22,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 60, max: 85 }],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 25, max: 40 },
            { stat: TipoStat.VIDA, min: 50, max: 75 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 22,
    },
    {
        id: 'humano_caballero_guantes',
        nombre: 'Guanteletes del Caballero',
        nombreConjunto: 'Caballero del Reino',
        conjuntoId: 'humano_caballero',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 22,
        nivelCalidad: 22,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 18, max: 26 }],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 10, max: 15 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 8, max: 12 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 22,
    },
    {
        id: 'humano_caballero_escudo',
        nombre: 'Escudo del Caballero',
        nombreConjunto: 'Caballero del Reino',
        conjuntoId: 'humano_caballero',
        tipo: TipoItem.ESCUDO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 22,
        nivelCalidad: 22,
        statsBase: [
            { stat: TipoStat.DEFENSA, min: 45, max: 65 },
            { stat: TipoStat.PROB_BLOQUEO, min: 32, max: 32 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.PROB_BLOQUEO, min: 8, max: 12 },
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 15, max: 25 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 22,
    },

    // === Rey de los Humanos (set supremo) ===
    {
        id: 'humano_rey_espada',
        nombre: 'Espada del Rey',
        nombreConjunto: 'Rey de los Humanos',
        conjuntoId: 'humano_rey',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 40, max: 40 },
            { stat: TipoStat.DAÑO_MAX, min: 85, max: 85 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 150, max: 200 },
            { stat: TipoStat.FUERZA, min: 25, max: 35 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'humano_rey_corona',
        nombre: 'Corona del Rey',
        nombreConjunto: 'Rey de los Humanos',
        conjuntoId: 'humano_rey',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 70, max: 95 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 100, max: 150 },
            { stat: TipoStat.TODOS_ATRIBUTOS, min: 10, max: 15 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'humano_rey_pechera',
        nombre: 'Armadura Real',
        nombreConjunto: 'Rey de los Humanos',
        conjuntoId: 'humano_rey',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 150, max: 200 }],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 50, max: 75 },
            { stat: TipoStat.RESIST_TODO, min: 20, max: 30 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'humano_rey_guantes',
        nombre: 'Guanteletes Reales',
        nombreConjunto: 'Rey de los Humanos',
        conjuntoId: 'humano_rey',
        tipo: TipoItem.GUANTES,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 40, max: 55 }],
        modificadoresFijos: [
            { stat: TipoStat.FUERZA, min: 18, max: 25 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 15, max: 22 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'humano_rey_botas',
        nombre: 'Botas Reales',
        nombreConjunto: 'Rey de los Humanos',
        conjuntoId: 'humano_rey',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 38, max: 52 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 20, max: 30 },
            { stat: TipoStat.VIDA, min: 50, max: 75 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
    {
        id: 'humano_rey_anillo',
        nombre: 'Anillo del Rey',
        nombreConjunto: 'Rey de los Humanos',
        conjuntoId: 'humano_rey',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.ELITE,
        nivelRequerido: 50,
        nivelCalidad: 50,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.TODOS_ATRIBUTOS, min: 12, max: 18 },
            { stat: TipoStat.HALLAZGO_MAGICO, min: 25, max: 40 },
        ],
        rareza: Rareza.CONJUNTO,
        nivelDrop: 50,
    },
];
