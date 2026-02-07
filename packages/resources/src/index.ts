/**
 * @lootsystem/resources
 * Sistema de Recursos para juego de estrategia tipo Grepolis
 */

// ============================================
// TIPOS DE RECURSOS
// ============================================

/**
 * Tipos de recursos disponibles en el juego
 */
export enum ResourceType {
    WOOD = 'wood',
    IRON = 'iron',
    GOLD = 'gold',
    DOBLONES = 'doblones',
    ETHER_FRAGMENTS = 'etherFragments',
    POPULATION = 'population', // Especial: no se almacena, es un límite
}

/**
 * Información display de cada recurso
 */
export interface ResourceInfo {
    id: ResourceType;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export const RESOURCE_INFO: Record<ResourceType, ResourceInfo> = {
    [ResourceType.WOOD]: {
        id: ResourceType.WOOD,
        name: 'Madera',
        icon: '🪵',
        color: '#8B4513',
        description: 'Recurso básico para construcción',
    },
    [ResourceType.IRON]: {
        id: ResourceType.IRON,
        name: 'Hierro',
        icon: '⛏️',
        color: '#708090',
        description: 'Metal para armas y edificios avanzados',
    },
    [ResourceType.GOLD]: {
        id: ResourceType.GOLD,
        name: 'Oro',
        icon: '🪙',
        color: '#FFD700',
        description: 'Metal precioso para edificios avanzados y tropas élite',
    },
    [ResourceType.DOBLONES]: {
        id: ResourceType.DOBLONES,
        name: 'Doblones',
        icon: '💰',
        color: '#DAA520',
        description: 'Moneda común usada para el comercio en el mercado',
    },
    [ResourceType.ETHER_FRAGMENTS]: {
        id: ResourceType.ETHER_FRAGMENTS,
        name: 'Fragmentos de Éter',
        icon: '✨',
        color: '#9370DB',
        description: 'Moneda premium impulsada por la economía del reino',
    },
    [ResourceType.POPULATION]: {
        id: ResourceType.POPULATION,
        name: 'Población',
        icon: '👥',
        color: '#4CAF50',
        description: 'Habitantes disponibles para trabajar',
    },
};

// ============================================
// ESTADO DE RECURSOS
// ============================================

/**
 * Estado actual de los recursos de un jugador
 */
export interface ResourceState {
    /** Cantidad actual de madera */
    wood: number;
    /** Cantidad actual de hierro */
    iron: number;
    /** Cantidad actual de oro (recurso) */
    gold: number;
    /** Cantidad de Doblones (moneda mercado) */
    doblones: number;
    /** Cantidad de Fragmentos de Éter (Premium) */
    etherFragments: number;
    /** Población actual usada */
    populationUsed: number;
    /** Población máxima (determinada por granja) */
    populationMax: number;
}

/**
 * Producción por hora de recursos
 */
export interface ProductionRates {
    woodPerHour: number;
    ironPerHour: number;
    goldPerHour: number;
    doblonesPerHour: number;
}

/**
 * Límites de almacenamiento
 */
export interface StorageLimits {
    maxWood: number;
    maxIron: number;
    maxGold: number;
    maxDoblones: number;
}

/**
 * Costo de recursos para una acción
 */
export interface ResourceCost {
    wood?: number;
    iron?: number;
    gold?: number;
    population?: number; // Población consumida permanentemente
}

// ============================================
// FUNCIONES DE RECURSOS
// ============================================

/**
 * Crea un estado de recursos inicial
 * Recursos suficientes para construir edificios básicos de producción
 */
export function createInitialResources(): ResourceState {
    return {
        wood: 1500,   // Suficiente para: Granja + Aserradero + Minas
        iron: 1000,   // Suficiente para empezar producción
        gold: 500,    // Reserva inicial
        doblones: 100, // Capital inicial para mercado
        etherFragments: 0,
        populationUsed: 0,
        populationMax: 100, // Base sin granja
    };
}

/**
 * Calcula la producción de recursos en un período de tiempo
 * @param rates Tasas de producción por hora
 * @param elapsedSeconds Segundos transcurridos
 * @returns Recursos producidos
 */
export function calculateProduction(
    rates: ProductionRates,
    elapsedSeconds: number
): Omit<ResourceState, 'populationUsed' | 'populationMax' | 'etherFragments'> {
    const hours = elapsedSeconds / 3600;
    return {
        wood: Math.floor(rates.woodPerHour * hours),
        iron: Math.floor(rates.ironPerHour * hours),
        gold: Math.floor(rates.goldPerHour * hours),
        doblones: Math.floor(rates.doblonesPerHour * hours),
    };
}

/**
 * Aplica producción al estado actual respetando límites de almacén
 */
export function applyProduction(
    current: ResourceState,
    production: { wood: number; iron: number; gold: number; doblones: number },
    limits: StorageLimits
): ResourceState {
    return {
        ...current,
        wood: Math.min(current.wood + production.wood, limits.maxWood),
        iron: Math.min(current.iron + production.iron, limits.maxIron),
        gold: Math.min(current.gold + production.gold, limits.maxGold),
        doblones: Math.min(current.doblones + production.doblones, limits.maxDoblones),
    };
}

/**
 * Verifica si el jugador puede pagar un costo
 */
export function canAfford(resources: ResourceState, cost: ResourceCost): boolean {
    if (cost.wood && resources.wood < cost.wood) return false;
    if (cost.iron && resources.iron < cost.iron) return false;
    if (cost.gold && resources.gold < cost.gold) return false;
    if (cost.population) {
        const availablePopulation = resources.populationMax - resources.populationUsed;
        if (availablePopulation < cost.population) return false;
    }
    return true;
}

/**
 * Resta recursos (después de verificar con canAfford)
 */
export function deductResources(
    resources: ResourceState,
    cost: ResourceCost
): ResourceState {
    return {
        ...resources,
        wood: resources.wood - (cost.wood || 0),
        iron: resources.iron - (cost.iron || 0),
        gold: resources.gold - (cost.gold || 0),
        populationUsed: resources.populationUsed + (cost.population || 0),
    };
}

/**
 * Añade recursos (para recompensas, etc.)
 */
export function addResources(
    resources: ResourceState,
    amount: Partial<ResourceState>,
    limits: StorageLimits
): ResourceState {
    return {
        ...resources,
        wood: Math.min(resources.wood + (amount.wood || 0), limits.maxWood),
        iron: Math.min(resources.iron + (amount.iron || 0), limits.maxIron),
        gold: Math.min(resources.gold + (amount.gold || 0), limits.maxGold),
        doblones: Math.min(resources.doblones + (amount.doblones || 0), limits.maxDoblones),
    };
}

/**
 * Obtiene población disponible
 */
export function getAvailablePopulation(resources: ResourceState): number {
    return resources.populationMax - resources.populationUsed;
}

/**
 * Formatea un recurso para display
 */
export function formatResource(type: ResourceType, amount: number): string {
    const info = RESOURCE_INFO[type];
    return `${info.icon} ${amount.toLocaleString()}`;
}

/**
 * Formatea un costo completo
 */
export function formatCost(cost: ResourceCost): string {
    const parts: string[] = [];
    if (cost.wood) parts.push(formatResource(ResourceType.WOOD, cost.wood));
    if (cost.iron) parts.push(formatResource(ResourceType.IRON, cost.iron));
    if (cost.gold) parts.push(formatResource(ResourceType.GOLD, cost.gold));
    if (cost.population) parts.push(formatResource(ResourceType.POPULATION, cost.population));
    return parts.join(' • ');
}

// ============================================
// ALMACÉN - LÍMITES POR NIVEL
// ============================================

/**
 * Capacidad base del almacén por nivel
 */
export const STORAGE_CAPACITY_PER_LEVEL: Record<number, number> = {
    0: 1000,
    1: 1500,
    2: 2000,
    3: 3000,
    4: 4500,
    5: 6500,
    6: 9000,
    7: 12000,
    8: 16000,
    9: 21000,
    10: 27000,
    15: 75000,
    20: 180000,
    25: 400000,
    30: 1000000,
};

/**
 * Obtiene la capacidad del almacén para un nivel dado
 */
export function getStorageCapacity(level: number): number {
    // Si el nivel exacto existe, lo usamos
    if (STORAGE_CAPACITY_PER_LEVEL[level] !== undefined) {
        return STORAGE_CAPACITY_PER_LEVEL[level];
    }

    // Interpolación para niveles intermedios
    const levels = Object.keys(STORAGE_CAPACITY_PER_LEVEL)
        .map(Number)
        .sort((a, b) => a - b);

    let lower = 0;
    let upper = levels[levels.length - 1];

    for (const l of levels) {
        if (l < level) lower = l;
        if (l > level) {
            upper = l;
            break;
        }
    }

    const lowerCap = STORAGE_CAPACITY_PER_LEVEL[lower];
    const upperCap = STORAGE_CAPACITY_PER_LEVEL[upper];
    const ratio = (level - lower) / (upper - lower);

    return Math.floor(lowerCap + (upperCap - lowerCap) * ratio);
}

/**
 * Crea límites de almacenamiento basados en nivel de almacén
 */
export function createStorageLimits(warehouseLevel: number): StorageLimits {
    const capacity = getStorageCapacity(warehouseLevel);
    return {
        maxWood: capacity,
        maxIron: capacity,
        maxGold: capacity,
        maxDoblones: capacity,
    };
}
