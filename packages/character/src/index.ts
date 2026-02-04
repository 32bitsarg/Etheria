/**
 * @lootsystem/character
 * Sistema de Personajes para MMORPG
 */

import { ConfigRaza, Raza, RAZAS, obtenerRaza, calcularStatsConBonus } from '@lootsystem/races';
import {
    CharacterClass,
    Skill,
    PrimaryStat,
    ResourceType,
    WeaponType,
    ArmorType,
    CLASSES_BY_ID,
    getClassById,
    ALL_CLASSES,
    CLASS_DISPLAY_NAMES,
    getClassDisplayName,
} from '@lootsystem/classes';
import { ItemGenerado, TipoItem, TipoStat } from '@lootsystem/core';

// Type aliases para compatibilidad con código inglés
export type RaceId = Raza;
export const RACES = RAZAS;
export const getRaceById = obtenerRaza;
export const calculateStatsWithRaceBonus = calcularStatsConBonus;

// ============================================
// TIPOS DE PERSONAJE
// ============================================

export interface BaseStats {
    strength: number;
    dexterity: number;
    vitality: number;
    energy: number;
    intelligence: number;
    faith: number;
    wisdom: number;
}

export interface DerivedStats {
    maxHealth: number;
    currentHealth: number;
    maxResource: number;
    currentResource: number;

    // Ofensivos
    physicalDamage: number;
    magicDamage: number;
    attackSpeed: number;
    critChance: number;
    critDamage: number;

    // Defensivos
    defense: number;
    blockChance: number;
    dodgeChance: number;
    damageReduction: number;

    // Resistencias
    fireResist: number;
    iceResist: number;
    lightningResist: number;
    poisonResist: number;
    holyResist: number;
    shadowResist: number;

    // Utilidad
    movementSpeed: number;
    magicFind: number;
    goldFind: number;
    experienceBonus: number;
}

export interface EquipmentSlots {
    mainHand: ItemGenerado | null;
    offHand: ItemGenerado | null;
    head: ItemGenerado | null;
    chest: ItemGenerado | null;
    hands: ItemGenerado | null;
    legs: ItemGenerado | null;
    feet: ItemGenerado | null;
    ring1: ItemGenerado | null;
    ring2: ItemGenerado | null;
    amulet: ItemGenerado | null;
    belt: ItemGenerado | null;
}

export interface LearnedSkill {
    skill: Skill;
    level: number;
    isUnlocked: boolean;
}

export interface Character {
    id: string;
    name: string;

    // Identidad
    raceId: Raza;
    classId: string;

    // Nivel y experiencia
    level: number;
    experience: number;
    experienceToNextLevel: number;

    // Stats
    baseStats: BaseStats;
    derivedStats: DerivedStats;

    // Puntos disponibles
    statPoints: number;
    skillPoints: number;

    // Equipamiento e inventario
    equipment: EquipmentSlots;
    inventory: ItemGenerado[];
    maxInventorySlots: number;

    // Skills
    skills: LearnedSkill[];

    // Recursos
    gold: number;

    // Meta
    createdAt: number;
    playTime: number;
    monstersKilled: number;
    deathCount: number;
}

// ============================================
// CONSTANTES DE PROGRESIÓN
// ============================================

export const EXPERIENCE_TABLE: number[] = [
    0,        // Nivel 1
    100,      // Nivel 2
    250,      // Nivel 3
    500,      // Nivel 4
    900,      // Nivel 5
    1500,     // Nivel 6
    2400,     // Nivel 7
    3800,     // Nivel 8
    5800,     // Nivel 9
    8500,     // Nivel 10
    12000,    // Nivel 11
    16500,    // Nivel 12
    22000,    // Nivel 13
    29000,    // Nivel 14
    37500,    // Nivel 15
    48000,    // Nivel 16
    61000,    // Nivel 17
    77000,    // Nivel 18
    96000,    // Nivel 19
    120000,   // Nivel 20
];

// Generar hasta nivel 50
for (let i = EXPERIENCE_TABLE.length; i <= 50; i++) {
    EXPERIENCE_TABLE.push(Math.floor(EXPERIENCE_TABLE[i - 1] * 1.25));
}

export const STATS_PER_LEVEL = 5;
export const SKILL_POINTS_PER_LEVEL = 1;
export const MAX_LEVEL = 50;
export const BASE_INVENTORY_SLOTS = 20;

// ============================================
// FUNCIONES DE CREACIÓN
// ============================================

export function generateCharacterId(): string {
    return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createCharacter(
    name: string,
    raceId: Raza,
    classId: string
): Character {
    const race = obtenerRaza(raceId);
    const characterClass = getClassById(classId);

    if (!race || !characterClass) {
        throw new Error(`Invalid race (${raceId}) or class (${classId})`);
    }

    // Stats base de la clase
    const classStats: Record<string, number> = {
        strength: characterClass.baseStats.strength,
        dexterity: characterClass.baseStats.dexterity,
        vitality: characterClass.baseStats.vitality,
        energy: 10,
        intelligence: characterClass.baseStats.intelligence,
        faith: characterClass.baseStats.faith,
        wisdom: characterClass.baseStats.wisdom,
    };

    // Aplicar bonuses raciales
    const racialStats = calcularStatsConBonus(classStats, race);

    const baseStats: BaseStats = {
        strength: Math.floor(racialStats.strength || classStats.strength),
        dexterity: Math.floor(racialStats.dexterity || classStats.dexterity),
        vitality: Math.floor(racialStats.vitality || classStats.vitality),
        energy: Math.floor(racialStats.energy || classStats.energy),
        intelligence: classStats.intelligence,
        faith: classStats.faith,
        wisdom: classStats.wisdom,
    };

    const character: Character = {
        id: generateCharacterId(),
        name,
        raceId,
        classId,
        level: 1,
        experience: 0,
        experienceToNextLevel: EXPERIENCE_TABLE[1],
        baseStats,
        derivedStats: calculateDerivedStats(baseStats, characterClass, null),
        statPoints: 0,
        skillPoints: 1,
        equipment: {
            mainHand: null,
            offHand: null,
            head: null,
            chest: null,
            hands: null,
            legs: null,
            feet: null,
            ring1: null,
            ring2: null,
            amulet: null,
            belt: null,
        },
        inventory: [],
        maxInventorySlots: BASE_INVENTORY_SLOTS,
        skills: initializeSkills(characterClass),
        gold: 0,
        createdAt: Date.now(),
        playTime: 0,
        monstersKilled: 0,
        deathCount: 0,
    };

    // Establecer vida y recurso inicial al máximo
    character.derivedStats.currentHealth = character.derivedStats.maxHealth;
    character.derivedStats.currentResource = character.derivedStats.maxResource;

    return character;
}

function initializeSkills(characterClass: CharacterClass): LearnedSkill[] {
    return characterClass.skills.map(skill => ({
        skill,
        level: 1,
        isUnlocked: skill.levelRequired <= 1,
    }));
}

// ============================================
// CÁLCULO DE STATS
// ============================================

export function calculateDerivedStats(
    baseStats: BaseStats,
    characterClass: CharacterClass,
    equipment: EquipmentSlots | null
): DerivedStats {
    // Obtener stats de equipamiento
    const equipStats = equipment ? getEquipmentStats(equipment) : {};

    // Calcular vida base
    const baseHealth = baseStats.vitality * 10 + characterClass.baseStats.health;

    // Calcular recurso base según clase
    const baseResource = characterClass.baseStats.resource + baseStats.energy * 2;

    const derived: DerivedStats = {
        maxHealth: baseHealth + (equipStats.health || 0),
        currentHealth: baseHealth,
        maxResource: baseResource + (equipStats.resource || 0),
        currentResource: baseResource,

        // Ofensivos
        physicalDamage: Math.floor(baseStats.strength * 1.5) + (equipStats.physicalDamage || 0),
        magicDamage: Math.floor(baseStats.intelligence * 1.5) + (equipStats.magicDamage || 0),
        attackSpeed: 100 + baseStats.dexterity * 0.5 + (equipStats.attackSpeed || 0),
        critChance: 5 + baseStats.dexterity * 0.1 + (equipStats.critChance || 0),
        critDamage: 50 + (equipStats.critDamage || 0),

        // Defensivos
        defense: Math.floor(baseStats.vitality * 0.5) + (equipStats.defense || 0),
        blockChance: equipStats.blockChance || 0,
        dodgeChance: baseStats.dexterity * 0.05 + (equipStats.dodgeChance || 0),
        damageReduction: equipStats.damageReduction || 0,

        // Resistencias
        fireResist: equipStats.fireResist || 0,
        iceResist: equipStats.iceResist || 0,
        lightningResist: equipStats.lightningResist || 0,
        poisonResist: equipStats.poisonResist || 0,
        holyResist: equipStats.holyResist || 0,
        shadowResist: equipStats.shadowResist || 0,

        // Utilidad
        movementSpeed: 100 + (equipStats.movementSpeed || 0),
        magicFind: equipStats.magicFind || 0,
        goldFind: equipStats.goldFind || 0,
        experienceBonus: equipStats.experienceBonus || 0,
    };

    return derived;
}

function getEquipmentStats(equipment: EquipmentSlots): Record<string, number> {
    const stats: Record<string, number> = {};

    const slots = Object.values(equipment).filter(item => item !== null) as ItemGenerado[];

    for (const item of slots) {
        // Los items tienen itemBase con statsBase
        if (item.itemBase && 'statsBase' in item.itemBase) {
            const itemStats = (item.itemBase as any).statsBase;
            if (Array.isArray(itemStats)) {
                for (const stat of itemStats) {
                    const statKey = mapTipoStatToKey(stat.stat);
                    stats[statKey] = (stats[statKey] || 0) + (stat.valor || stat.min || 0);
                }
            }
        }

        // Agregar modificadores de afijos
        if (item.afijos) {
            for (const afijo of item.afijos) {
                for (const mod of afijo.modificadoresRolleados) {
                    const statKey = mapTipoStatToKey(mod.stat);
                    stats[statKey] = (stats[statKey] || 0) + mod.valor;
                }
            }
        }
    }

    return stats;
}

function mapTipoStatToKey(stat: TipoStat): string {
    const mapping: Record<string, string> = {
        [TipoStat.VIDA]: 'health',
        [TipoStat.MANA]: 'resource',
        [TipoStat.FUERZA]: 'strength',
        [TipoStat.DESTREZA]: 'dexterity',
        [TipoStat.VITALIDAD]: 'vitality',
        [TipoStat.ENERGIA]: 'energy',
        [TipoStat.DEFENSA]: 'defense',
        [TipoStat.DEFENSA_PORCENTAJE]: 'defensePercent',
        [TipoStat.DAÑO_PORCENTAJE]: 'damagePercent',
        [TipoStat.PROB_CRITICO]: 'critChance',
        [TipoStat.DAÑO_CRITICO]: 'critDamage',
        [TipoStat.VELOCIDAD_ATAQUE]: 'attackSpeed',
        [TipoStat.VELOCIDAD_MOVIMIENTO]: 'movementSpeed',
        [TipoStat.HALLAZGO_MAGICO]: 'magicFind',
        [TipoStat.HALLAZGO_ORO]: 'goldFind',
        [TipoStat.RESIST_FUEGO]: 'fireResist',
        [TipoStat.RESIST_FRIO]: 'iceResist',
        [TipoStat.RESIST_RAYO]: 'lightningResist',
        [TipoStat.RESIST_VENENO]: 'poisonResist',
        [TipoStat.ROBO_VIDA]: 'lifeSteal',
        [TipoStat.REGEN_VIDA]: 'healthRegen',
    };

    return mapping[stat] || stat;
}

// ============================================
// FUNCIONES DE PROGRESIÓN
// ============================================

export function addExperience(character: Character, amount: number): {
    leveledUp: boolean;
    levelsGained: number;
} {
    let levelsGained = 0;
    character.experience += Math.floor(amount * (1 + character.derivedStats.experienceBonus / 100));

    while (
        character.level < MAX_LEVEL &&
        character.experience >= character.experienceToNextLevel
    ) {
        character.experience -= character.experienceToNextLevel;
        character.level++;
        levelsGained++;

        // Otorgar puntos
        character.statPoints += STATS_PER_LEVEL;
        character.skillPoints += SKILL_POINTS_PER_LEVEL;

        // Actualizar experiencia necesaria
        character.experienceToNextLevel = EXPERIENCE_TABLE[character.level] ||
            Math.floor(EXPERIENCE_TABLE[EXPERIENCE_TABLE.length - 1] * 1.25);

        // Desbloquear skills
        for (const learned of character.skills) {
            if (!learned.isUnlocked && learned.skill.levelRequired <= character.level) {
                learned.isUnlocked = true;
            }
        }

        // Recalcular stats
        const characterClass = getClassById(character.classId);
        if (characterClass) {
            character.derivedStats = calculateDerivedStats(
                character.baseStats,
                characterClass,
                character.equipment
            );
        }
    }

    return { leveledUp: levelsGained > 0, levelsGained };
}

export function allocateStat(
    character: Character,
    stat: keyof BaseStats,
    points: number = 1
): boolean {
    if (character.statPoints < points) return false;

    character.baseStats[stat] += points;
    character.statPoints -= points;

    // Recalcular derivados
    const characterClass = getClassById(character.classId);
    if (characterClass) {
        character.derivedStats = calculateDerivedStats(
            character.baseStats,
            characterClass,
            character.equipment
        );
    }

    return true;
}

export function upgradeSkill(character: Character, skillId: string): boolean {
    if (character.skillPoints < 1) return false;

    const learned = character.skills.find(s => s.skill.id === skillId);
    if (!learned || !learned.isUnlocked) return false;

    learned.level++;
    character.skillPoints--;

    return true;
}

// ============================================
// FUNCIONES DE EQUIPAMIENTO
// ============================================

export function canEquipItem(character: Character, item: ItemGenerado): boolean {
    const characterClass = getClassById(character.classId);
    if (!characterClass) return false;

    // Verificar nivel
    if (item.itemBase.nivelRequerido > character.level) {
        return false;
    }

    // Verificar tipo de arma
    if (isWeapon(item.itemBase.tipo)) {
        const weaponType = mapTipoItemToWeaponType(item.itemBase.tipo);
        if (weaponType && !characterClass.allowedWeapons.includes(weaponType)) {
            return false;
        }
    }

    // Verificar tipo de armadura
    if (isArmor(item.itemBase.tipo)) {
        const armorType = getArmorType(item);
        if (armorType && !characterClass.allowedArmor.includes(armorType)) {
            return false;
        }
    }

    return true;
}

export function equipItem(
    character: Character,
    item: ItemGenerado,
    slot: keyof EquipmentSlots
): ItemGenerado | null {
    if (!canEquipItem(character, item)) {
        return null;
    }

    // Remover item actual del slot
    const previousItem = character.equipment[slot];

    // Equipar nuevo item
    character.equipment[slot] = item;

    // Remover del inventario
    const inventoryIndex = character.inventory.findIndex(i => i.nombre === item.nombre);
    if (inventoryIndex !== -1) {
        character.inventory.splice(inventoryIndex, 1);
    }

    // Recalcular stats
    const characterClass = getClassById(character.classId);
    if (characterClass) {
        character.derivedStats = calculateDerivedStats(
            character.baseStats,
            characterClass,
            character.equipment
        );
    }

    return previousItem;
}

export function unequipItem(
    character: Character,
    slot: keyof EquipmentSlots
): boolean {
    const item = character.equipment[slot];
    if (!item) return false;

    if (character.inventory.length >= character.maxInventorySlots) {
        return false; // Inventario lleno
    }

    character.equipment[slot] = null;
    character.inventory.push(item);

    // Recalcular stats
    const characterClass = getClassById(character.classId);
    if (characterClass) {
        character.derivedStats = calculateDerivedStats(
            character.baseStats,
            characterClass,
            character.equipment
        );
    }

    return true;
}

// ============================================
// UTILIDADES
// ============================================

function isWeapon(tipo: TipoItem): boolean {
    return [
        TipoItem.ESPADA,
        TipoItem.HACHA,
        TipoItem.MAZA,
        TipoItem.DAGA,
        TipoItem.ARCO,
        TipoItem.BASTON,
    ].includes(tipo);
}

function isArmor(tipo: TipoItem): boolean {
    return [
        TipoItem.YELMO,
        TipoItem.PECHERA,
        TipoItem.GUANTES,
        TipoItem.BOTAS,
    ].includes(tipo);
}

function mapTipoItemToWeaponType(tipo: TipoItem): WeaponType | null {
    const mapping: Record<string, WeaponType> = {
        [TipoItem.ESPADA]: WeaponType.SWORD,
        [TipoItem.HACHA]: WeaponType.AXE,
        [TipoItem.MAZA]: WeaponType.MACE,
        [TipoItem.DAGA]: WeaponType.DAGGER,
        [TipoItem.ARCO]: WeaponType.BOW,
        [TipoItem.BASTON]: WeaponType.STAFF,
        [TipoItem.ESCUDO]: WeaponType.SHIELD,
    };
    return mapping[tipo] || null;
}

function getArmorType(item: ItemGenerado): ArmorType | null {
    // Por ahora, basado en el nivel del item
    const level = item.itemBase.nivelCalidad;
    if (level < 10) return ArmorType.CLOTH;
    if (level < 25) return ArmorType.LEATHER;
    if (level < 40) return ArmorType.MAIL;
    return ArmorType.PLATE;
}

// ============================================
// SERIALIZACIÓN
// ============================================

export function serializeCharacter(character: Character): string {
    return JSON.stringify(character);
}

export function deserializeCharacter(json: string): Character {
    return JSON.parse(json) as Character;
}

// ============================================
// RE-EXPORTS
// ============================================

export { Raza, ConfigRaza, RAZAS, obtenerRaza } from '@lootsystem/races';
export {
    CharacterClass,
    ALL_CLASSES,
    getClassById,
    CLASS_DISPLAY_NAMES,
    getClassDisplayName
} from '@lootsystem/classes';
