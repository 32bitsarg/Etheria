/**
 * Sistema de Loot - Tipos Core
 * Inspirado en Diablo 2
 */

// ============================================
// SISTEMA DE RAREZA
// ============================================

export enum Rareza {
    NORMAL = 'normal',
    MAGICO = 'magico',
    RARO = 'raro',
    LEGENDARIO = 'legendario',
    CONJUNTO = 'conjunto',
}

// Alias for backwards compatibility
export const Rarity = Rareza;
export type Rarity = Rareza;

export interface ConfigRareza {
    id: Rareza;
    nombre: string;
    color: string;
    chanceBase: number; // Chance base de 1000
    minAfijos: number;
    maxAfijos: number;
}

// ============================================
// SISTEMA DE AFIJOS
// ============================================

export enum TipoAfijo {
    PREFIJO = 'prefijo',
    SUFIJO = 'sufijo',
}

// Alias
export const AffixType = TipoAfijo;
export type AffixType = TipoAfijo;

export enum TipoStat {
    // Ofensivos
    DAÑO_MIN = 'daño_min',
    DAÑO_MAX = 'daño_max',
    DAÑO_PORCENTAJE = 'daño_porcentaje',
    VELOCIDAD_ATAQUE = 'velocidad_ataque',
    PROB_CRITICO = 'prob_critico',
    DAÑO_CRITICO = 'daño_critico',

    // Defensivos
    DEFENSA = 'defensa',
    DEFENSA_PORCENTAJE = 'defensa_porcentaje',
    PROB_BLOQUEO = 'prob_bloqueo',
    REDUCCION_DAÑO = 'reduccion_daño',

    // Atributos
    FUERZA = 'fuerza',
    DESTREZA = 'destreza',
    VITALIDAD = 'vitalidad',
    ENERGIA = 'energia',
    TODOS_ATRIBUTOS = 'todos_atributos',

    // Vida y Maná
    VIDA = 'vida',
    VIDA_PORCENTAJE = 'vida_porcentaje',
    REGEN_VIDA = 'regen_vida',
    ROBO_VIDA = 'robo_vida',
    MANA = 'mana',
    MANA_PORCENTAJE = 'mana_porcentaje',
    REGEN_MANA = 'regen_mana',
    ROBO_MANA = 'robo_mana',

    // Resistencias
    RESIST_FUEGO = 'resist_fuego',
    RESIST_FRIO = 'resist_frio',
    RESIST_RAYO = 'resist_rayo',
    RESIST_VENENO = 'resist_veneno',
    RESIST_TODO = 'resist_todo',

    // Daño Elemental
    DAÑO_FUEGO = 'daño_fuego',
    DAÑO_FRIO = 'daño_frio',
    DAÑO_RAYO = 'daño_rayo',
    DAÑO_VENENO = 'daño_veneno',

    // Utilidad
    HALLAZGO_MAGICO = 'hallazgo_magico',
    HALLAZGO_ORO = 'hallazgo_oro',
    BONUS_EXPERIENCIA = 'bonus_experiencia',
    VELOCIDAD_MOVIMIENTO = 'velocidad_movimiento',
}

// Alias
export const StatType = TipoStat;
export type StatType = TipoStat;

export interface ModificadorStat {
    stat: TipoStat;
    min: number;
    max: number;
    esPorcentaje?: boolean;
}

export interface Afijo {
    id: string;
    nombre: string;
    tipo: TipoAfijo;
    nivelRequerido: number;
    frecuencia: number;
    modificadores: ModificadorStat[];
    tiposItemPermitidos?: TipoItem[];
    tiposItemExcluidos?: TipoItem[];
    grupo?: string;
    tier?: number; // 1 = bajo, 2 = medio, 3 = alto
}

export interface AfijoGenerado {
    afijo: Afijo;
    modificadoresRolleados: { stat: TipoStat; valor: number }[];
}

// Aliases
export type Affix = Afijo;
export type GeneratedAffix = AfijoGenerado;
export type StatModifier = ModificadorStat;

// ============================================
// SISTEMA DE ITEMS
// ============================================

export enum TipoItem {
    // Armas
    ESPADA = 'espada',
    HACHA = 'hacha',
    MAZA = 'maza',
    DAGA = 'daga',
    LANZA = 'lanza',
    ARCO = 'arco',
    BALLESTA = 'ballesta',
    BASTON = 'baston',
    VARITA = 'varita',

    // Armadura
    YELMO = 'yelmo',
    PECHERA = 'pechera',
    GUANTES = 'guantes',
    BOTAS = 'botas',
    CINTURON = 'cinturon',
    ESCUDO = 'escudo',

    // Joyería
    ANILLO = 'anillo',
    AMULETO = 'amuleto',

    // Otros
    POCION = 'pocion',
    ORO = 'oro',
    VARIOS = 'varios',
}

// Alias
export const ItemType = TipoItem;
export type ItemType = TipoItem;

export enum NivelItem {
    NORMAL = 'normal',
    EXCEPCIONAL = 'excepcional',
    ELITE = 'elite',
}

export const ItemTier = NivelItem;
export type ItemTier = NivelItem;

export interface ItemBase {
    id: string;
    nombre: string;
    tipo: TipoItem;
    nivel: NivelItem;
    nivelRequerido: number;
    nivelCalidad: number;
    statsBase: ModificadorStat[];
    esApilable?: boolean;
    maxApilado?: number;
}

// Alias
export type BaseItem = ItemBase;

export interface ItemLegendario extends ItemBase {
    nombreLegendario: string;
    modificadoresFijos: { stat: TipoStat; min: number; max: number }[];
    rareza: Rareza.LEGENDARIO;
    nivelDrop: number;
    descripcion?: string;
}

export type UniqueItem = ItemLegendario;

export interface ItemConjunto extends ItemBase {
    conjuntoId: string;
    nombreConjunto: string;
    modificadoresFijos: { stat: TipoStat; min: number; max: number }[];
    rareza: Rareza.CONJUNTO;
    nivelDrop: number;
}

export type SetItem = ItemConjunto;

export interface Conjunto {
    id: string;
    nombre: string;
    items: string[];
    bonuses: {
        piezasRequeridas: number;
        modificadores: { stat: TipoStat; valor: number }[];
    }[];
    bonusCompleto?: { stat: TipoStat; valor: number }[];
}

export type ItemSet = Conjunto;

export interface ItemGenerado {
    itemBase: ItemBase;
    rareza: Rareza;
    nivelItem: number;
    nombre: string;
    afijos: AfijoGenerado[];
    datosLegendario?: ItemLegendario;
    datosConjunto?: ItemConjunto;
    cantidad?: number;
}

export type GeneratedItem = ItemGenerado;

// ============================================
// SISTEMA DE TREASURE CLASS
// ============================================

export interface EntradaTC {
    itemId?: string;
    tcRef?: string;
    peso: number;
}

export type TreasureClassEntry = EntradaTC;

export interface TreasureClass {
    id: string;
    nombre: string;
    nivel?: number;
    picks: number;
    noDrop: number;
    entradas: EntradaTC[];
    modificadorLegendario?: number;
    modificadorConjunto?: number;
    modificadorRaro?: number;
}

// ============================================
// SISTEMA DE BALANCE
// ============================================

export interface ConfigPity {
    legendario: number; // Garantizado después de X drops sin legendario
    raro: number;
    conjunto: number;
}

export interface EstadoPity {
    dropsSinLegendario: number;
    dropsSinRaro: number;
    dropsSinConjunto: number;
}

export interface ConfigBadLuck {
    habilitado: boolean;
    dropsParaActivar: number; // Después de X drops normales, aumenta chances
    bonusPorcentaje: number; // % extra por cada drop normal consecutivo
    maxBonus: number; // Máximo bonus acumulable
}

export interface EstadoBadLuck {
    dropsNormalesConsecutivos: number;
    bonusActual: number;
}

// ============================================
// CONFIGURACIÓN DEL GENERADOR
// ============================================

export interface ConfigGenerador {
    hallazgoMagico?: number;
    nivelJugador?: number;
    tamañoGrupo?: number;
    dificultad?: 'normal' | 'pesadilla' | 'infierno';
    pity?: ConfigPity;
    badLuck?: ConfigBadLuck;
}

export type LootGeneratorConfig = ConfigGenerador;

export interface ContextoDrop {
    nivelMonstruo: number;
    esJefe?: boolean;
    esCampeon?: boolean;
    esUnico?: boolean;
    nivelArea?: number;
}

export type DropContext = ContextoDrop;

export interface ResultadoLoot {
    items: ItemGenerado[];
    cantidadOro?: number;
    estadoPity?: EstadoPity;
    estadoBadLuck?: EstadoBadLuck;
}

export type LootResult = ResultadoLoot;

// ============================================
// NOMBRES DE STATS EN ESPAÑOL
// ============================================

export const NOMBRES_STATS: Record<TipoStat, string> = {
    [TipoStat.DAÑO_MIN]: 'Daño Mínimo',
    [TipoStat.DAÑO_MAX]: 'Daño Máximo',
    [TipoStat.DAÑO_PORCENTAJE]: 'Daño Aumentado',
    [TipoStat.VELOCIDAD_ATAQUE]: 'Velocidad de Ataque',
    [TipoStat.PROB_CRITICO]: 'Probabilidad Crítica',
    [TipoStat.DAÑO_CRITICO]: 'Daño Crítico',
    [TipoStat.DEFENSA]: 'Defensa',
    [TipoStat.DEFENSA_PORCENTAJE]: 'Defensa Aumentada',
    [TipoStat.PROB_BLOQUEO]: 'Probabilidad de Bloqueo',
    [TipoStat.REDUCCION_DAÑO]: 'Reducción de Daño',
    [TipoStat.FUERZA]: 'Fuerza',
    [TipoStat.DESTREZA]: 'Destreza',
    [TipoStat.VITALIDAD]: 'Vitalidad',
    [TipoStat.ENERGIA]: 'Energía',
    [TipoStat.TODOS_ATRIBUTOS]: 'Todos los Atributos',
    [TipoStat.VIDA]: 'Vida',
    [TipoStat.VIDA_PORCENTAJE]: 'Vida',
    [TipoStat.REGEN_VIDA]: 'Regeneración de Vida',
    [TipoStat.ROBO_VIDA]: 'Robo de Vida',
    [TipoStat.MANA]: 'Maná',
    [TipoStat.MANA_PORCENTAJE]: 'Maná',
    [TipoStat.REGEN_MANA]: 'Regeneración de Maná',
    [TipoStat.ROBO_MANA]: 'Robo de Maná',
    [TipoStat.RESIST_FUEGO]: 'Resistencia al Fuego',
    [TipoStat.RESIST_FRIO]: 'Resistencia al Frío',
    [TipoStat.RESIST_RAYO]: 'Resistencia al Rayo',
    [TipoStat.RESIST_VENENO]: 'Resistencia al Veneno',
    [TipoStat.RESIST_TODO]: 'Todas las Resistencias',
    [TipoStat.DAÑO_FUEGO]: 'Daño de Fuego',
    [TipoStat.DAÑO_FRIO]: 'Daño de Frío',
    [TipoStat.DAÑO_RAYO]: 'Daño de Rayo',
    [TipoStat.DAÑO_VENENO]: 'Daño de Veneno',
    [TipoStat.HALLAZGO_MAGICO]: 'Hallazgo Mágico',
    [TipoStat.HALLAZGO_ORO]: 'Hallazgo de Oro',
    [TipoStat.BONUS_EXPERIENCIA]: 'Bonus de Experiencia',
    [TipoStat.VELOCIDAD_MOVIMIENTO]: 'Velocidad de Movimiento',
};
