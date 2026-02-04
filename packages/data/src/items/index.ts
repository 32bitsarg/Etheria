import { ItemBase, TipoItem } from '@lootsystem/core';
import { ESPADAS, HACHAS, ARCOS } from './weapons';
import { YELMOS, ARMADURAS, GUANTES, BOTAS, ESCUDOS, CINTURONES } from './armor';
import { JOYERIA } from './accessories';
import { CONSUMIBLES } from './consumables';

export * from './weapons';
export * from './armor';
export * from './accessories';
export * from './consumables';

// ============================================
// EXPORTAR TODO
// ============================================

export const TODOS_LOS_ITEMS: ItemBase[] = [
    ...ESPADAS,
    ...HACHAS,
    ...ARCOS,
    ...YELMOS,
    ...ARMADURAS,
    ...GUANTES,
    ...BOTAS,
    ...ESCUDOS,
    ...JOYERIA,
    ...CINTURONES,
    ...CONSUMIBLES,
];

export function obtenerItemPorId(id: string): ItemBase | undefined {
    return TODOS_LOS_ITEMS.find(item => item.id === id);
}

export function obtenerItemsPorTipo(tipo: TipoItem): ItemBase[] {
    return TODOS_LOS_ITEMS.filter(item => item.tipo === tipo);
}
