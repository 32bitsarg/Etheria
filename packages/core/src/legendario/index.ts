import { ItemLegendario, TipoItem, NivelItem, TipoStat, Rareza } from '../types';

/**
 * Items Legendarios predefinidos
 */
export const LEGENDARIOS_DEFAULT: ItemLegendario[] = [
    // === YELMOS LEGENDARIOS ===
    {
        id: 'corona_rey',
        nombre: 'Corona',
        nombreLegendario: 'Corona del Rey Olvidado',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 40, max: 50 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 80, max: 100 },
            { stat: TipoStat.RESIST_TODO, min: 15, max: 25 },
            { stat: TipoStat.HALLAZGO_MAGICO, min: 30, max: 50 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 25,
        descripcion: '"Una corona que perteneció a un rey cuyo nombre fue borrado de la historia."',
    },
    {
        id: 'casco_guardian',
        nombre: 'Yelmo',
        nombreLegendario: 'Protector del Guardián',
        tipo: TipoItem.YELMO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 15,
        nivelCalidad: 15,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 20, max: 25 }],
        modificadoresFijos: [
            { stat: TipoStat.VIDA, min: 40, max: 60 },
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 20, max: 30 },
            { stat: TipoStat.REDUCCION_DAÑO, min: 3, max: 5 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 15,
        descripcion: '"Forjado para los protectores del antiguo reino."',
    },

    // === ESPADAS LEGENDARIAS ===
    {
        id: 'filo_sombra',
        nombre: 'Espadón',
        nombreLegendario: 'Filo de la Sombra',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 30,
        nivelCalidad: 30,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 15, max: 15 },
            { stat: TipoStat.DAÑO_MAX, min: 40, max: 40 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 200, max: 280 },
            { stat: TipoStat.VELOCIDAD_ATAQUE, min: 20, max: 30 },
            { stat: TipoStat.ROBO_VIDA, min: 5, max: 8 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 30,
        descripcion: '"Una espada que parece beber la luz a su alrededor."',
    },
    {
        id: 'destino_caido',
        nombre: 'Espada Larga',
        nombreLegendario: 'Destino del Caído',
        tipo: TipoItem.ESPADA,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [
            { stat: TipoStat.DAÑO_MIN, min: 8, max: 8 },
            { stat: TipoStat.DAÑO_MAX, min: 20, max: 20 },
        ],
        modificadoresFijos: [
            { stat: TipoStat.DAÑO_PORCENTAJE, min: 150, max: 200 },
            { stat: TipoStat.PROB_CRITICO, min: 10, max: 15 },
            { stat: TipoStat.DAÑO_FRIO, min: 20, max: 40 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 20,
        descripcion: '"Encontrada junto a un héroe caído. Su frío es antinatural."',
    },

    // === ARMADURAS LEGENDARIAS ===
    {
        id: 'piel_dragon',
        nombre: 'Armadura de Placas',
        nombreLegendario: 'Piel del Dragón Ancestral',
        tipo: TipoItem.PECHERA,
        nivel: NivelItem.EXCEPCIONAL,
        nivelRequerido: 35,
        nivelCalidad: 35,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 80, max: 100 }],
        modificadoresFijos: [
            { stat: TipoStat.DEFENSA_PORCENTAJE, min: 100, max: 150 },
            { stat: TipoStat.RESIST_FUEGO, min: 40, max: 50 },
            { stat: TipoStat.VIDA, min: 60, max: 100 },
            { stat: TipoStat.FUERZA, min: 15, max: 25 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 35,
        descripcion: '"Forjada con las escamas de un dragón antiguo."',
    },

    // === ANILLOS LEGENDARIOS ===
    {
        id: 'anillo_poder',
        nombre: 'Anillo',
        nombreLegendario: 'Anillo del Poder Absoluto',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 25,
        nivelCalidad: 25,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.TODOS_ATRIBUTOS, min: 10, max: 15 },
            { stat: TipoStat.VIDA, min: 30, max: 50 },
            { stat: TipoStat.MANA, min: 30, max: 50 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 25,
        descripcion: '"Un anillo que amplifica todo lo que toca."',
    },
    {
        id: 'circulo_suerte',
        nombre: 'Anillo',
        nombreLegendario: 'Círculo de la Buena Fortuna',
        tipo: TipoItem.ANILLO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.HALLAZGO_MAGICO, min: 30, max: 50 },
            { stat: TipoStat.HALLAZGO_ORO, min: 50, max: 80 },
            { stat: TipoStat.BONUS_EXPERIENCIA, min: 10, max: 15 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 20,
        descripcion: '"Los dioses sonríen a quien lo porta."',
    },

    // === AMULETOS LEGENDARIOS ===
    {
        id: 'amuleto_mago',
        nombre: 'Amuleto',
        nombreLegendario: 'Colgante del Archimago',
        tipo: TipoItem.AMULETO,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 30,
        nivelCalidad: 30,
        statsBase: [],
        modificadoresFijos: [
            { stat: TipoStat.MANA, min: 80, max: 120 },
            { stat: TipoStat.REGEN_MANA, min: 10, max: 15 },
            { stat: TipoStat.RESIST_TODO, min: 10, max: 20 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 30,
        descripcion: '"Pulsante con energía arcana inagotable."',
    },

    // === BOTAS LEGENDARIAS ===
    {
        id: 'botas_viento',
        nombre: 'Botas Pesadas',
        nombreLegendario: 'Pisadas del Viento',
        tipo: TipoItem.BOTAS,
        nivel: NivelItem.NORMAL,
        nivelRequerido: 20,
        nivelCalidad: 20,
        statsBase: [{ stat: TipoStat.DEFENSA, min: 12, max: 18 }],
        modificadoresFijos: [
            { stat: TipoStat.VELOCIDAD_MOVIMIENTO, min: 30, max: 40 },
            { stat: TipoStat.DESTREZA, min: 10, max: 20 },
            { stat: TipoStat.RESIST_RAYO, min: 20, max: 30 },
        ],
        rareza: Rareza.LEGENDARIO,
        nivelDrop: 20,
        descripcion: '"Quien las calza corre como el viento mismo."',
    },
];

// Aliases
export const DEFAULT_LEGENDARIES = LEGENDARIOS_DEFAULT;

export function obtenerLegendarioPorId(id: string): ItemLegendario | undefined {
    return LEGENDARIOS_DEFAULT.find((item) => item.id === id);
}

export function obtenerLegendariosParaNivel(nivel: number): ItemLegendario[] {
    return LEGENDARIOS_DEFAULT.filter((item) => item.nivelDrop <= nivel);
}

export function obtenerLegendarioPorTipoItem(tipo: TipoItem): ItemLegendario[] {
    return LEGENDARIOS_DEFAULT.filter((item) => item.tipo === tipo);
}

/**
 * Seleccionar un legendario aleatorio válido para el nivel
 */
export function seleccionarLegendarioAleatorio(
    nivelMonstruo: number,
    tipoItemPermitido?: TipoItem
): ItemLegendario | null {
    let candidatos = obtenerLegendariosParaNivel(nivelMonstruo);

    if (tipoItemPermitido) {
        candidatos = candidatos.filter((l) => l.tipo === tipoItemPermitido);
    }

    if (candidatos.length === 0) return null;

    const indice = Math.floor(Math.random() * candidatos.length);
    return candidatos[indice];
}
