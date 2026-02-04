/**
 * @lootsystem/combat
 * Sistema de Combate por Turnos para MMORPG
 */

import { Skill, SkillEffect, EffectType, DamageType, TargetType } from '@lootsystem/classes';

// ============================================
// TIPOS DE COMBATE
// ============================================

export enum CombatPhase {
    SETUP = 'setup',
    PLAYER_TURN = 'player_turn',
    ENEMY_TURN = 'enemy_turn',
    PROCESSING = 'processing',
    VICTORY = 'victory',
    DEFEAT = 'defeat',
}

export enum ActionType {
    SKILL = 'skill',
    BASIC_ATTACK = 'basic_attack',
    DEFEND = 'defend',
    USE_ITEM = 'use_item',
    FLEE = 'flee',
}

export interface CombatStats {
    maxHealth: number;
    currentHealth: number;
    maxResource: number;
    currentResource: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    vitality: number;
    faith: number;
    wisdom: number;
    defense: number;
    speed: number;
    critChance: number;         // % (0-100)
    critDamage: number;         // % bonus (default 50 = 150% damage)
    damageReduction: number;    // % flat reduction
    elementalResistances: Record<DamageType, number>;
}

export interface ActiveEffect {
    id: string;
    name: string;
    displayName: string;
    sourceId: string;           // Who applied it
    targetId: string;           // Who has it
    type: EffectType;
    value: number;
    remainingTurns: number;
    damageType?: DamageType;
}

export interface Combatant {
    id: string;
    name: string;
    isPlayer: boolean;
    isAlive: boolean;
    stats: CombatStats;
    skills: Skill[];
    activeEffects: ActiveEffect[];
    cooldowns: Record<string, number>;  // skillId -> turns remaining
    level: number;
    classId?: string;
}

export interface CombatAction {
    type: ActionType;
    actorId: string;
    targetIds: string[];
    skillId?: string;
    itemId?: string;
}

export interface CombatLogEntry {
    turn: number;
    actorId: string;
    actorName: string;
    action: string;
    targets: string[];
    effects: string[];
    damage?: number;
    healing?: number;
    isCritical?: boolean;
    timestamp: number;
}

export interface CombatState {
    id: string;
    turn: number;
    phase: CombatPhase;
    currentActorId: string;
    combatants: Combatant[];
    turnOrder: string[];        // IDs ordenados por velocidad
    log: CombatLogEntry[];
    startTime: number;
    endTime?: number;
}

export interface CombatResult {
    victory: boolean;
    turns: number;
    experienceGained: number;
    lootDrops: string[];        // Item IDs
    goldDropped: number;
}

// ============================================
// FÓRMULAS DE COMBATE
// ============================================

export class CombatFormulas {
    /**
     * Calcula el daño físico
     * physicalDamage = (baseDamage + weaponDamage) * (1 + strength/100) * (1 + damagePercent/100)
     */
    static calculatePhysicalDamage(
        baseDamage: number,
        strength: number,
        damagePercent: number = 0
    ): number {
        const strMultiplier = 1 + strength / 100;
        const dmgMultiplier = 1 + damagePercent / 100;
        return Math.floor(baseDamage * strMultiplier * dmgMultiplier);
    }

    /**
     * Calcula el daño mágico
     * magicDamage = (baseDamage + spellPower) * (1 + intelligence/100) * (1 + elementalBonus/100)
     */
    static calculateMagicDamage(
        baseDamage: number,
        intelligence: number,
        elementalBonus: number = 0
    ): number {
        const intMultiplier = 1 + intelligence / 100;
        const elemMultiplier = 1 + elementalBonus / 100;
        return Math.floor(baseDamage * intMultiplier * elemMultiplier);
    }

    /**
     * Calcula la reducción de daño por defensa
     * damageReduction = defense / (defense + 100 + attackerLevel * 5)
     */
    static calculateDamageReduction(
        defense: number,
        attackerLevel: number
    ): number {
        const denominator = defense + 100 + attackerLevel * 5;
        return defense / denominator; // Returns 0-1
    }

    /**
     * Calcula daño final después de mitigación
     */
    static calculateFinalDamage(
        rawDamage: number,
        targetDefense: number,
        attackerLevel: number,
        flatReduction: number = 0,
        resistance: number = 0
    ): number {
        // Reducción por defensa
        const defenseReduction = this.calculateDamageReduction(targetDefense, attackerLevel);
        let damage = Math.floor(rawDamage * (1 - defenseReduction));

        // Reducción por resistencia elemental
        if (resistance > 0) {
            damage = Math.floor(damage * (1 - Math.min(resistance, 75) / 100));
        }

        // Reducción plana
        damage -= flatReduction;

        return Math.max(1, damage); // Mínimo 1 de daño
    }

    /**
     * Probabilidad de crítico
     * critChance = baseCrit + dexterity * 0.1 + bonusCrit
     */
    static calculateCritChance(
        baseCrit: number,
        dexterity: number,
        bonusCrit: number = 0
    ): number {
        return Math.min(100, baseCrit + dexterity * 0.1 + bonusCrit);
    }

    /**
     * Verifica si el ataque es crítico
     */
    static isCriticalHit(critChance: number): boolean {
        return Math.random() * 100 < critChance;
    }

    /**
     * Calcula daño crítico
     * critDamage = damage * (1.5 + critDamageBonus/100)
     */
    static calculateCriticalDamage(
        damage: number,
        critDamageBonus: number = 50
    ): number {
        return Math.floor(damage * (1.5 + critDamageBonus / 100));
    }

    /**
     * Calcula velocidad de turno (mayor = actúa primero)
     * turnSpeed = 100 + dexterity * 0.5 + speedBonus
     */
    static calculateTurnSpeed(
        dexterity: number,
        speedBonus: number = 0
    ): number {
        return 100 + dexterity * 0.5 + speedBonus;
    }

    /**
     * Calcula curación
     */
    static calculateHealing(
        baseHeal: number,
        healingPower: number,
        bonusPercent: number = 0
    ): number {
        const multiplier = 1 + (healingPower + bonusPercent) / 100;
        return Math.floor(baseHeal * multiplier);
    }

    /**
     * Genera roll de daño con variación
     */
    static rollDamage(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// ============================================
// MOTOR DE COMBATE
// ============================================

export class CombatEngine {
    private state: CombatState;

    constructor(players: Combatant[], enemies: Combatant[]) {
        const allCombatants = [...players, ...enemies];

        this.state = {
            id: this.generateId(),
            turn: 0,
            phase: CombatPhase.SETUP,
            currentActorId: '',
            combatants: allCombatants,
            turnOrder: this.calculateTurnOrder(allCombatants),
            log: [],
            startTime: Date.now(),
        };
    }

    private generateId(): string {
        return `combat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Calcula el orden de turnos basado en velocidad
     */
    private calculateTurnOrder(combatants: Combatant[]): string[] {
        return combatants
            .filter(c => c.isAlive)
            .sort((a, b) => {
                const speedA = CombatFormulas.calculateTurnSpeed(a.stats.dexterity, a.stats.speed);
                const speedB = CombatFormulas.calculateTurnSpeed(b.stats.dexterity, b.stats.speed);
                return speedB - speedA; // Mayor velocidad primero
            })
            .map(c => c.id);
    }

    /**
     * Inicia el combate
     */
    startCombat(): CombatState {
        this.state.turn = 1;
        this.state.currentActorId = this.state.turnOrder[0];

        const firstActor = this.getCombatant(this.state.currentActorId);
        this.state.phase = firstActor?.isPlayer
            ? CombatPhase.PLAYER_TURN
            : CombatPhase.ENEMY_TURN;

        this.addLogEntry({
            action: 'Combate iniciado',
            effects: ['¡El combate ha comenzado!'],
        });

        return this.getState();
    }

    /**
     * Ejecuta una acción de combate
     */
    executeAction(action: CombatAction): CombatState {
        const actor = this.getCombatant(action.actorId);
        if (!actor || !actor.isAlive) {
            return this.getState();
        }

        this.state.phase = CombatPhase.PROCESSING;

        switch (action.type) {
            case ActionType.SKILL:
                this.executeSkill(actor, action);
                break;
            case ActionType.BASIC_ATTACK:
                this.executeBasicAttack(actor, action);
                break;
            case ActionType.DEFEND:
                this.executeDefend(actor);
                break;
            case ActionType.FLEE:
                this.executeFlee(actor);
                break;
        }

        // Aplicar efectos de turno (DoTs, HoTs, etc.)
        this.processActiveEffects();

        // Verificar muertes
        this.checkDeaths();

        // Verificar fin de combate
        if (this.checkCombatEnd()) {
            return this.getState();
        }

        // Avanzar al siguiente turno
        this.advanceTurn();

        return this.getState();
    }

    /**
     * Ejecuta una habilidad
     */
    private executeSkill(actor: Combatant, action: CombatAction): void {
        const skill = actor.skills.find(s => s.id === action.skillId);
        if (!skill) return;

        // Verificar cooldown
        if (actor.cooldowns[skill.id] > 0) {
            this.addLogEntry({
                action: `${skill.displayName} en cooldown`,
                effects: [`Quedan ${actor.cooldowns[skill.id]} turnos`],
            });
            return;
        }

        // Verificar recurso
        if (skill.resourceCost > 0 && actor.stats.currentResource < skill.resourceCost) {
            this.addLogEntry({
                action: 'Recurso insuficiente',
                effects: [`No hay suficiente ${actor.isPlayer ? 'recurso' : 'energía'}`],
            });
            return;
        }

        // Consumir/generar recurso
        if (skill.resourceCost !== 0) {
            actor.stats.currentResource = Math.max(
                0,
                Math.min(
                    actor.stats.maxResource,
                    actor.stats.currentResource - skill.resourceCost
                )
            );
        }

        // Aplicar cooldown
        if (skill.cooldown > 0) {
            actor.cooldowns[skill.id] = skill.cooldown;
        }

        // Obtener objetivos
        const targets = this.getTargets(actor, skill, action.targetIds);

        // Aplicar efectos
        const logEffects: string[] = [];
        let totalDamage = 0;
        let totalHealing = 0;
        let wasCritical = false;

        for (const effect of skill.effects) {
            for (const target of targets) {
                const result = this.applyEffect(actor, target, effect, skill);
                if (result.damage > 0) totalDamage += result.damage;
                if (result.healing > 0) totalHealing += result.healing;
                if (result.isCritical) wasCritical = true;
                logEffects.push(result.message);
            }
        }

        this.addLogEntry({
            action: skill.displayName,
            targets: targets.map(t => t.name),
            effects: logEffects,
            damage: totalDamage,
            healing: totalHealing,
            isCritical: wasCritical,
        });
    }

    /**
     * Ejecuta ataque básico
     */
    private executeBasicAttack(actor: Combatant, action: CombatAction): void {
        const target = this.getCombatant(action.targetIds[0]);
        if (!target) return;

        // Calcular daño
        const baseDamage = CombatFormulas.rollDamage(
            Math.floor(actor.stats.strength * 0.8),
            Math.floor(actor.stats.strength * 1.2)
        );

        let damage = CombatFormulas.calculatePhysicalDamage(baseDamage, actor.stats.strength);

        // Crítico
        const isCritical = CombatFormulas.isCriticalHit(actor.stats.critChance);
        if (isCritical) {
            damage = CombatFormulas.calculateCriticalDamage(damage, actor.stats.critDamage);
        }

        // Mitigación
        damage = CombatFormulas.calculateFinalDamage(
            damage,
            target.stats.defense,
            actor.level,
            target.stats.damageReduction
        );

        // Aplicar daño
        target.stats.currentHealth = Math.max(0, target.stats.currentHealth - damage);

        this.addLogEntry({
            action: 'Ataque básico',
            targets: [target.name],
            effects: [
                isCritical ? `¡Crítico! ${damage} de daño` : `${damage} de daño`,
            ],
            damage,
            isCritical,
        });
    }

    /**
     * Ejecuta defensa
     */
    private executeDefend(actor: Combatant): void {
        // Añadir efecto de defensa
        actor.activeEffects.push({
            id: `defend_${Date.now()}`,
            name: 'defending',
            displayName: 'Defendiendo',
            sourceId: actor.id,
            targetId: actor.id,
            type: EffectType.BUFF,
            value: 50, // 50% reducción de daño
            remainingTurns: 1,
        });

        this.addLogEntry({
            action: 'Defensa',
            effects: ['Se prepara para recibir ataques (-50% daño)'],
        });
    }

    /**
     * Intenta huir del combate
     */
    private executeFlee(actor: Combatant): void {
        const fleeChance = 30 + actor.stats.dexterity * 0.5;
        const success = Math.random() * 100 < fleeChance;

        if (success) {
            this.state.phase = CombatPhase.DEFEAT;
            this.addLogEntry({
                action: 'Huida',
                effects: ['¡Huida exitosa!'],
            });
        } else {
            this.addLogEntry({
                action: 'Huida fallida',
                effects: ['¡No puedes escapar!'],
            });
        }
    }

    /**
     * Aplica un efecto de habilidad
     */
    private applyEffect(
        source: Combatant,
        target: Combatant,
        effect: SkillEffect,
        skill: Skill
    ): { message: string; damage: number; healing: number; isCritical: boolean } {
        let damage = 0;
        let healing = 0;
        let isCritical = false;
        let message = '';

        const scaledValue = Math.floor(
            effect.value + (this.getScalingStat(source, skill) * effect.scaling)
        );

        switch (effect.type) {
            case EffectType.DAMAGE:
                damage = effect.damageType && this.isMagicDamage(effect.damageType)
                    ? CombatFormulas.calculateMagicDamage(scaledValue, source.stats.intelligence)
                    : CombatFormulas.calculatePhysicalDamage(scaledValue, source.stats.strength);

                isCritical = CombatFormulas.isCriticalHit(source.stats.critChance);
                if (isCritical) {
                    damage = CombatFormulas.calculateCriticalDamage(damage, source.stats.critDamage);
                }

                const resistance = effect.damageType
                    ? target.stats.elementalResistances[effect.damageType] || 0
                    : 0;

                damage = CombatFormulas.calculateFinalDamage(
                    damage,
                    target.stats.defense,
                    source.level,
                    target.stats.damageReduction,
                    resistance
                );

                target.stats.currentHealth = Math.max(0, target.stats.currentHealth - damage);
                message = isCritical ? `¡Crítico! ${damage} daño a ${target.name}` : `${damage} daño a ${target.name}`;
                break;

            case EffectType.HEAL:
                healing = CombatFormulas.calculateHealing(scaledValue, source.stats.faith);
                target.stats.currentHealth = Math.min(
                    target.stats.maxHealth,
                    target.stats.currentHealth + healing
                );
                message = `${healing} vida restaurada a ${target.name}`;
                break;

            case EffectType.DOT:
            case EffectType.HOT:
            case EffectType.BUFF:
            case EffectType.DEBUFF:
            case EffectType.STUN:
            case EffectType.SLOW:
            case EffectType.ROOT:
            case EffectType.SHIELD:
                target.activeEffects.push({
                    id: `${effect.type}_${Date.now()}`,
                    name: skill.name,
                    displayName: skill.displayName,
                    sourceId: source.id,
                    targetId: target.id,
                    type: effect.type,
                    value: scaledValue,
                    remainingTurns: effect.duration || 1,
                    damageType: effect.damageType,
                });
                message = `${skill.displayName} aplicado a ${target.name}`;
                break;
        }

        return { message, damage, healing, isCritical };
    }

    /**
     * Procesa efectos activos al final del turno
     */
    private processActiveEffects(): void {
        for (const combatant of this.state.combatants) {
            const effectsToRemove: string[] = [];

            for (const effect of combatant.activeEffects) {
                switch (effect.type) {
                    case EffectType.DOT:
                        const dotDamage = effect.value;
                        combatant.stats.currentHealth = Math.max(0, combatant.stats.currentHealth - dotDamage);
                        this.addLogEntry({
                            action: effect.displayName,
                            targets: [combatant.name],
                            effects: [`${dotDamage} daño por ${effect.displayName}`],
                            damage: dotDamage,
                        });
                        break;

                    case EffectType.HOT:
                        const hotHeal = effect.value;
                        combatant.stats.currentHealth = Math.min(
                            combatant.stats.maxHealth,
                            combatant.stats.currentHealth + hotHeal
                        );
                        break;
                }

                effect.remainingTurns--;
                if (effect.remainingTurns <= 0) {
                    effectsToRemove.push(effect.id);
                }
            }

            combatant.activeEffects = combatant.activeEffects.filter(
                e => !effectsToRemove.includes(e.id)
            );
        }
    }

    /**
     * Reduce cooldowns al final del turno
     */
    private reduceCooldowns(actor: Combatant): void {
        for (const skillId in actor.cooldowns) {
            if (actor.cooldowns[skillId] > 0) {
                actor.cooldowns[skillId]--;
            }
        }
    }

    /**
     * Verifica muertes
     */
    private checkDeaths(): void {
        for (const combatant of this.state.combatants) {
            if (combatant.stats.currentHealth <= 0 && combatant.isAlive) {
                combatant.isAlive = false;
                this.addLogEntry({
                    action: 'Derrota',
                    targets: [combatant.name],
                    effects: [`${combatant.name} ha caído`],
                });
            }
        }
    }

    /**
     * Verifica si el combate terminó
     */
    private checkCombatEnd(): boolean {
        const alivePlayers = this.state.combatants.filter(c => c.isPlayer && c.isAlive);
        const aliveEnemies = this.state.combatants.filter(c => !c.isPlayer && c.isAlive);

        if (aliveEnemies.length === 0) {
            this.state.phase = CombatPhase.VICTORY;
            this.state.endTime = Date.now();
            this.addLogEntry({
                action: '¡Victoria!',
                effects: ['Todos los enemigos han sido derrotados'],
            });
            return true;
        }

        if (alivePlayers.length === 0) {
            this.state.phase = CombatPhase.DEFEAT;
            this.state.endTime = Date.now();
            this.addLogEntry({
                action: 'Derrota',
                effects: ['Tu grupo ha sido derrotado'],
            });
            return true;
        }

        return false;
    }

    /**
     * Avanza al siguiente turno
     */
    private advanceTurn(): void {
        const currentActor = this.getCombatant(this.state.currentActorId);
        if (currentActor) {
            this.reduceCooldowns(currentActor);
        }

        // Recalcular orden de turnos
        this.state.turnOrder = this.calculateTurnOrder(this.state.combatants);

        // Encontrar siguiente actor
        const currentIndex = this.state.turnOrder.indexOf(this.state.currentActorId);
        const nextIndex = (currentIndex + 1) % this.state.turnOrder.length;

        // Si completamos la ronda, incrementar turno
        if (nextIndex === 0) {
            this.state.turn++;
        }

        this.state.currentActorId = this.state.turnOrder[nextIndex];

        const nextActor = this.getCombatant(this.state.currentActorId);
        this.state.phase = nextActor?.isPlayer
            ? CombatPhase.PLAYER_TURN
            : CombatPhase.ENEMY_TURN;
    }

    // ============================================
    // UTILIDADES
    // ============================================

    private getCombatant(id: string): Combatant | undefined {
        return this.state.combatants.find(c => c.id === id);
    }

    private getTargets(actor: Combatant, skill: Skill, targetIds: string[]): Combatant[] {
        switch (skill.targetType) {
            case TargetType.SELF:
                return [actor];

            case TargetType.SINGLE_ENEMY:
            case TargetType.SINGLE_ALLY:
                return this.state.combatants.filter(c => targetIds.includes(c.id));

            case TargetType.ALL_ENEMIES:
                return this.state.combatants.filter(c => c.isPlayer !== actor.isPlayer && c.isAlive);

            case TargetType.ALL_ALLIES:
                return this.state.combatants.filter(c => c.isPlayer === actor.isPlayer && c.isAlive);

            case TargetType.AOE_ENEMIES:
                return this.state.combatants.filter(c => c.isPlayer !== actor.isPlayer && c.isAlive);

            case TargetType.AOE_ALLIES:
                return this.state.combatants.filter(c => c.isPlayer === actor.isPlayer && c.isAlive);

            default:
                return [];
        }
    }

    private getScalingStat(source: Combatant, skill: Skill): number {
        // Determinar qué stat usar para el scaling
        // Por ahora, basado en la clase de habilidad
        if (source.stats.intelligence > source.stats.strength) {
            return source.stats.intelligence;
        }
        return source.stats.strength;
    }

    private isMagicDamage(damageType: DamageType): boolean {
        return [
            DamageType.FIRE,
            DamageType.ICE,
            DamageType.LIGHTNING,
            DamageType.HOLY,
            DamageType.SHADOW,
            DamageType.NATURE,
        ].includes(damageType);
    }

    private addLogEntry(entry: Partial<CombatLogEntry>): void {
        const actor = this.getCombatant(this.state.currentActorId);
        this.state.log.push({
            turn: this.state.turn,
            actorId: entry.actorId || this.state.currentActorId,
            actorName: entry.actorName || actor?.name || 'Sistema',
            action: entry.action || '',
            targets: entry.targets || [],
            effects: entry.effects || [],
            damage: entry.damage,
            healing: entry.healing,
            isCritical: entry.isCritical,
            timestamp: Date.now(),
        });
    }

    // ============================================
    // GETTERS PÚBLICOS
    // ============================================

    getState(): CombatState {
        return { ...this.state };
    }

    getCurrentActor(): Combatant | undefined {
        return this.getCombatant(this.state.currentActorId);
    }

    getPlayers(): Combatant[] {
        return this.state.combatants.filter(c => c.isPlayer);
    }

    getEnemies(): Combatant[] {
        return this.state.combatants.filter(c => !c.isPlayer);
    }

    isPlayerTurn(): boolean {
        return this.state.phase === CombatPhase.PLAYER_TURN;
    }

    isCombatOver(): boolean {
        return this.state.phase === CombatPhase.VICTORY ||
            this.state.phase === CombatPhase.DEFEAT;
    }
}

// Re-export types from classes
export { EffectType, DamageType, TargetType } from '@lootsystem/classes';
