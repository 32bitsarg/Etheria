import {
    Afijo,
    TipoAfijo,
    AfijoGenerado,
    TipoItem,
    TipoStat,
} from '../types';

/**
 * Prefijos en español con tiers
 */
export const PREFIJOS_DEFAULT: Afijo[] = [
    // === DAÑO (Tier 1-3) ===
    {
        id: 'prefijo_afilado',
        nombre: 'Afilado',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 1,
        frecuencia: 100,
        modificadores: [{ stat: TipoStat.DAÑO_MIN, min: 1, max: 3 }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.DAGA],
        grupo: 'daño_plano',
        tier: 1,
    },
    {
        id: 'prefijo_cortante',
        nombre: 'Cortante',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 10,
        frecuencia: 70,
        modificadores: [{ stat: TipoStat.DAÑO_MIN, min: 4, max: 8 }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.DAGA],
        grupo: 'daño_plano',
        tier: 2,
    },
    {
        id: 'prefijo_devastador',
        nombre: 'Devastador',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 25,
        frecuencia: 30,
        modificadores: [{ stat: TipoStat.DAÑO_MIN, min: 9, max: 15 }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.DAGA],
        grupo: 'daño_plano',
        tier: 3,
    },

    // === DAÑO PORCENTUAL (Tier 1-3) ===
    {
        id: 'prefijo_cruel',
        nombre: 'Cruel',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 15,
        frecuencia: 50,
        modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, min: 50, max: 100, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.MAZA, TipoItem.ARCO],
        grupo: 'daño_porcentaje',
        tier: 1,
    },
    {
        id: 'prefijo_brutal',
        nombre: 'Brutal',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 25,
        frecuencia: 30,
        modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, min: 101, max: 200, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.MAZA, TipoItem.ARCO],
        grupo: 'daño_porcentaje',
        tier: 2,
    },
    {
        id: 'prefijo_divino',
        nombre: 'Divino',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 40,
        frecuencia: 10,
        modificadores: [{ stat: TipoStat.DAÑO_PORCENTAJE, min: 201, max: 300, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.MAZA, TipoItem.ARCO],
        grupo: 'daño_porcentaje',
        tier: 3,
    },

    // === DEFENSA (Tier 1-3) ===
    {
        id: 'prefijo_resistente',
        nombre: 'Resistente',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 1,
        frecuencia: 100,
        modificadores: [{ stat: TipoStat.DEFENSA, min: 5, max: 15 }],
        tiposItemPermitidos: [TipoItem.YELMO, TipoItem.PECHERA, TipoItem.ESCUDO],
        grupo: 'defensa_plana',
        tier: 1,
    },
    {
        id: 'prefijo_fortificado',
        nombre: 'Fortificado',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 15,
        frecuencia: 60,
        modificadores: [{ stat: TipoStat.DEFENSA, min: 16, max: 40 }],
        tiposItemPermitidos: [TipoItem.YELMO, TipoItem.PECHERA, TipoItem.ESCUDO],
        grupo: 'defensa_plana',
        tier: 2,
    },
    {
        id: 'prefijo_impenetrable',
        nombre: 'Impenetrable',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 30,
        frecuencia: 25,
        modificadores: [{ stat: TipoStat.DEFENSA, min: 41, max: 80 }],
        tiposItemPermitidos: [TipoItem.YELMO, TipoItem.PECHERA, TipoItem.ESCUDO],
        grupo: 'defensa_plana',
        tier: 3,
    },

    // === FUERZA (Tier 1-3) ===
    {
        id: 'prefijo_bronce',
        nombre: 'de Bronce',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 1,
        frecuencia: 80,
        modificadores: [{ stat: TipoStat.FUERZA, min: 1, max: 5 }],
        grupo: 'fuerza',
        tier: 1,
    },
    {
        id: 'prefijo_hierro',
        nombre: 'de Hierro',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 15,
        frecuencia: 50,
        modificadores: [{ stat: TipoStat.FUERZA, min: 6, max: 12 }],
        grupo: 'fuerza',
        tier: 2,
    },
    {
        id: 'prefijo_titan',
        nombre: 'del Titán',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 30,
        frecuencia: 20,
        modificadores: [{ stat: TipoStat.FUERZA, min: 13, max: 25 }],
        grupo: 'fuerza',
        tier: 3,
    },

    // === VIDA (Tier 1-3) ===
    {
        id: 'prefijo_vigoroso',
        nombre: 'Vigoroso',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 1,
        frecuencia: 80,
        modificadores: [{ stat: TipoStat.VIDA, min: 5, max: 15 }],
        grupo: 'vida_plana',
        tier: 1,
    },
    {
        id: 'prefijo_robusto',
        nombre: 'Robusto',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 15,
        frecuencia: 50,
        modificadores: [{ stat: TipoStat.VIDA, min: 16, max: 40 }],
        grupo: 'vida_plana',
        tier: 2,
    },
    {
        id: 'prefijo_colosal',
        nombre: 'Colosal',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 30,
        frecuencia: 20,
        modificadores: [{ stat: TipoStat.VIDA, min: 41, max: 80 }],
        grupo: 'vida_plana',
        tier: 3,
    },

    // === DAÑO ELEMENTAL ===
    {
        id: 'prefijo_flamigero',
        nombre: 'Flamígero',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 5,
        frecuencia: 60,
        modificadores: [{ stat: TipoStat.DAÑO_FUEGO, min: 3, max: 10 }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.ARCO],
        grupo: 'daño_elemental',
        tier: 1,
    },
    {
        id: 'prefijo_glacial',
        nombre: 'Glacial',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 5,
        frecuencia: 60,
        modificadores: [{ stat: TipoStat.DAÑO_FRIO, min: 2, max: 8 }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.ARCO],
        grupo: 'daño_elemental',
        tier: 1,
    },
    {
        id: 'prefijo_electrico',
        nombre: 'Eléctrico',
        tipo: TipoAfijo.PREFIJO,
        nivelRequerido: 5,
        frecuencia: 60,
        modificadores: [{ stat: TipoStat.DAÑO_RAYO, min: 1, max: 15 }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.HACHA, TipoItem.ARCO],
        grupo: 'daño_elemental',
        tier: 1,
    },
];

/**
 * Sufijos en español con tiers
 */
export const SUFIJOS_DEFAULT: Afijo[] = [
    // === RESISTENCIA FUEGO (Tier 1-3) ===
    {
        id: 'sufijo_resist_fuego_1',
        nombre: 'del Calor',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 1,
        frecuencia: 70,
        modificadores: [{ stat: TipoStat.RESIST_FUEGO, min: 5, max: 15, esPorcentaje: true }],
        grupo: 'resist_fuego',
        tier: 1,
    },
    {
        id: 'sufijo_resist_fuego_2',
        nombre: 'de las Llamas',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 15,
        frecuencia: 40,
        modificadores: [{ stat: TipoStat.RESIST_FUEGO, min: 16, max: 30, esPorcentaje: true }],
        grupo: 'resist_fuego',
        tier: 2,
    },
    {
        id: 'sufijo_resist_fuego_3',
        nombre: 'del Volcán',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 30,
        frecuencia: 15,
        modificadores: [{ stat: TipoStat.RESIST_FUEGO, min: 31, max: 45, esPorcentaje: true }],
        grupo: 'resist_fuego',
        tier: 3,
    },

    // === RESISTENCIA FRÍO (Tier 1-3) ===
    {
        id: 'sufijo_resist_frio_1',
        nombre: 'del Frío',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 1,
        frecuencia: 70,
        modificadores: [{ stat: TipoStat.RESIST_FRIO, min: 5, max: 15, esPorcentaje: true }],
        grupo: 'resist_frio',
        tier: 1,
    },
    {
        id: 'sufijo_resist_frio_2',
        nombre: 'de la Escarcha',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 15,
        frecuencia: 40,
        modificadores: [{ stat: TipoStat.RESIST_FRIO, min: 16, max: 30, esPorcentaje: true }],
        grupo: 'resist_frio',
        tier: 2,
    },
    {
        id: 'sufijo_resist_frio_3',
        nombre: 'del Glaciar',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 30,
        frecuencia: 15,
        modificadores: [{ stat: TipoStat.RESIST_FRIO, min: 31, max: 45, esPorcentaje: true }],
        grupo: 'resist_frio',
        tier: 3,
    },

    // === VIDA (Tier 1-3) ===
    {
        id: 'sufijo_vida_1',
        nombre: 'de Vida',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 1,
        frecuencia: 80,
        modificadores: [{ stat: TipoStat.VIDA, min: 10, max: 25 }],
        grupo: 'vida',
        tier: 1,
    },
    {
        id: 'sufijo_vida_2',
        nombre: 'de Vitalidad',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 20,
        frecuencia: 45,
        modificadores: [{ stat: TipoStat.VIDA, min: 26, max: 60 }],
        grupo: 'vida',
        tier: 2,
    },
    {
        id: 'sufijo_vida_3',
        nombre: 'de la Ballena',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 35,
        frecuencia: 15,
        modificadores: [{ stat: TipoStat.VIDA, min: 61, max: 120 }],
        grupo: 'vida',
        tier: 3,
    },

    // === ROBO DE VIDA ===
    {
        id: 'sufijo_robo_vida_1',
        nombre: 'del Sanguijuela',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 10,
        frecuencia: 40,
        modificadores: [{ stat: TipoStat.ROBO_VIDA, min: 1, max: 3, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.ANILLO, TipoItem.AMULETO],
        grupo: 'robo_vida',
        tier: 1,
    },
    {
        id: 'sufijo_robo_vida_2',
        nombre: 'del Vampiro',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 25,
        frecuencia: 15,
        modificadores: [{ stat: TipoStat.ROBO_VIDA, min: 4, max: 8, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.ANILLO, TipoItem.AMULETO],
        grupo: 'robo_vida',
        tier: 2,
    },

    // === VELOCIDAD DE ATAQUE ===
    {
        id: 'sufijo_velocidad_1',
        nombre: 'de Rapidez',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 5,
        frecuencia: 50,
        modificadores: [{ stat: TipoStat.VELOCIDAD_ATAQUE, min: 10, max: 20, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.ARCO, TipoItem.GUANTES],
        grupo: 'velocidad_ataque',
        tier: 1,
    },
    {
        id: 'sufijo_velocidad_2',
        nombre: 'del Rayo',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 20,
        frecuencia: 25,
        modificadores: [{ stat: TipoStat.VELOCIDAD_ATAQUE, min: 21, max: 35, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.ESPADA, TipoItem.ARCO, TipoItem.GUANTES],
        grupo: 'velocidad_ataque',
        tier: 2,
    },

    // === HALLAZGO MÁGICO ===
    {
        id: 'sufijo_hallazgo_1',
        nombre: 'de Suerte',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 10,
        frecuencia: 35,
        modificadores: [{ stat: TipoStat.HALLAZGO_MAGICO, min: 5, max: 15, esPorcentaje: true }],
        grupo: 'hallazgo_magico',
        tier: 1,
    },
    {
        id: 'sufijo_hallazgo_2',
        nombre: 'de Fortuna',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 25,
        frecuencia: 15,
        modificadores: [{ stat: TipoStat.HALLAZGO_MAGICO, min: 16, max: 35, esPorcentaje: true }],
        grupo: 'hallazgo_magico',
        tier: 2,
    },

    // === VELOCIDAD DE MOVIMIENTO ===
    {
        id: 'sufijo_movimiento_1',
        nombre: 'de Celeridad',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 5,
        frecuencia: 45,
        modificadores: [{ stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 10, max: 20, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.BOTAS],
        grupo: 'velocidad_movimiento',
        tier: 1,
    },
    {
        id: 'sufijo_movimiento_2',
        nombre: 'del Viento',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 20,
        frecuencia: 20,
        modificadores: [{ stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 21, max: 35, esPorcentaje: true }],
        tiposItemPermitidos: [TipoItem.BOTAS],
        grupo: 'velocidad_movimiento',
        tier: 2,
    },

    // === TODOS LOS ATRIBUTOS ===
    {
        id: 'sufijo_atributos',
        nombre: 'de Perfección',
        tipo: TipoAfijo.SUFIJO,
        nivelRequerido: 25,
        frecuencia: 20,
        modificadores: [{ stat: TipoStat.TODOS_ATRIBUTOS, min: 3, max: 10 }],
        grupo: 'todos_atributos',
        tier: 2,
    },
];

// Aliases para compatibilidad
export const DEFAULT_PREFIXES = PREFIJOS_DEFAULT;
export const DEFAULT_SUFFIXES = SUFIJOS_DEFAULT;

export function obtenerTodosLosAfijos(): Afijo[] {
    return [...PREFIJOS_DEFAULT, ...SUFIJOS_DEFAULT];
}

export const getAllDefaultAffixes = obtenerTodosLosAfijos;

export function obtenerAfijosValidos(
    afijos: Afijo[],
    tipoItem: TipoItem,
    nivelItem: number,
    tipoAfijo?: TipoAfijo
): Afijo[] {
    return afijos.filter((afijo) => {
        if (tipoAfijo && afijo.tipo !== tipoAfijo) return false;
        if (afijo.nivelRequerido > nivelItem) return false;
        if (afijo.tiposItemPermitidos && !afijo.tiposItemPermitidos.includes(tipoItem)) return false;
        if (afijo.tiposItemExcluidos && afijo.tiposItemExcluidos.includes(tipoItem)) return false;
        return true;
    });
}

export const getValidAffixes = obtenerAfijosValidos;

export function seleccionarAfijos(
    afijosValidos: Afijo[],
    cantidad: number,
    gruposUsados: Set<string> = new Set()
): Afijo[] {
    const seleccionados: Afijo[] = [];
    const disponibles = [...afijosValidos].filter((a) => !a.grupo || !gruposUsados.has(a.grupo));

    while (seleccionados.length < cantidad && disponibles.length > 0) {
        const pesoTotal = disponibles.reduce((sum, a) => sum + a.frecuencia, 0);
        let roll = Math.random() * pesoTotal;
        let idx = 0;
        for (let i = 0; i < disponibles.length; i++) {
            roll -= disponibles[i].frecuencia;
            if (roll <= 0) { idx = i; break; }
        }
        const afijo = disponibles[idx];
        seleccionados.push(afijo);
        if (afijo.grupo) gruposUsados.add(afijo.grupo);
        for (let i = disponibles.length - 1; i >= 0; i--) {
            if (disponibles[i] === afijo || (afijo.grupo && disponibles[i].grupo === afijo.grupo)) {
                disponibles.splice(i, 1);
            }
        }
    }
    return seleccionados;
}

export const selectAffixes = seleccionarAfijos;

export function rollModificadoresAfijo(afijo: Afijo): AfijoGenerado {
    return {
        afijo,
        modificadoresRolleados: afijo.modificadores.map((mod) => ({
            stat: mod.stat,
            valor: Math.floor(Math.random() * (mod.max - mod.min + 1)) + mod.min,
        })),
    };
}

export const rollAffixModifiers = rollModificadoresAfijo;
