/**
 * Sistema de Razas - Tipos
 */

export enum Raza {
    ELFO = 'elfo',
    HUMANO = 'humano',
    ORCO = 'orco',
    ENANO = 'enano',
}

export interface BonusRaza {
    fuerza: number;
    destreza: number;
    vitalidad: number;
    energia: number;
    vida: number;
    mana: number;
    velocidadAtaque: number;
    velocidadMovimiento: number;
    resistencias: number;
    experiencia: number;
    hallazgoMagico: number;
}

export interface HabilidadPasiva {
    id: string;
    nombre: string;
    descripcion: string;
    efecto: (contexto: ContextoHabilidad) => ModificadorHabilidad;
}

export interface ContextoHabilidad {
    vidaActual: number;
    vidaMaxima: number;
    manaActual: number;
    manaMaxima: number;
    enemigoTipo?: string;
    terreno?: string;
    horaDelDia?: 'dia' | 'noche';
}

export interface ModificadorHabilidad {
    dañoExtra?: number;
    defenseExtra?: number;
    criticoExtra?: number;
    velocidadExtra?: number;
}

export interface ConfigRaza {
    id: Raza;
    nombre: string;
    descripcion: string;
    bonus: BonusRaza;
    pasiva: HabilidadPasiva;
    itemsPreferidos: string[]; // Tipos de item que esta raza usa mejor
    restricciones?: string[]; // Items que no puede usar
    /** Bonuses de producción para juego de estrategia */
    productionBonus: ProductionBonus;
}

/**
 * Bonuses de producción de recursos por raza (en porcentaje)
 */
export interface ProductionBonus {
    wood: number;   // % bonus madera
    iron: number;   // % bonus hierro
    gold: number;   // % bonus oro
    doblones: number; // % bonus doblones
    population: number; // % bonus población máxima
}

// ============================================
// CONFIGURACIONES DE RAZA
// ============================================

export const ELFO: ConfigRaza = {
    id: Raza.ELFO,
    nombre: 'Elfo',
    descripcion: 'Seres ancestrales de los bosques. Ágiles y mágicos.',
    bonus: {
        fuerza: 0,
        destreza: 20,
        vitalidad: 0,
        energia: 15,
        vida: 0,
        mana: 20,
        velocidadAtaque: 10,
        velocidadMovimiento: 10,
        resistencias: 5,
        experiencia: 0,
        hallazgoMagico: 10,
    },
    pasiva: {
        id: 'vision_nocturna',
        nombre: 'Visión Nocturna',
        descripcion: '+25% crítico durante la noche o en bosques.',
        efecto: (ctx) => {
            if (ctx.horaDelDia === 'noche' || ctx.terreno === 'bosque') {
                return { criticoExtra: 25 };
            }
            return {};
        },
    },
    itemsPreferidos: ['arco', 'baston', 'daga', 'varita'],
    productionBonus: {
        wood: 15,   // Elfos: +15% madera (conexión con bosques)
        iron: 0,
        gold: 5,
        doblones: 0,
        population: 0,
    },
};

export const HUMANO: ConfigRaza = {
    id: Raza.HUMANO,
    nombre: 'Humano',
    descripcion: 'Versátiles y adaptables. Buenos en todo.',
    bonus: {
        fuerza: 10,
        destreza: 10,
        vitalidad: 10,
        energia: 10,
        vida: 10,
        mana: 10,
        velocidadAtaque: 5,
        velocidadMovimiento: 5,
        resistencias: 5,
        experiencia: 15,
        hallazgoMagico: 10,
    },
    pasiva: {
        id: 'adaptabilidad',
        nombre: 'Adaptabilidad',
        descripcion: 'Puede usar cualquier tipo de arma sin penalización.',
        efecto: () => ({ dañoExtra: 5 }),
    },
    itemsPreferidos: [], // Puede usar todo
    productionBonus: {
        wood: 10,   // Humanos: +10% en todo (versátiles)
        iron: 10,
        gold: 10,
        doblones: 10,
        population: 10,
    },
};

export const ORCO: ConfigRaza = {
    id: Raza.ORCO,
    nombre: 'Orco',
    descripcion: 'Guerreros brutales. Fuerza bruta sobre todo.',
    bonus: {
        fuerza: 30,
        destreza: -5,
        vitalidad: 15,
        energia: -10,
        vida: 25,
        mana: -10,
        velocidadAtaque: -5,
        velocidadMovimiento: 0,
        resistencias: 10,
        experiencia: -5,
        hallazgoMagico: 0,
    },
    pasiva: {
        id: 'furia_sangrienta',
        nombre: 'Furia Sangrienta',
        descripcion: '+50% daño cuando vida < 30%.',
        efecto: (ctx) => {
            const porcentajeVida = ctx.vidaActual / ctx.vidaMaxima;
            if (porcentajeVida < 0.3) {
                return { dañoExtra: 50 };
            }
            if (porcentajeVida < 0.5) {
                return { dañoExtra: 20 };
            }
            return {};
        },
    },
    itemsPreferidos: ['hacha', 'maza', 'espada'],
    restricciones: ['varita', 'baston'],
    productionBonus: {
        wood: 0,
        iron: 20,   // Orcos: +20% hierro (guerreros)
        gold: 0,
        doblones: 0,
        population: 15,  // Reproducción rápida
    },
};

export const ENANO: ConfigRaza = {
    id: Raza.ENANO,
    nombre: 'Enano',
    descripcion: 'Maestros herreros. Resistentes como la roca.',
    bonus: {
        fuerza: 15,
        destreza: 0,
        vitalidad: 25,
        energia: 5,
        vida: 20,
        mana: 0,
        velocidadAtaque: 0,
        velocidadMovimiento: -5,
        resistencias: 20,
        experiencia: 0,
        hallazgoMagico: 5,
    },
    pasiva: {
        id: 'maestro_herrero',
        nombre: 'Maestro Herrero',
        descripcion: '+15% stats en todo el equipamiento.',
        efecto: () => ({ defenseExtra: 15 }),
    },
    itemsPreferidos: ['hacha', 'martillo', 'escudo'],
    restricciones: ['arco'],
    productionBonus: {
        wood: -10,  // Enanos: -10% madera (prefieren piedra)
        iron: 15,   // +15% hierro
        gold: 25,   // +25% oro (maestros mineros)
        doblones: 5,
        population: 0,
    },
};

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

export const RAZAS: Record<Raza, ConfigRaza> = {
    [Raza.ELFO]: ELFO,
    [Raza.HUMANO]: HUMANO,
    [Raza.ORCO]: ORCO,
    [Raza.ENANO]: ENANO,
};

export function obtenerRaza(id: Raza): ConfigRaza {
    return RAZAS[id];
}

export function obtenerTodasLasRazas(): ConfigRaza[] {
    return Object.values(RAZAS);
}

export function calcularStatsConBonus(
    statsBase: Record<string, number>,
    raza: ConfigRaza
): Record<string, number> {
    const resultado = { ...statsBase };

    resultado.fuerza = (resultado.fuerza || 0) * (1 + raza.bonus.fuerza / 100);
    resultado.destreza = (resultado.destreza || 0) * (1 + raza.bonus.destreza / 100);
    resultado.vitalidad = (resultado.vitalidad || 0) * (1 + raza.bonus.vitalidad / 100);
    resultado.energia = (resultado.energia || 0) * (1 + raza.bonus.energia / 100);

    return resultado;
}

export function puedeUsarItem(raza: ConfigRaza, tipoItem: string): boolean {
    if (raza.restricciones?.includes(tipoItem)) {
        return false;
    }
    return true;
}

export function estaPreferido(raza: ConfigRaza, tipoItem: string): boolean {
    if (raza.itemsPreferidos.length === 0) return true; // Humano
    return raza.itemsPreferidos.includes(tipoItem);
}

/**
 * Aplica bonus de producción racial a una tasa base
 * @param baseRate Tasa de producción base
 * @param bonusPercent Porcentaje de bonus (ej: 15 = +15%)
 * @returns Tasa con bonus aplicado
 */
export function applyRacialProductionBonus(baseRate: number, bonusPercent: number): number {
    return Math.floor(baseRate * (1 + bonusPercent / 100));
}

/**
 * Obtiene las tasas de producción con bonuses raciales aplicados
 */
export function getProductionWithRacialBonus(
    baseProduction: { wood: number; iron: number; gold: number; doblones: number },
    raza: ConfigRaza
): { wood: number; iron: number; gold: number; doblones: number } {
    return {
        wood: applyRacialProductionBonus(baseProduction.wood, raza.productionBonus.wood),
        iron: applyRacialProductionBonus(baseProduction.iron, raza.productionBonus.iron),
        gold: applyRacialProductionBonus(baseProduction.gold, raza.productionBonus.gold),
        doblones: applyRacialProductionBonus(baseProduction.doblones, raza.productionBonus.doblones),
    };
}

/**
 * Obtiene población máxima con bonus racial
 */
export function getPopulationWithRacialBonus(basePopulation: number, raza: ConfigRaza): number {
    return applyRacialProductionBonus(basePopulation, raza.productionBonus.population);
}
