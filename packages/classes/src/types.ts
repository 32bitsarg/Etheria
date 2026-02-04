/**
 * @lootsystem/classes
 * Sistema de Clases para MMORPG
 * 12 Clases con habilidades y pasivas
 */

// ============================================
// ENUMS Y TIPOS
// ============================================

export enum ClassRole {
    TANK = 'tank',
    DPS_MELEE = 'dps_melee',
    DPS_RANGED = 'dps_ranged',
    DPS_MAGIC = 'dps_magic',
    HEALER = 'healer',
    SUPPORT = 'support',
    HYBRID = 'hybrid',
}

export enum ResourceType {
    MANA = 'mana',
    FURY = 'fury',
    RAGE = 'rage',
    ENERGY = 'energy',
    COMBO_POINTS = 'combo_points',
    SOULS = 'souls',
    ESSENCE = 'essence',
    HOLY_MANA = 'holy_mana',
    NATURE = 'nature',
    KI = 'ki',
    FOCUS = 'focus',
}

export enum PrimaryStat {
    STRENGTH = 'strength',
    DEXTERITY = 'dexterity',
    INTELLIGENCE = 'intelligence',
    VITALITY = 'vitality',
    FAITH = 'faith',
    WISDOM = 'wisdom',
}

export enum WeaponType {
    SWORD = 'sword',
    AXE = 'axe',
    MACE = 'mace',
    DAGGER = 'dagger',
    BOW = 'bow',
    CROSSBOW = 'crossbow',
    STAFF = 'staff',
    WAND = 'wand',
    FIST = 'fist',
    POLEARM = 'polearm',
    SHIELD = 'shield',
}

export enum ArmorType {
    CLOTH = 'cloth',
    LEATHER = 'leather',
    MAIL = 'mail',
    PLATE = 'plate',
}

export enum SkillType {
    ACTIVE = 'active',
    PASSIVE = 'passive',
}

export enum TargetType {
    SELF = 'self',
    SINGLE_ENEMY = 'single_enemy',
    SINGLE_ALLY = 'single_ally',
    ALL_ENEMIES = 'all_enemies',
    ALL_ALLIES = 'all_allies',
    AOE_ENEMIES = 'aoe_enemies',
    AOE_ALLIES = 'aoe_allies',
}

export enum DamageType {
    PHYSICAL = 'physical',
    FIRE = 'fire',
    ICE = 'ice',
    LIGHTNING = 'lightning',
    POISON = 'poison',
    HOLY = 'holy',
    SHADOW = 'shadow',
    NATURE = 'nature',
}

export enum EffectType {
    DAMAGE = 'damage',
    HEAL = 'heal',
    BUFF = 'buff',
    DEBUFF = 'debuff',
    DOT = 'dot',           // Damage over time
    HOT = 'hot',           // Heal over time
    STUN = 'stun',
    SLOW = 'slow',
    SILENCE = 'silence',
    ROOT = 'root',
    SHIELD = 'shield',
    SUMMON = 'summon',
}

// ============================================
// INTERFACES
// ============================================

export interface SkillEffect {
    type: EffectType;
    value: number;              // Base value
    scaling: number;            // % de stat principal
    duration?: number;          // Turnos
    damageType?: DamageType;
}

export interface Skill {
    id: string;
    name: string;               // Inglés (código)
    displayName: string;        // Español (UI)
    description: string;        // Español
    type: SkillType;
    targetType: TargetType;
    resourceCost: number;
    cooldown: number;           // Turnos
    levelRequired: number;
    effects: SkillEffect[];
    icon?: string;
}

export interface Passive {
    id: string;
    name: string;
    displayName: string;
    description: string;
    effects: PassiveEffect[];
    levelRequired: number;
}

export interface PassiveEffect {
    stat: string;
    value: number;
    isPercentage: boolean;
}

export interface BaseStats {
    health: number;
    resource: number;
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
    faith: number;
    wisdom: number;
}

export interface CharacterClass {
    id: string;
    name: string;              // Inglés
    displayName: string;       // Español
    description: string;       // Español
    roles: ClassRole[];
    primaryStat: PrimaryStat;
    secondaryStat?: PrimaryStat;
    resourceType: ResourceType;
    resourceName: string;      // Español para UI
    baseStats: BaseStats;
    skills: Skill[];
    passives: Passive[];
    allowedWeapons: WeaponType[];
    allowedArmor: ArmorType[];
    icon?: string;
}
