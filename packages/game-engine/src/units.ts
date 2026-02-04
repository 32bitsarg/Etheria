import { ResourceCost, ResourceType } from '@lootsystem/resources';
import { BuildingType } from '@lootsystem/buildings';

// ============================================
// UNIDADES
// ============================================

export enum UnitType {
    INFANTRY = 'infantry',
    ARCHER = 'archer',
    SPEARMAN = 'spearman',
    CAVALRY = 'cavalry',
}

export interface TrainingQueueItem {
    id: string;
    unitType: UnitType;
    count: number;
    startTime: number;
    endTime: number;
}

export interface UnitStats {
    attack: number;
    defense: number;
    health: number;
    armorPenetration: number;
    speed: number;
    capacity: number; // Loot capacity
}

export interface UnitInfo {
    name: string;
    description: string;
    stats: UnitStats;
    cost: ResourceCost;
    trainingTime: number; // Seconds
    requirements: {
        building: BuildingType;
        level: number;
    }[];
}

export const UNIT_STATS: Record<UnitType, UnitInfo> = {
    [UnitType.INFANTRY]: {
        name: 'Infantería',
        description: 'Unidad básica de combate cuerpo a cuerpo. Barata y equilibrada.',
        stats: {
            attack: 10,
            defense: 10,
            health: 50,
            armorPenetration: 5,
            speed: 5,
            capacity: 20
        },
        cost: {
            wood: 50,
            iron: 30,
            gold: 10,
            population: 1
        },
        trainingTime: 30,
        requirements: [
            { building: BuildingType.BARRACKS, level: 1 }
        ]
    },
    [UnitType.SPEARMAN]: {
        name: 'Lancero',
        description: 'Especialista en defensa. Efectivo contra caballería pero débil contra arqueros.',
        stats: {
            attack: 8,
            defense: 25,
            health: 60,
            armorPenetration: 15,
            speed: 4,
            capacity: 15
        },
        cost: {
            wood: 80,
            iron: 20,
            gold: 10,
            population: 1
        },
        trainingTime: 45,
        requirements: [
            { building: BuildingType.BARRACKS, level: 3 }
        ]
    },
    [UnitType.ARCHER]: {
        name: 'Arquero',
        description: 'Unidad de ataque a distancia. Alto daño pero muy débil en cuerpo a cuerpo.',
        stats: {
            attack: 25,
            defense: 5,
            health: 40,
            armorPenetration: 10,
            speed: 6,
            capacity: 10
        },
        cost: {
            wood: 100,
            iron: 10,
            gold: 25,
            population: 1
        },
        trainingTime: 60,
        requirements: [
            { building: BuildingType.BARRACKS, level: 5 }
        ]
    },
    [UnitType.CAVALRY]: {
        name: 'Caballería',
        description: 'Unidad rápida y poderosa. Grande para saqueos y ataques sorpresa.',
        stats: {
            attack: 30,
            defense: 15,
            health: 120,
            armorPenetration: 20,
            speed: 15,
            capacity: 80
        },
        cost: {
            wood: 200,
            iron: 200,
            gold: 150,
            population: 2
        },
        trainingTime: 180,
        requirements: [
            { building: BuildingType.BARRACKS, level: 10 }
        ]
    },
};

export function getUnitInfo(type: UnitType): UnitInfo {
    return UNIT_STATS[type];
}

export function getUnitCost(type: UnitType): ResourceCost {
    return UNIT_STATS[type].cost;
}

export function getUnitTrainingTime(type: UnitType): number {
    return UNIT_STATS[type].trainingTime;
}
