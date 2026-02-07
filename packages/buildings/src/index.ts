/**
 * @lootsystem/buildings
 * Sistema de Edificios para juego de estrategia tipo Grepolis
 */

import { ResourceCost } from '@lootsystem/resources';

// ============================================
// TIPOS DE EDIFICIOS
// ============================================

/**
 * Tipos de edificios disponibles
 */
export enum BuildingType {
    TOWN_HALL = 'town_hall',
    BARRACKS = 'barracks',
    IRON_MINE = 'iron_mine',
    GOLD_MINE = 'gold_mine',
    LUMBER_MILL = 'lumber_mill',
    FARM = 'farm',
    WAREHOUSE = 'warehouse',
    ALLIANCE_CENTER = 'alliance_center',
}

/**
 * Información display de cada edificio
 */
export interface BuildingInfo {
    id: BuildingType;
    name: string;
    icon: string;
    description: string;
    maxLevel: number;
    /** Edificio requerido y su nivel mínimo */
    requires?: { building: BuildingType; level: number };
}

export const BUILDING_INFO: Record<BuildingType, BuildingInfo> = {
    [BuildingType.TOWN_HALL]: {
        id: BuildingType.TOWN_HALL,
        name: 'Ayuntamiento',
        icon: '🏛️',
        description: 'Centro de tu ciudad. Desbloquea otros edificios.',
        maxLevel: 25,
    },
    [BuildingType.BARRACKS]: {
        id: BuildingType.BARRACKS,
        name: 'Cuartel',
        icon: '⚔️',
        description: 'Entrena unidades militares.',
        maxLevel: 25,
        requires: { building: BuildingType.TOWN_HALL, level: 3 },
    },
    [BuildingType.IRON_MINE]: {
        id: BuildingType.IRON_MINE,
        name: 'Mina de Hierro',
        icon: '⛏️',
        description: 'Produce hierro cada hora.',
        maxLevel: 30,
        requires: { building: BuildingType.TOWN_HALL, level: 1 },
    },
    [BuildingType.GOLD_MINE]: {
        id: BuildingType.GOLD_MINE,
        name: 'Mina de Oro',
        icon: '🪙',
        description: 'Produce oro cada hora.',
        maxLevel: 30,
        requires: { building: BuildingType.TOWN_HALL, level: 2 },
    },
    [BuildingType.LUMBER_MILL]: {
        id: BuildingType.LUMBER_MILL,
        name: 'Aserradero',
        icon: '🪓',
        description: 'Produce madera cada hora.',
        maxLevel: 30,
        requires: { building: BuildingType.TOWN_HALL, level: 1 },
    },
    [BuildingType.FARM]: {
        id: BuildingType.FARM,
        name: 'Granja',
        icon: '🌾',
        description: 'Aumenta la población máxima de tu ciudad.',
        maxLevel: 30,
        requires: { building: BuildingType.TOWN_HALL, level: 1 },
    },
    [BuildingType.WAREHOUSE]: {
        id: BuildingType.WAREHOUSE,
        name: 'Almacén',
        icon: '📦',
        description: 'Aumenta la capacidad de almacenamiento.',
        maxLevel: 30,
        requires: { building: BuildingType.TOWN_HALL, level: 1 },
    },
    [BuildingType.ALLIANCE_CENTER]: {
        id: BuildingType.ALLIANCE_CENTER,
        name: 'Centro de Alianza',
        icon: '🏰',
        description: 'Permite unirse o crear alianzas.',
        maxLevel: 1,
        requires: { building: BuildingType.TOWN_HALL, level: 5 },
    },
};

// ============================================
// ESTADO DE EDIFICIOS
// ============================================

/**
 * Estado de un edificio en la ciudad del jugador
 */
export interface BuildingState {
    type: BuildingType;
    level: number;
}

/**
 * Cola de construcción
 */
export interface ConstructionQueueItem {
    id: string;
    buildingType: BuildingType;
    targetLevel: number;
    startTime: number; // timestamp
    endTime: number;   // timestamp
}

// ============================================
// COSTOS Y TIEMPOS
// ============================================

/**
 * Fórmula de costo base multiplicador por nivel
 */
function calculateCostMultiplier(level: number): number {
    return Math.pow(1.26, level - 1);
}

/**
 * Costos base de cada edificio (nivel 1)
 */
const BASE_COSTS: Record<BuildingType, ResourceCost> = {
    [BuildingType.TOWN_HALL]: { wood: 200, iron: 200, gold: 100, population: 5 },
    [BuildingType.BARRACKS]: { wood: 150, iron: 100, gold: 50, population: 8 },
    [BuildingType.IRON_MINE]: { wood: 100, iron: 50, gold: 0, population: 10 },
    [BuildingType.GOLD_MINE]: { wood: 120, iron: 80, gold: 0, population: 12 },
    [BuildingType.LUMBER_MILL]: { wood: 50, iron: 80, gold: 0, population: 10 },
    [BuildingType.FARM]: { wood: 80, iron: 50, gold: 0, population: 0 }, // Granja no consume población
    [BuildingType.WAREHOUSE]: { wood: 100, iron: 100, gold: 50, population: 3 },
    [BuildingType.ALLIANCE_CENTER]: { wood: 500, iron: 500, gold: 500, population: 10 },
};

/**
 * Tiempo base de construcción en segundos (nivel 1)
 * Ajustados para que nivel 4 sea >5 minutos
 */
const BASE_BUILD_TIMES: Record<BuildingType, number> = {
    [BuildingType.TOWN_HALL]: 90,       // 1.5 min (lvl 4 = 5.7 min)
    [BuildingType.BARRACKS]: 75,        // 1.25 min (lvl 4 = 4.7 min)
    [BuildingType.IRON_MINE]: 60,       // 1 min (lvl 4 = 3.8 min)
    [BuildingType.GOLD_MINE]: 70,       // 1.17 min (lvl 4 = 4.4 min)
    [BuildingType.LUMBER_MILL]: 60,     // 1 min (lvl 4 = 3.8 min)
    [BuildingType.FARM]: 50,            // 50 seg (lvl 4 = 3.1 min)
    [BuildingType.WAREHOUSE]: 55,       // 55 seg (lvl 4 = 3.5 min)
    [BuildingType.ALLIANCE_CENTER]: 180, // 3 min (lvl 4 = 11.4 min)
};

/**
 * Multiplicador de tiempo por nivel (más agresivo que costos)
 */
const TIME_MULTIPLIER_PER_LEVEL = 1.40; // 40% más por nivel

/**
 * Obtiene el costo de mejorar un edificio al siguiente nivel
 */
export function getUpgradeCost(buildingType: BuildingType, targetLevel: number): ResourceCost {
    const baseCost = BASE_COSTS[buildingType];
    const multiplier = calculateCostMultiplier(targetLevel);

    return {
        wood: baseCost.wood ? Math.floor(baseCost.wood * multiplier) : 0,
        iron: baseCost.iron ? Math.floor(baseCost.iron * multiplier) : 0,
        gold: baseCost.gold ? Math.floor(baseCost.gold * multiplier) : 0,
        population: baseCost.population || 0, // Población no escala
    };
}

/**
 * Obtiene el tiempo de construcción en segundos
 * Usa un multiplicador más agresivo que los costos (1.40x por nivel)
 */
export function getBuildTime(buildingType: BuildingType, targetLevel: number): number {
    const baseTime = BASE_BUILD_TIMES[buildingType];
    const multiplier = Math.pow(TIME_MULTIPLIER_PER_LEVEL, targetLevel - 1);
    return Math.floor(baseTime * multiplier);
}

/**
 * Formatea tiempo en formato legible
 */
export function formatBuildTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// ============================================
// PRODUCCIÓN POR EDIFICIO
// ============================================

/**
 * Producción base por hora (nivel 1)
 */
const BASE_PRODUCTION: Record<string, number> = {
    [BuildingType.IRON_MINE]: 40,
    [BuildingType.GOLD_MINE]: 25,
    [BuildingType.LUMBER_MILL]: 50,
    [BuildingType.TOWN_HALL]: 20, // Produce Doblones
};

/**
 * Población base por nivel de granja
 */
const FARM_POPULATION: Record<number, number> = {
    0: 100,
    1: 130,
    2: 170,
    3: 220,
    4: 280,
    5: 350,
    10: 800,
    15: 1800,
    20: 4000,
    25: 9000,
    30: 20000,
};

/**
 * Obtiene la producción por hora de un edificio
 */
export function getProductionPerHour(buildingType: BuildingType, level: number): number {
    if (level === 0) return 0;

    const baseProduction = BASE_PRODUCTION[buildingType];
    if (!baseProduction) return 0;

    // Fórmula mejorada: base * (1.18 ^ (level - 1)) - Más satisfactorio
    return Math.floor(baseProduction * Math.pow(1.18, level - 1));
}

/**
 * Obtiene la población máxima por nivel de granja
 */
export function getFarmPopulation(level: number): number {
    if (FARM_POPULATION[level] !== undefined) {
        return FARM_POPULATION[level];
    }

    // Interpolación para niveles intermedios
    const levels = Object.keys(FARM_POPULATION)
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

    const lowerPop = FARM_POPULATION[lower];
    const upperPop = FARM_POPULATION[upper];
    const ratio = (level - lower) / (upper - lower);

    return Math.floor(lowerPop + (upperPop - lowerPop) * ratio);
}

// ============================================
// VERIFICACIONES
// ============================================

/**
 * Verifica si se puede construir/mejorar un edificio
 */
export function canBuild(
    buildingType: BuildingType,
    currentLevel: number,
    cityBuildings: BuildingState[]
): { canBuild: boolean; reason?: string } {
    const info = BUILDING_INFO[buildingType];

    // Verificar nivel máximo
    if (currentLevel >= info.maxLevel) {
        return { canBuild: false, reason: 'Nivel máximo alcanzado' };
    }

    // Verificar prerrequisitos
    if (info.requires) {
        const requiredBuilding = cityBuildings.find(b => b.type === info.requires!.building);
        if (!requiredBuilding || requiredBuilding.level < info.requires.level) {
            const reqInfo = BUILDING_INFO[info.requires.building];
            return {
                canBuild: false,
                reason: `Requiere ${reqInfo.name} nivel ${info.requires.level}`,
            };
        }
    }

    return { canBuild: true };
}

/**
 * Crea un estado inicial de edificios para una nueva ciudad
 */
export function createInitialBuildings(): BuildingState[] {
    return [
        { type: BuildingType.TOWN_HALL, level: 1 },
        { type: BuildingType.FARM, level: 1 },
        { type: BuildingType.WAREHOUSE, level: 1 },
        { type: BuildingType.LUMBER_MILL, level: 1 },
        { type: BuildingType.IRON_MINE, level: 0 },
        { type: BuildingType.GOLD_MINE, level: 0 },
        { type: BuildingType.BARRACKS, level: 0 },
        { type: BuildingType.ALLIANCE_CENTER, level: 0 },
    ];
}

/**
 * Obtiene el nivel de un edificio en la ciudad
 */
export function getBuildingLevel(buildings: BuildingState[], type: BuildingType): number {
    const building = buildings.find(b => b.type === type);
    return building?.level || 0;
}

/**
 * Actualiza el nivel de un edificio
 */
export function upgradeBuilding(buildings: BuildingState[], type: BuildingType): BuildingState[] {
    return buildings.map(b => {
        if (b.type === type) {
            return { ...b, level: b.level + 1 };
        }
        return b;
    });
}

// ============================================
// COLA DE CONSTRUCCIÓN
// ============================================

/**
 * Crea un item de cola de construcción
 */
export function createQueueItem(
    buildingType: BuildingType,
    currentLevel: number
): ConstructionQueueItem {
    const targetLevel = currentLevel + 1;
    const buildTime = getBuildTime(buildingType, targetLevel);
    const now = Date.now();

    return {
        id: `${buildingType}-${targetLevel}-${now}`,
        buildingType,
        targetLevel,
        startTime: now,
        endTime: now + buildTime * 1000,
    };
}

/**
 * Verifica si un item de cola está completado
 */
export function isQueueItemComplete(item: ConstructionQueueItem): boolean {
    return Date.now() >= item.endTime;
}

/**
 * Obtiene el tiempo restante en segundos
 */
export function getTimeRemaining(item: ConstructionQueueItem): number {
    const remaining = item.endTime - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
}
