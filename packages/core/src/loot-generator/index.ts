import {
    ItemBase,
    ItemGenerado,
    Rareza,
    ConfigGenerador,
    ContextoDrop,
    ResultadoLoot,
    TreasureClass,
    TipoAfijo,
    AfijoGenerado,
    ConfigPity,
    EstadoPity,
    ConfigBadLuck,
    EstadoBadLuck,
    ItemLegendario,
    ItemConjunto,
} from '../types';
import { rollRareza, CONFIG_RAREZA_DEFAULT } from '../rarity';
import {
    obtenerTodosLosAfijos,
    obtenerAfijosValidos,
    seleccionarAfijos,
    rollModificadoresAfijo,
} from '../affix';
import { ITEMS_DEFAULT } from '../item';
import {
    TREASURE_CLASSES_DEFAULT,
    rollEnTreasureClass,
} from '../treasure-class';
import { LEGENDARIOS_DEFAULT, seleccionarLegendarioAleatorio } from '../legendario';
import { ITEMS_CONJUNTO_DEFAULT, seleccionarItemConjuntoAleatorio } from '../conjunto';

/**
 * Configuración por defecto del Pity System
 */
const PITY_DEFAULT: ConfigPity = {
    legendario: 50, // Garantizado después de 50 drops sin legendario
    raro: 15,       // Garantizado después de 15 drops sin raro
    conjunto: 60,   // Garantizado después de 60 drops sin conjunto
};

/**
 * Configuración por defecto del Bad Luck Protection
 */
const BAD_LUCK_DEFAULT: ConfigBadLuck = {
    habilitado: true,
    dropsParaActivar: 5,  // Después de 5 drops normales consecutivos
    bonusPorcentaje: 10,  // +10% por cada drop normal extra
    maxBonus: 100,        // Máximo +100%
};

export interface OpcionesGenerador {
    items?: ItemBase[];
    treasureClasses?: TreasureClass[];
    legendarios?: ItemLegendario[];
    conjuntos?: ItemConjunto[];
}

export class GeneradorLoot {
    private config: ConfigGenerador;
    private items: Map<string, ItemBase>;
    private treasureClasses: Map<string, TreasureClass>;
    private legendarios: ItemLegendario[];
    private conjuntos: ItemConjunto[];

    // Estados de balance
    private estadoPity: EstadoPity;
    private estadoBadLuck: EstadoBadLuck;

    constructor(config: ConfigGenerador = {}, opciones: OpcionesGenerador = {}) {
        this.config = {
            hallazgoMagico: config.hallazgoMagico ?? 0,
            nivelJugador: config.nivelJugador ?? 1,
            tamañoGrupo: config.tamañoGrupo ?? 1,
            dificultad: config.dificultad ?? 'normal',
            pity: config.pity ?? PITY_DEFAULT,
            badLuck: config.badLuck ?? BAD_LUCK_DEFAULT,
        };

        // Inicializar items
        this.items = new Map();
        const listaItems = opciones.items ?? ITEMS_DEFAULT;
        for (const item of listaItems) {
            this.items.set(item.id, item);
        }

        // Inicializar treasure classes
        this.treasureClasses = new Map();
        const listaTCs = opciones.treasureClasses ?? TREASURE_CLASSES_DEFAULT;
        for (const tc of listaTCs) {
            this.treasureClasses.set(tc.id, tc);
        }

        // Inicializar legendarios y conjuntos
        this.legendarios = opciones.legendarios ?? LEGENDARIOS_DEFAULT;
        this.conjuntos = opciones.conjuntos ?? ITEMS_CONJUNTO_DEFAULT;

        // Inicializar estados de balance
        this.estadoPity = {
            dropsSinLegendario: 0,
            dropsSinRaro: 0,
            dropsSinConjunto: 0,
        };

        this.estadoBadLuck = {
            dropsNormalesConsecutivos: 0,
            bonusActual: 0,
        };
    }

    /**
     * Generar loot desde una Treasure Class
     */
    generarDesdeTC(tcId: string, contexto: ContextoDrop): ResultadoLoot {
        const tc = this.treasureClasses.get(tcId);
        if (!tc) {
            return { items: [] };
        }

        const items: ItemGenerado[] = [];
        let cantidadOro = 0;

        // Realizar picks
        for (let i = 0; i < tc.picks; i++) {
            const entrada = rollEnTreasureClass(tc);
            if (!entrada) continue; // No drop

            if (entrada.tcRef) {
                // Referencia recursiva a otra TC
                const subResultado = this.generarDesdeTC(entrada.tcRef, contexto);
                items.push(...subResultado.items);
                cantidadOro += subResultado.cantidadOro ?? 0;
            } else if (entrada.itemId) {
                // Drop directo de item
                if (entrada.itemId === 'oro') {
                    cantidadOro += this.rollCantidadOro(contexto.nivelMonstruo);
                } else {
                    const itemBase = this.items.get(entrada.itemId);
                    if (itemBase) {
                        const generado = this.generarItem(itemBase, contexto, tc);
                        if (generado) {
                            items.push(generado);
                        }
                    }
                }
            }
        }

        return {
            items,
            cantidadOro: cantidadOro > 0 ? cantidadOro : undefined,
            estadoPity: { ...this.estadoPity },
            estadoBadLuck: { ...this.estadoBadLuck },
        };
    }

    /**
     * Generar un item con rareza y afijos
     */
    generarItem(
        itemBase: ItemBase,
        contexto: ContextoDrop,
        tc?: TreasureClass
    ): ItemGenerado | null {
        const nivelItem = Math.min(contexto.nivelMonstruo, 99);

        // Verificar Pity System para forzar rareza
        const rarezaForzada = this.verificarPity(contexto.nivelMonstruo);

        // Calcular bonus de Bad Luck
        const bonusBadLuck = this.config.badLuck?.habilitado
            ? this.estadoBadLuck.bonusActual
            : 0;

        // Roll de rareza
        let rareza: Rareza;
        if (rarezaForzada) {
            rareza = rarezaForzada;
        } else {
            // Aplicar modificadores de TC
            let hmEfectivo = this.config.hallazgoMagico ?? 0;
            if (tc?.modificadorLegendario && tc.modificadorLegendario > 1) {
                hmEfectivo *= 1 + (tc.modificadorLegendario - 1) * 0.5;
            }

            rareza = this.rollRarezaItem(itemBase, hmEfectivo, bonusBadLuck);
        }

        // Actualizar estados de balance
        this.actualizarEstadosBalance(rareza);

        // Generar item según rareza
        if (rareza === Rareza.LEGENDARIO) {
            return this.generarItemLegendario(contexto.nivelMonstruo, itemBase.tipo);
        }

        if (rareza === Rareza.CONJUNTO) {
            return this.generarItemConjunto(contexto.nivelMonstruo, itemBase.tipo);
        }

        // Item normal, mágico o raro
        const afijos = this.generarAfijos(itemBase, nivelItem, rareza);
        const nombre = this.construirNombreItem(itemBase, rareza, afijos);

        return {
            itemBase,
            rareza,
            nivelItem,
            nombre,
            afijos,
            cantidad: itemBase.esApilable ? this.rollTamañoStack(itemBase) : undefined,
        };
    }

    /**
     * Verificar si Pity System debe forzar una rareza
     */
    private verificarPity(nivelMonstruo: number): Rareza | null {
        const pity = this.config.pity ?? PITY_DEFAULT;

        // Verificar legendario
        if (this.estadoPity.dropsSinLegendario >= pity.legendario) {
            // Verificar que hay legendarios disponibles para este nivel
            const disponibles = this.legendarios.filter(l => l.nivelDrop <= nivelMonstruo);
            if (disponibles.length > 0) {
                return Rareza.LEGENDARIO;
            }
        }

        // Verificar conjunto
        if (this.estadoPity.dropsSinConjunto >= pity.conjunto) {
            const disponibles = this.conjuntos.filter(c => c.nivelDrop <= nivelMonstruo);
            if (disponibles.length > 0) {
                return Rareza.CONJUNTO;
            }
        }

        // Verificar raro
        if (this.estadoPity.dropsSinRaro >= pity.raro) {
            return Rareza.RARO;
        }

        return null;
    }

    /**
     * Actualizar estados de Pity y Bad Luck
     */
    private actualizarEstadosBalance(rareza: Rareza): void {
        // Actualizar Pity
        if (rareza === Rareza.LEGENDARIO) {
            this.estadoPity.dropsSinLegendario = 0;
        } else {
            this.estadoPity.dropsSinLegendario++;
        }

        if (rareza === Rareza.CONJUNTO) {
            this.estadoPity.dropsSinConjunto = 0;
        } else {
            this.estadoPity.dropsSinConjunto++;
        }

        if (rareza === Rareza.RARO || rareza === Rareza.LEGENDARIO || rareza === Rareza.CONJUNTO) {
            this.estadoPity.dropsSinRaro = 0;
        } else {
            this.estadoPity.dropsSinRaro++;
        }

        // Actualizar Bad Luck Protection
        if (this.config.badLuck?.habilitado) {
            if (rareza === Rareza.NORMAL) {
                this.estadoBadLuck.dropsNormalesConsecutivos++;

                if (this.estadoBadLuck.dropsNormalesConsecutivos >= this.config.badLuck.dropsParaActivar) {
                    const incremento = this.config.badLuck.bonusPorcentaje;
                    this.estadoBadLuck.bonusActual = Math.min(
                        this.estadoBadLuck.bonusActual + incremento,
                        this.config.badLuck.maxBonus
                    );
                }
            } else {
                // Reset al obtener item no-normal
                this.estadoBadLuck.dropsNormalesConsecutivos = 0;
                this.estadoBadLuck.bonusActual = 0;
            }
        }
    }

    /**
     * Roll de rareza considerando tipo de item
     */
    private rollRarezaItem(
        itemBase: ItemBase,
        hallazgoMagico: number,
        bonusBadLuck: number
    ): Rareza {
        // Pociones y oro siempre son normales
        if (itemBase.tipo === 'pocion' || itemBase.tipo === 'oro') {
            return Rareza.NORMAL;
        }

        return rollRareza(hallazgoMagico, CONFIG_RAREZA_DEFAULT, Object.values(Rareza), bonusBadLuck);
    }

    /**
     * Generar item legendario
     */
    private generarItemLegendario(
        nivelMonstruo: number,
        tipoItemPreferido?: import('../types').TipoItem
    ): ItemGenerado | null {
        const legendario = seleccionarLegendarioAleatorio(nivelMonstruo, tipoItemPreferido);
        if (!legendario) return null;

        // Roll de los modificadores fijos
        const modificadoresRolleados = legendario.modificadoresFijos.map(mod => ({
            stat: mod.stat,
            valor: Math.floor(Math.random() * (mod.max - mod.min + 1)) + mod.min,
        }));

        return {
            itemBase: legendario,
            rareza: Rareza.LEGENDARIO,
            nivelItem: legendario.nivelDrop,
            nombre: legendario.nombreLegendario,
            afijos: [{
                afijo: {
                    id: 'legendario_stats',
                    nombre: 'Legendario',
                    tipo: TipoAfijo.PREFIJO,
                    nivelRequerido: 1,
                    frecuencia: 0,
                    modificadores: [],
                },
                modificadoresRolleados,
            }],
            datosLegendario: legendario,
        };
    }

    /**
     * Generar item de conjunto
     */
    private generarItemConjunto(
        nivelMonstruo: number,
        tipoItemPreferido?: import('../types').TipoItem
    ): ItemGenerado | null {
        const itemConjunto = seleccionarItemConjuntoAleatorio(nivelMonstruo, tipoItemPreferido);
        if (!itemConjunto) return null;

        // Roll de los modificadores fijos
        const modificadoresRolleados = itemConjunto.modificadoresFijos.map(mod => ({
            stat: mod.stat,
            valor: Math.floor(Math.random() * (mod.max - mod.min + 1)) + mod.min,
        }));

        return {
            itemBase: itemConjunto,
            rareza: Rareza.CONJUNTO,
            nivelItem: itemConjunto.nivelDrop,
            nombre: `${itemConjunto.nombre} [${itemConjunto.nombreConjunto}]`,
            afijos: [{
                afijo: {
                    id: 'conjunto_stats',
                    nombre: 'Conjunto',
                    tipo: TipoAfijo.PREFIJO,
                    nivelRequerido: 1,
                    frecuencia: 0,
                    modificadores: [],
                },
                modificadoresRolleados,
            }],
            datosConjunto: itemConjunto,
        };
    }

    /**
     * Generar afijos para items mágicos/raros
     */
    private generarAfijos(
        itemBase: ItemBase,
        nivelItem: number,
        rareza: Rareza
    ): AfijoGenerado[] {
        const config = CONFIG_RAREZA_DEFAULT[rareza];
        if (config.maxAfijos === 0) return [];

        const todosAfijos = obtenerTodosLosAfijos();
        const prefijosValidos = obtenerAfijosValidos(
            todosAfijos,
            itemBase.tipo,
            nivelItem,
            TipoAfijo.PREFIJO
        );
        const sufijosValidos = obtenerAfijosValidos(
            todosAfijos,
            itemBase.tipo,
            nivelItem,
            TipoAfijo.SUFIJO
        );

        const cantidadAfijos =
            Math.floor(Math.random() * (config.maxAfijos - config.minAfijos + 1)) +
            config.minAfijos;

        const gruposUsados = new Set<string>();
        const resultado: AfijoGenerado[] = [];

        if (rareza === Rareza.MAGICO) {
            const cantidadPrefijos = Math.random() < 0.5 ? 1 : 0;
            const cantidadSufijos = cantidadAfijos - cantidadPrefijos;

            if (cantidadPrefijos > 0 && prefijosValidos.length > 0) {
                const seleccionados = seleccionarAfijos(prefijosValidos, 1, gruposUsados);
                resultado.push(...seleccionados.map(rollModificadoresAfijo));
            }
            if (cantidadSufijos > 0 && sufijosValidos.length > 0) {
                const seleccionados = seleccionarAfijos(sufijosValidos, 1, gruposUsados);
                resultado.push(...seleccionados.map(rollModificadoresAfijo));
            }
        } else if (rareza === Rareza.RARO) {
            const maxPrefijos = Math.min(3, Math.ceil(cantidadAfijos / 2));
            const cantidadPrefijos = Math.floor(Math.random() * maxPrefijos) + 1;
            const cantidadSufijos = Math.min(3, cantidadAfijos - cantidadPrefijos);

            const prefijosSeleccionados = seleccionarAfijos(prefijosValidos, cantidadPrefijos, gruposUsados);
            resultado.push(...prefijosSeleccionados.map(rollModificadoresAfijo));

            const sufijosSeleccionados = seleccionarAfijos(sufijosValidos, cantidadSufijos, gruposUsados);
            resultado.push(...sufijosSeleccionados.map(rollModificadoresAfijo));
        }

        return resultado;
    }

    /**
     * Construir nombre del item
     */
    private construirNombreItem(
        itemBase: ItemBase,
        rareza: Rareza,
        afijos: AfijoGenerado[]
    ): string {
        if (rareza === Rareza.NORMAL) {
            return itemBase.nombre;
        }

        const prefijo = afijos.find((a) => a.afijo.tipo === TipoAfijo.PREFIJO);
        const sufijo = afijos.find((a) => a.afijo.tipo === TipoAfijo.SUFIJO);

        let nombre = itemBase.nombre;
        if (prefijo) nombre = `${prefijo.afijo.nombre} ${nombre}`;
        if (sufijo) nombre = `${nombre} ${sufijo.afijo.nombre}`;

        return nombre;
    }

    /**
     * Roll de cantidad de oro
     */
    private rollCantidadOro(nivelMonstruo: number): number {
        const base = nivelMonstruo * 15;
        const varianza = Math.floor(base * 0.5);
        return base + Math.floor(Math.random() * varianza);
    }

    /**
     * Roll de tamaño de stack
     */
    private rollTamañoStack(item: ItemBase): number {
        const max = Math.min(item.maxApilado ?? 1, 5);
        return Math.floor(Math.random() * max) + 1;
    }

    /**
     * Actualizar configuración
     */
    setConfig(config: Partial<ConfigGenerador>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Obtener configuración actual
     */
    getConfig(): ConfigGenerador {
        return { ...this.config };
    }

    /**
     * Obtener estado del Pity System
     */
    getEstadoPity(): EstadoPity {
        return { ...this.estadoPity };
    }

    /**
     * Obtener estado del Bad Luck Protection
     */
    getEstadoBadLuck(): EstadoBadLuck {
        return { ...this.estadoBadLuck };
    }

    /**
     * Resetear estados de balance
     */
    resetearEstados(): void {
        this.estadoPity = {
            dropsSinLegendario: 0,
            dropsSinRaro: 0,
            dropsSinConjunto: 0,
        };
        this.estadoBadLuck = {
            dropsNormalesConsecutivos: 0,
            bonusActual: 0,
        };
    }
}

// Alias para compatibilidad
export const LootGenerator = GeneradorLoot;

// Función de conveniencia
export function generarLoot(
    tcId: string,
    contexto: ContextoDrop,
    config?: ConfigGenerador
): ResultadoLoot {
    const generador = new GeneradorLoot(config);
    return generador.generarDesdeTC(tcId, contexto);
}

export const generateLoot = generarLoot;
