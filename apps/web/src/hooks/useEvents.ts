'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/ToastContext';

export function useEvents(playerId: string | undefined, onSync: () => void) {
    const { addToast } = useToast();

    useEffect(() => {
        if (!playerId) return;

        // Conectar al endpoint de SSE
        const eventSource = new EventSource('/api/events');

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
