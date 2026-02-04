// Tipos (español con aliases en inglés)
export * from './types';

// Sistema de Rareza
export {
    CONFIG_RAREZA_DEFAULT,
    DEFAULT_RARITY_CONFIG,
    calcularChanceEfectiva,
    calculateEffectiveChance,
    rollRareza,
    rollRarity,
    obtenerColorRareza,
    getRarityColor,
    obtenerNombreRareza,
    getRarityName,
    compararRareza,
    compareRarity,
} from './rarity';

// Sistema de Afijos
export {
    PREFIJOS_DEFAULT,
    SUFIJOS_DEFAULT,
    DEFAULT_PREFIXES,
    DEFAULT_SUFFIXES,
    obtenerTodosLosAfijos,
    getAllDefaultAffixes,
    obtenerAfijosValidos,
    getValidAffixes,
    seleccionarAfijos,
    selectAffixes,
    rollModificadoresAfijo,
    rollAffixModifiers,
} from './affix';

// Sistema de Items
export {
    ITEMS_DEFAULT,
    DEFAULT_ITEMS,
    obtenerItemPorId,
    getItemById,
    obtenerItemsPorTipo,
    getItemsByType,
    obtenerItemsPorNivel,
    getItemsByTier,
    obtenerItemsValidosParaNivel,
    getValidItemsForLevel,
} from './item';

// Items Legendarios
export {
    LEGENDARIOS_DEFAULT,
    DEFAULT_LEGENDARIES,
    obtenerLegendarioPorId,
    obtenerLegendariosParaNivel,
    obtenerLegendarioPorTipoItem,
    seleccionarLegendarioAleatorio,
} from './legendario';

// Items de Conjunto
export {
    CONJUNTOS_DEFAULT,
    ITEMS_CONJUNTO_DEFAULT,
    DEFAULT_SETS,
    DEFAULT_SET_ITEMS,
    obtenerConjuntoPorId,
    obtenerItemConjuntoPorId,
    obtenerItemsDeConjunto,
    obtenerItemsConjuntoParaNivel,
    seleccionarItemConjuntoAleatorio,
    calcularBonusConjunto,
} from './conjunto';

// Sistema de Treasure Class
export {
    TREASURE_CLASSES_DEFAULT,
    DEFAULT_TREASURE_CLASSES,
    obtenerTCPorId,
    getTreasureClassById,
    obtenerTCsPorNivel,
    getTreasureClassesByLevel,
    calcularPesoTotal,
    calculateTotalWeight,
    rollEnTreasureClass,
    rollOnTreasureClass,
} from './treasure-class';

// Generador de Loot
export {
    GeneradorLoot,
    LootGenerator,
    generarLoot,
    generateLoot,
} from './loot-generator';
