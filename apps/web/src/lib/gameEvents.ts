import { EventEmitter } from 'events';

// Nodo global para emitir eventos en el servidor
// En producción con múltiples instancias esto requeriría Redis,
// pero para desarrollo local con Next.js esto funciona perfectamente.
class GameEventEmitter extends EventEmitter { }

if (!(global as any).gameEvents) {
    (global as any).gameEvents = new GameEventEmitter();
}

export const gameEvents = (global as any).gameEvents as GameEventEmitter;

export const EVENTS = {
    ATTACK_INCOMING: 'ATTACK_INCOMING',
    BATTLE_REPORT: 'BATTLE_REPORT',
    CONSTRUCTION_COMPLETE: 'CONSTRUCTION_COMPLETE',
    ORDER_FILLED: 'ORDER_FILLED',
};
