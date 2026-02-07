import { NextRequest } from 'next/server';
import { gameEvents, EVENTS } from '@/lib/gameEvents';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    // We need to find the playerId for this userId to filter events
    // But since SSE is long-lived, we should probably just filter inside the listeners
    // Actually, we'll fetch the playerId once at the start.

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    const sendEvent = (data: any) => {
        try {
            writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
            // Stream might be closed
        }
    };

    // Listeners with filtering
    const onAttackIncoming = (data: any) => {
        if (data.targetUserId === userId) sendEvent({ type: EVENTS.ATTACK_INCOMING, ...data });
    };

    const onBattleReport = (data: any) => {
        if (data.attackerUserId === userId || data.targetUserId === userId) {
            sendEvent({ type: EVENTS.BATTLE_REPORT, ...data });
        }
    };

    const onNewMessage = (data: any) => {
        if (data.targetUserId === userId) sendEvent({ type: 'NEW_MESSAGE', ...data });
    };

    const onOrderFilled = (data: any) => {
        if (data.userId === userId) sendEvent({ type: EVENTS.ORDER_FILLED, ...data });
    };

    gameEvents.on(EVENTS.ATTACK_INCOMING, onAttackIncoming);
    gameEvents.on(EVENTS.BATTLE_REPORT, onBattleReport);
    gameEvents.on('NEW_MESSAGE', onNewMessage);
    gameEvents.on(EVENTS.ORDER_FILLED, onOrderFilled);

    const heartbeat = setInterval(() => sendEvent({ type: 'HEARTBEAT', timestamp: Date.now() }), 30000);

    request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        gameEvents.off(EVENTS.ATTACK_INCOMING, onAttackIncoming);
        gameEvents.off(EVENTS.BATTLE_REPORT, onBattleReport);
        gameEvents.off('NEW_MESSAGE', onNewMessage);
        gameEvents.off(EVENTS.ORDER_FILLED, onOrderFilled);
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
