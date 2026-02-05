import { UnitType, UNIT_STATS } from './units';

export interface CombatUnit {
    type: string;
    count: number;
}

export interface BattleSide {
    units: CombatUnit[];
    totalAttack?: number;
    totalDefense?: number;
}

export interface BattleResult {
    won: boolean;
    attackerLosses: CombatUnit[];
    defenderLosses: CombatUnit[];
    attackerRemaining: CombatUnit[];
    defenderRemaining: CombatUnit[];
    lootedResources: {
        wood: number;
        iron: number;
        gold: number;
    };
}

/**
 * Motor de combate estratégico
 * Resuelve la batalla comparando Ataque Total vs Defensa Total
 */
export function resolveBattle(
    attackerUnits: CombatUnit[],
    defenderUnits: CombatUnit[],
    defenderResources: { wood: number; iron: number; gold: number }
): BattleResult {
    // 1. Calcular poder total de cada bando
    let totalAttack = 0;
    attackerUnits.forEach(u => {
        const stats = UNIT_STATS[u.type as UnitType];
        if (stats) totalAttack += stats.stats.attack * u.count;
    });

    let totalDefense = 0;
    defenderUnits.forEach(u => {
        const stats = UNIT_STATS[u.type as UnitType];
        if (stats) totalDefense += stats.stats.defense * u.count;
    });

    // 2. Determinar ganador
    // Si no hay defensa, el atacante gana automáticamente
    const won = totalDefense === 0 || totalAttack > totalDefense;

    // 3. Calcular bajas proporcionales
    // Sistema simplificado: 
    // Porcentaje de bajas = (Poder Oponente / Poder Propio) * Factor_Aleatorio
    // El bando que gana pierde menos, el que pierde pierde mas.

    const calculateLosses = (units: CombatUnit[], opponentPower: number, ownPower: number, isWinner: boolean) => {
        const baseLossRatio = ownPower > 0 ? (opponentPower / ownPower) : 1;
        // Factor de perdida: los ganadores pierden entre 10-40% de la fuerza del oponente
        // Los perdedores pierden entre 60-100% de su propia fuerza si la brecha es grande.
        const lossRatio = isWinner
            ? Math.min(0.5, baseLossRatio * 0.5)
            : Math.min(1.0, baseLossRatio > 1.5 ? 1.0 : 0.8);

        const losses: CombatUnit[] = [];
        const remaining: CombatUnit[] = [];

        units.forEach(u => {
            const lostCount = Math.floor(u.count * lossRatio);
            losses.push({ type: u.type, count: lostCount });
            remaining.push({ type: u.type, count: u.count - lostCount });
        });

        return { losses, remaining };
    };

    const attackerResult = calculateLosses(attackerUnits, totalDefense, totalAttack, won);
    const defenderResult = calculateLosses(defenderUnits, totalAttack, totalDefense, !won);

    // 4. Saqueo
    // Solo si el atacante gano y le quedan tropas
    let looted = { wood: 0, iron: 0, gold: 0 };
    if (won) {
        let totalCapacity = 0;
        attackerResult.remaining.forEach(u => {
            const stats = UNIT_STATS[u.type as UnitType];
            if (stats) totalCapacity += stats.stats.capacity * u.count;
        });

        // El atacante roba de forma equitativa hasta llenar capacidad o agotar recursos
        const totalAvailable = defenderResources.wood + defenderResources.iron + defenderResources.gold;
        if (totalAvailable > 0 && totalCapacity > 0) {
            const ratio = Math.min(1, totalCapacity / totalAvailable);
            looted.wood = Math.floor(defenderResources.wood * ratio);
            looted.iron = Math.floor(defenderResources.iron * ratio);
            looted.gold = Math.floor(defenderResources.gold * ratio);
        }
    }

    return {
        won,
        attackerLosses: attackerResult.losses,
        defenderLosses: defenderResult.losses,
        attackerRemaining: attackerResult.remaining,
        defenderRemaining: defenderResult.remaining,
        lootedResources: looted
    };
}
