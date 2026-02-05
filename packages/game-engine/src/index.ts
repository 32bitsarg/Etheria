/**
 * @lootsystem/game-engine
 * Motor de juego principal para estrategia tipo Grepolis
 */

import {
    ResourceState,
    ResourceCost,
    ProductionRates,
    StorageLimits,
    createInitialResources,
    calculateProduction,
    applyProduction,
    canAfford,
    deductResources,
    createStorageLimits,
} from '@lootsystem/resources';

import {
    BuildingType,
    BuildingState,
    ConstructionQueueItem,
    BuildingInfo,
    BUILDING_INFO,
    createInitialBuildings,
    getBuildingLevel,
    upgradeBuilding,
    getUpgradeCost,
    getBuildTime,
    formatBuildTime,
    getProductionPerHour,
    getFarmPopulation,
    canBuild,
    createQueueItem,
    isQueueItemComplete,
} from '@lootsystem/buildings';

import {
    UnitType,
    TrainingQueueItem, // Added import
} from './units';

import {
    Raza,
    ConfigRaza,
    RAZAS,
    getProductionWithRacialBonus,
    getPopulationWithRacialBonus,
} from '@lootsystem/races';

// ============================================
// ESTADO DEL JUGADOR
// ============================================

/**
 * Ciudad del jugador
 */
export interface City {
    id: string;
    name: string;
    buildings: BuildingState[];
    constructionQueue: ConstructionQueueItem[];
    trainingQueue: TrainingQueueItem[];
    units?: { id: string; type: string; count: number }[];
    originMovements?: any[]; // For now using any, can be refined
    targetMovements?: any[];
}

/**
 * Alianza
 */
export interface Alliance {
    id: string;
    name: string;
    tag: string;
    description: string | null;
    createdAt: Date;
    members?: AllianceMember[];
}

export interface AllianceMember {
    id: string;
    allianceId: string;
    playerId: string;
    rank: string; // LEADER, OFFICER, MEMBER
    joinedAt: Date;
    alliance?: Alliance;
}

/**
 * Estado completo del jugador
 */
export interface PlayerState {
    id: string;
    username: string;
    race: Raza;
    city: City;
    resources: ResourceState;
    lastTick: number; // timestamp del último tick de producción
    createdAt: number;
    alliance?: AllianceMember | null;
}

// ============================================
// CREACIÓN
// ============================================

/**
 * Crea un estado de jugador nuevo
 */
export function createPlayerState(username: string, race: Raza, cityName: string): PlayerState {
    const now = Date.now();
    return {
        id: crypto.randomUUID(),
        username,
        race,
        city: {
            id: crypto.randomUUID(),
            name: cityName,
            buildings: createInitialBuildings(),
            constructionQueue: [],
            trainingQueue: [],
        },
        resources: createInitialResources(),
        lastTick: now,
        createdAt: now,
    };
}

// ============================================
// PRODUCCIÓN
// ============================================

/**
 * Calcula las tasas de producción actuales de la ciudad
 */
export function calculateProductionRates(state: PlayerState): ProductionRates {
    const raza = RAZAS[state.race];

    // Obtener niveles de edificios productores
    const lumberMillLevel = getBuildingLevel(state.city.buildings, BuildingType.LUMBER_MILL);
    const ironMineLevel = getBuildingLevel(state.city.buildings, BuildingType.IRON_MINE);
    const goldMineLevel = getBuildingLevel(state.city.buildings, BuildingType.GOLD_MINE);

    // Producción base por edificios
    const baseProduction = {
        wood: getProductionPerHour(BuildingType.LUMBER_MILL, lumberMillLevel),
        iron: getProductionPerHour(BuildingType.IRON_MINE, ironMineLevel),
        gold: getProductionPerHour(BuildingType.GOLD_MINE, goldMineLevel),
    };

    // Aplicar bonuses raciales
    const racialProduction = getProductionWithRacialBonus(baseProduction, raza);

    return {
        woodPerHour: racialProduction.wood,
        ironPerHour: racialProduction.iron,
        goldPerHour: racialProduction.gold,
    };
}

/**
 * Obtiene los límites de almacenamiento actuales
 */
export function getStorageLimits(state: PlayerState): StorageLimits {
    const warehouseLevel = getBuildingLevel(state.city.buildings, BuildingType.WAREHOUSE);
    return createStorageLimits(warehouseLevel);
}

/**
 * Obtiene la población máxima actual (con bonus racial)
 */
export function getMaxPopulation(state: PlayerState): number {
    const raza = RAZAS[state.race];
    const farmLevel = getBuildingLevel(state.city.buildings, BuildingType.FARM);
    const basePopulation = getFarmPopulation(farmLevel);
    return getPopulationWithRacialBonus(basePopulation, raza);
}

// ============================================
// TICK DE JUEGO
// ============================================

/**
 * Procesa un tick del juego, actualizando recursos
 */
export function processTick(state: PlayerState): PlayerState {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastTick) / 1000);

    if (elapsedSeconds <= 0) {
        return state;
    }

    // Calcular producción
    const rates = calculateProductionRates(state);
    const production = calculateProduction(rates, elapsedSeconds);
    const limits = getStorageLimits(state);

    // Actualizar población máxima
    const maxPopulation = getMaxPopulation(state);

    // Aplicar recursos producidos
    const newResources = applyProduction(state.resources, production, limits);
    newResources.populationMax = maxPopulation;

    // Procesar cola de construcción
    const { buildings, queue } = processConstructionQueue(
        state.city.buildings,
        state.city.constructionQueue
    );

    return {
        ...state,
        resources: newResources,
        city: {
            ...state.city,
            buildings,
            constructionQueue: queue,
        },
        lastTick: now,
    };
}

/**
 * Procesa la cola de construcción
 */
function processConstructionQueue(
    buildings: BuildingState[],
    queue: ConstructionQueueItem[]
): { buildings: BuildingState[]; queue: ConstructionQueueItem[] } {
    let updatedBuildings = [...buildings];
    const remainingQueue: ConstructionQueueItem[] = [];

    for (const item of queue) {
        if (isQueueItemComplete(item)) {
            // Completar construcción
            updatedBuildings = upgradeBuilding(updatedBuildings, item.buildingType);
        } else {
            remainingQueue.push(item);
        }
    }

    return { buildings: updatedBuildings, queue: remainingQueue };
}

// ============================================
// ACCIONES DEL JUGADOR
// ============================================

export interface ActionResult {
    success: boolean;
    error?: string;
    state?: PlayerState;
}

// ============================================
// CONSTANTES DE JUEGO
// ============================================

/** Máximo de construcciones simultáneas en cola */
export const MAX_CONSTRUCTION_QUEUE = 3;

/** Nivel máximo para permitir completar instantáneamente */
export const INSTANT_COMPLETE_MAX_LEVEL = 4;

/**
 * Intenta iniciar una mejora de edificio
 */
export function startBuildingUpgrade(
    state: PlayerState,
    buildingType: BuildingType
): ActionResult {
    // Verificar límite de cola
    if (state.city.constructionQueue.length >= MAX_CONSTRUCTION_QUEUE) {
        return { success: false, error: `Máximo ${MAX_CONSTRUCTION_QUEUE} construcciones en cola` };
    }

    // Verificar que no haya construcción en cola para este edificio
    const inQueue = state.city.constructionQueue.some(
        item => item.buildingType === buildingType
    );
    if (inQueue) {
        return { success: false, error: 'Ya hay una construcción en cola para este edificio' };
    }

    // Obtener nivel actual
    const currentLevel = getBuildingLevel(state.city.buildings, buildingType);

    // Verificar prerrequisitos
    const canBuildResult = canBuild(buildingType, currentLevel, state.city.buildings);
    if (!canBuildResult.canBuild) {
        return { success: false, error: canBuildResult.reason };
    }

    // Calcular costo
    const targetLevel = currentLevel + 1;
    const cost = getUpgradeCost(buildingType, targetLevel);

    // Verificar recursos
    if (!canAfford(state.resources, cost)) {
        return { success: false, error: 'Recursos insuficientes' };
    }

    // Verificar población disponible
    const availablePop = state.resources.populationMax - state.resources.populationUsed;
    if (cost.population && availablePop < cost.population) {
        return { success: false, error: 'Población insuficiente' };
    }

    // Deducir recursos
    const newResources = deductResources(state.resources, cost);

    // Crear item de cola
    const queueItem = createQueueItem(buildingType, currentLevel);

    return {
        success: true,
        state: {
            ...state,
            resources: newResources,
            city: {
                ...state.city,
                constructionQueue: [...state.city.constructionQueue, queueItem],
            },
        },
    };
}

/**
 * Completa una construcción instantáneamente (solo para niveles bajos)
 */
export function instantCompleteConstruction(
    state: PlayerState,
    queueItemId: string
): ActionResult {
    const itemIndex = state.city.constructionQueue.findIndex(
        item => item.id === queueItemId
    );

    if (itemIndex === -1) {
        return { success: false, error: 'Construcción no encontrada' };
    }

    const item = state.city.constructionQueue[itemIndex];

    // Verificar que el nivel objetivo permite completar instantáneo
    if (item.targetLevel > INSTANT_COMPLETE_MAX_LEVEL) {
        return { success: false, error: `Solo disponible hasta nivel ${INSTANT_COMPLETE_MAX_LEVEL}` };
    }

    // Completar construcción
    const updatedBuildings = upgradeBuilding(state.city.buildings, item.buildingType);
    const newQueue = state.city.constructionQueue.filter((_, i) => i !== itemIndex);

    return {
        success: true,
        state: {
            ...state,
            city: {
                ...state.city,
                buildings: updatedBuildings,
                constructionQueue: newQueue,
            },
        },
    };
}

/**
 * Cancela una construcción en cola (devuelve 50% recursos)
 */
export function cancelConstruction(
    state: PlayerState,
    queueItemId: string
): ActionResult {
    const itemIndex = state.city.constructionQueue.findIndex(
        item => item.id === queueItemId
    );

    if (itemIndex === -1) {
        return { success: false, error: 'Construcción no encontrada' };
    }

    const item = state.city.constructionQueue[itemIndex];
    const cost = getUpgradeCost(item.buildingType, item.targetLevel);

    // Devolver 50% de recursos (excepto población)
    const refund = {
        wood: Math.floor((cost.wood || 0) * 0.5),
        iron: Math.floor((cost.iron || 0) * 0.5),
        gold: Math.floor((cost.gold || 0) * 0.5),
    };

    const limits = getStorageLimits(state);
    const newResources = {
        ...state.resources,
        wood: Math.min(state.resources.wood + refund.wood, limits.maxWood),
        iron: Math.min(state.resources.iron + refund.iron, limits.maxIron),
        gold: Math.min(state.resources.gold + refund.gold, limits.maxGold),
        populationUsed: state.resources.populationUsed - (cost.population || 0),
    };

    // Remover de cola
    const newQueue = state.city.constructionQueue.filter((_, i) => i !== itemIndex);

    return {
        success: true,
        state: {
            ...state,
            resources: newResources,
            city: {
                ...state.city,
                constructionQueue: newQueue,
            },
        },
    };
}

// ============================================
// SERIALIZACIÓN
// ============================================

/**
 * Serializa el estado del jugador a JSON
 */
export function serializePlayerState(state: PlayerState): string {
    return JSON.stringify(state);
}

/**
 * Deserializa el estado del jugador
 */
export function deserializePlayerState(json: string): PlayerState {
    return JSON.parse(json) as PlayerState;
}

/**
 * Guarda en localStorage (para desarrollo)
 */
export function saveToLocalStorage(state: PlayerState): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`player_${state.id}`, serializePlayerState(state));
        window.localStorage.setItem('current_player', state.id);
    }
}

/**
 * Carga desde localStorage
 */
export function loadFromLocalStorage(): PlayerState | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    const currentId = window.localStorage.getItem('current_player');
    if (!currentId) return null;

    const data = window.localStorage.getItem(`player_${currentId}`);
    if (!data) return null;

    return deserializePlayerState(data);
}

// Re-exports para conveniencia
export type { BuildingState, ConstructionQueueItem, BuildingInfo } from '@lootsystem/buildings';
export { BuildingType, BUILDING_INFO, getUpgradeCost, getBuildTime, formatBuildTime, canBuild, createInitialBuildings, getProductionPerHour, upgradeBuilding, getBuildingLevel } from '@lootsystem/buildings';
export type { ResourceState, ResourceCost } from '@lootsystem/resources';
export { ResourceType } from '@lootsystem/resources';
export type { ConfigRaza } from '@lootsystem/races';
export { Raza, RAZAS } from '@lootsystem/races';

// Exports de Unidades
export * from './units';

// Exports de Combate
export * from './combat-engine';
