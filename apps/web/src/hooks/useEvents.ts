'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/ToastContext';

export function useEvents(playerId: string | undefined, onSync: () => void) {
    const { addToast } = useToast();

    useEffect(() => {
        if (!playerId) return;

        // Conectar al endpoint de SSE
        const eventSource = new EventSource('/api/v1/events');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Ignorar heartbeats
                if (data.type === 'HEARTBEAT') return;

                // Filtrar eventos para este jugador
                if (data.targetPlayerId === playerId) {
                    if (data.type === 'ATTACK_INCOMING') {
                        addToast(`⚠️ ¡ATAQUE ENTRANTE! Tropas desde ${data.originCityName} se aproximan.`, 'error');
                        onSync(); // Sincronizar para ver el movimiento en la barra lateral
                    }
                }

                // Notificar reportes de batalla
                if (data.type === 'BATTLE_REPORT') {
                    if (data.attackerId === playerId || data.defenderId === playerId) {
                        const isAttacker = data.attackerId === playerId;
                        const won = data.won;
                        const status = isAttacker ? (won ? 'victoria' : 'derrota') : (won ? 'derrota' : 'victoria');

                        addToast(`⚔️ Batalla finalizada: Ha sido una ${status}.`, status === 'victoria' ? 'success' : 'info');
                        onSync();
                    }
                }

                if (data.type === 'NEW_MESSAGE') {
                    if (data.targetPlayerId === playerId) {
                        addToast(`✉️ Has recibido un nuevo mensaje de correo.`, 'info');
                    }
                }

                if (data.type === 'LEVEL_UP') {
                    if (data.targetPlayerId === playerId) {
                        addToast(`✨ ¡FELICIDADES! Has alcanzado el nivel ${data.newLevel}.`, 'success');
                        onSync(); // Sync to update sidebar level
                    }
                }

                if (data.type === 'ORDER_FILLED') {
                    const { orderType, amount, price } = data;
                    const currency = orderType === 'BUY' ? 'Fragmentos de Éter' : 'Doblones';
                    addToast(`⚖️ Mercado: Tu orden de ${orderType === 'BUY' ? 'compra' : 'venta'} por ${amount} ${currency === 'Doblones' ? 'Éter' : 'Doblones'} a ${price} ha sido completada.`, 'success');
                    onSync();
                }

            } catch (error) {
                console.error('Error parsing SSE event:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [playerId, addToast, onSync]);
}
