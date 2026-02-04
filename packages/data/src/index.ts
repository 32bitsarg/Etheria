/**
 * @lootsystem/data
 * Base de datos completa de items, sets y legendarios por raza
 */

// Items base
export * from './items';

// Sets por raza
export { SETS_ELFO, ITEMS_SETS_ELFO } from './sets/elfo';
export { SETS_HUMANO, ITEMS_SETS_HUMANO } from './sets/humano';
export { SETS_ORCO, ITEMS_SETS_ORCO } from './sets/orco';
export { SETS_ENANO, ITEMS_SETS_ENANO } from './sets/enano';

import { SETS_ELFO, ITEMS_SETS_ELFO } from './sets/elfo';
import { SETS_HUMANO, ITEMS_SETS_HUMANO } from './sets/humano';
import { SETS_ORCO, ITEMS_SETS_ORCO } from './sets/orco';
import { SETS_ENANO, ITEMS_SETS_ENANO } from './sets/enano';

// Agregados
export const TODOS_LOS_SETS = [
    ...SETS_ELFO,
    ...SETS_HUMANO,
    ...SETS_ORCO,
    ...SETS_ENANO,
];

export const TODOS_LOS_ITEMS_SET = [
    ...ITEMS_SETS_ELFO,
    ...ITEMS_SETS_HUMANO,
    ...ITEMS_SETS_ORCO,
    ...ITEMS_SETS_ENANO,
];

// Funciones de utilidad
export function obtenerSetsPorRaza(raza: 'elfo' | 'humano' | 'orco' | 'enano') {
    switch (raza) {
        case 'elfo': return SETS_ELFO;
        case 'humano': return SETS_HUMANO;
        case 'orco': return SETS_ORCO;
        case 'enano': return SETS_ENANO;
    }
}

export function obtenerItemsSetPorRaza(raza: 'elfo' | 'humano' | 'orco' | 'enano') {
    switch (raza) {
        case 'elfo': return ITEMS_SETS_ELFO;
        case 'humano': return ITEMS_SETS_HUMANO;
        case 'orco': return ITEMS_SETS_ORCO;
        case 'enano': return ITEMS_SETS_ENANO;
    }
}

export function contarSets() {
    return {
        elfo: SETS_ELFO.length,
        humano: SETS_HUMANO.length,
        orco: SETS_ORCO.length,
        enano: SETS_ENANO.length,
        total: TODOS_LOS_SETS.length,
    };
}

export function contarItemsSet() {
    return {
        elfo: ITEMS_SETS_ELFO.length,
        humano: ITEMS_SETS_HUMANO.length,
        orco: ITEMS_SETS_ORCO.length,
        enano: ITEMS_SETS_ENANO.length,
        total: TODOS_LOS_ITEMS_SET.length,
    };
}
