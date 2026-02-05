import { NextRequest } from 'next/server';
import { gameEvents, EVENTS } from '@/lib/gameEvents';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    // Función para enviar mensajes formateados para SSE
    const sendEvent = (data: any) => {
        writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    };

    // Escuchar eventos
    const onAttackIncoming = (data: any) => {
        sendEvent({ type: EVENTS.ATTACK_INCOMING, ...data });
    };

    const onBattleReport = (data: any) => {
        sendEvent({ type: EVENTS.BATTLE_REPORT, ...data });
    };

    const onNewMessage = (data: any) => {
        sendEvent({ type: 'NEW_MESSAGE', ...data });
    };

    gameEvents.on(EVENTS.ATTACK_INCOMING, onAttackIncoming);
    gameEvents.on(EVENTS.BATTLE_REPORT, onBattleReport);
    gameEvents.on('NEW_MESSAGE', onNewMessage);

    // Mantener la conexión viva con un heartbeat
    const heartbeat = setInterval(() => {
        sendEvent({ type: 'HEARTBEAT', timestamp: Date.now() });
    }, 30000);

    // Cerrar conexión cuando el cliente se desconecte
    request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        gameEvents.off(EVENTS.ATTACK_INCOMING, onAttackIncoming);
        gameEvents.off(EVENTS.BATTLE_REPORT, onBattleReport);
        gameEvents.off('NEW_MESSAGE', onNewMessage);
        writer.close();
    });

    return new Response(responseStream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
