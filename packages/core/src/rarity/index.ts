import { Rareza, ConfigRareza } from '../types';

/**
 * Configuración de rareza en español
 */
export const CONFIG_RAREZA_DEFAULT: Record<Rareza, ConfigRareza> = {
    [Rareza.NORMAL]: {
        id: Rareza.NORMAL,
        nombre: 'Normal',
        color: '#c0c0c0',
        chanceBase: 800,
        minAfijos: 0,
        maxAfijos: 0,
    },
    [Rareza.MAGICO]: {
        id: Rareza.MAGICO,
        nombre: 'Mágico',
        color: '#6495ed',
        chanceBase: 150,
        minAfijos: 1,
        maxAfijos: 2,
    },
    [Rareza.RARO]: {
        id: Rareza.RARO,
        nombre: 'Raro',
        color: '#ffd700',
        chanceBase: 35,
        minAfijos: 3,
        maxAfijos: 6,
    },
    [Rareza.LEGENDARIO]: {
        id: Rareza.LEGENDARIO,
        nombre: 'Legendario',
        color: '#ff8c00',
        chanceBase: 10,
        minAfijos: 0,
        maxAfijos: 0,
    },
    [Rareza.CONJUNTO]: {
        id: Rareza.CONJUNTO,
        nombre: 'Conjunto',
        color: '#00c400',
        chanceBase: 5,
        minAfijos: 0,
        maxAfijos: 0,
    },
};

// Alias para compatibilidad
export const DEFAULT_RARITY_CONFIG = CONFIG_RAREZA_DEFAULT;

/**
 * Calcular chance efectiva con Hallazgo Mágico
 * Fórmula de Diablo 2 con diminishing returns
 */
export function calcularChanceEfectiva(
    chanceBase: number,
    hallazgoMagico: number,
    rareza: Rareza
): number {
    if (rareza === Rareza.NORMAL || hallazgoMagico <= 0) {
        return chanceBase;
    }

    const divisores: Record<Rareza, number> = {
        [Rareza.LEGENDARIO]: 250,
        [Rareza.CONJUNTO]: 200,
        [Rareza.RARO]: 100,
        [Rareza.MAGICO]: 100,
        [Rareza.NORMAL]: 1,
    };

    const divisor = divisores[rareza];
    const factorHM = (1 + hallazgoMagico / 100) / (1 + hallazgoMagico / divisor);

    return Math.floor(chanceBase * factorHM);
}

export const calculateEffectiveChance = calcularChanceEfectiva;

/**
 * Rollear rareza del item
 * Orden: Legendario -> Conjunto -> Raro -> Mágico -> Normal
 */
export function rollRareza(
    hallazgoMagico: number = 0,
    config: Record<Rareza, ConfigRareza> = CONFIG_RAREZA_DEFAULT,
    rarezasPermitidas: Rareza[] = Object.values(Rareza),
    bonusBadLuck: number = 0
): Rareza {
    const roll = Math.floor(Math.random() * 1000);
    let acumulado = 0;

    const ordenCheck: Rareza[] = [
        Rareza.LEGENDARIO,
        Rareza.CONJUNTO,
        Rareza.RARO,
        Rareza.MAGICO,
        Rareza.NORMAL,
    ];

    for (const rareza of ordenCheck) {
        if (!rarezasPermitidas.includes(rareza)) continue;

        let chanceEfectiva = calcularChanceEfectiva(
            config[rareza].chanceBase,
            hallazgoMagico,
            rareza
        );

        // Aplicar bonus de Bad Luck Protection a rarezas mejores
        if (rareza !== Rareza.NORMAL && bonusBadLuck > 0) {
            chanceEfectiva = Math.floor(chanceEfectiva * (1 + bonusBadLuck / 100));
        }

        acumulado += chanceEfectiva;

        if (roll < acumulado) {
            return rareza;
        }
    }

    return Rareza.NORMAL;
}

export const rollRarity = rollRareza;

/**
 * Obtener color de rareza
 */
export function obtenerColorRareza(rareza: Rareza): string {
    return CONFIG_RAREZA_DEFAULT[rareza].color;
}

export const getRarityColor = obtenerColorRareza;

/**
 * Obtener nombre de rareza
 */
export function obtenerNombreRareza(rareza: Rareza): string {
    return CONFIG_RAREZA_DEFAULT[rareza].nombre;
}

export const getRarityName = obtenerNombreRareza;

/**
 * Comparar rarezas (para ordenar)
 */
export function compararRareza(a: Rareza, b: Rareza): number {
    const orden = [
        Rareza.NORMAL,
        Rareza.MAGICO,
        Rareza.RARO,
        Rareza.CONJUNTO,
        Rareza.LEGENDARIO,
    ];
    return orden.indexOf(a) - orden.indexOf(b);
}

export const compareRarity = compararRareza;
