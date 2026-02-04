/**
 * @lootsystem/classes
 * Sistema de 12 Clases para MMORPG
 */

// Tipos
export * from './types';

// Clases de Fuerza
export { WARRIOR, PALADIN, BERSERKER } from './strength';

// Clases de Destreza
export { RANGER, ROGUE, ASSASSIN } from './dexterity';

// Clases de Inteligencia
export { MAGE, WARLOCK, NECROMANCER } from './intelligence';

// Clases Híbridas
export { CLERIC, DRUID, MONK } from './hybrid';

import { CharacterClass } from './types';
import { WARRIOR, PALADIN, BERSERKER } from './strength';
import { RANGER, ROGUE, ASSASSIN } from './dexterity';
import { MAGE, WARLOCK, NECROMANCER } from './intelligence';
import { CLERIC, DRUID, MONK } from './hybrid';

// ============================================
// AGREGADOS
// ============================================

export const ALL_CLASSES: CharacterClass[] = [
    // Fuerza
    WARRIOR,
    PALADIN,
    BERSERKER,
    // Destreza
    RANGER,
    ROGUE,
    ASSASSIN,
    // Inteligencia
    MAGE,
    WARLOCK,
    NECROMANCER,
    // Híbridas
    CLERIC,
    DRUID,
    MONK,
];

export const CLASSES_BY_ID: Record<string, CharacterClass> = {
    warrior: WARRIOR,
    paladin: PALADIN,
    berserker: BERSERKER,
    ranger: RANGER,
    rogue: ROGUE,
    assassin: ASSASSIN,
    mage: MAGE,
    warlock: WARLOCK,
    necromancer: NECROMANCER,
    cleric: CLERIC,
    druid: DRUID,
    monk: MONK,
};

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

export function getClassById(id: string): CharacterClass | undefined {
    return CLASSES_BY_ID[id];
}

export function getClassesByRole(role: string): CharacterClass[] {
    return ALL_CLASSES.filter(c => c.roles.includes(role as any));
}

export function getClassesByPrimaryStat(stat: string): CharacterClass[] {
    return ALL_CLASSES.filter(c => c.primaryStat === stat);
}

export function getTankClasses(): CharacterClass[] {
    return getClassesByRole('tank');
}

export function getHealerClasses(): CharacterClass[] {
    return getClassesByRole('healer');
}

export function getDpsClasses(): CharacterClass[] {
    return ALL_CLASSES.filter(c =>
        c.roles.some(r => r.includes('dps'))
    );
}

// Nombres en español para UI
export const CLASS_DISPLAY_NAMES: Record<string, string> = {
    warrior: 'Guerrero',
    paladin: 'Paladín',
    berserker: 'Berserker',
    ranger: 'Cazador',
    rogue: 'Pícaro',
    assassin: 'Asesino',
    mage: 'Mago',
    warlock: 'Brujo',
    necromancer: 'Nigromante',
    cleric: 'Clérigo',
    druid: 'Druida',
    monk: 'Monje',
};

export function getClassDisplayName(id: string): string {
    return CLASS_DISPLAY_NAMES[id] ?? id;
}
