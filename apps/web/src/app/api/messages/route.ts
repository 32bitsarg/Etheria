import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gameEvents, EVENTS } from '@/lib/gameEvents';

/**
 * GET /api/messages?playerId=xxx&folder=inbox|sent
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');
        const folder = searchParams.get('folder') || 'inbox';

        if (!playerId) {
            return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
        }


        const messages = await (prisma as any).message.findMany({
            where: folder === 'sent'
                ? { senderId: playerId, deletedBySender: false }
                : { recipientId: playerId, deletedByRecipient: false },
            include: {
                sender: { select: { id: true, user: { select: { username: true } } } },
                recipient: { select: { id: true, user: { select: { username: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error('Fetch messages error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { senderId, recipientName, subject, content } = body;

        if (!senderId || !recipientName || !subject || !content) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        // Buscar destinatario por nombre de usuario O nombre de ciudad
        const recipientPlayer = await (prisma as any).player.findFirst({
            where: {
                OR: [
                    {
                        user: {
                            username: {
                                equals: recipientName,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        city: {
                            name: {
                                equals: recipientName,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            select: { id: true }
        });

        if (!recipientPlayer) {
            return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
        }

        if (recipientPlayer.id === senderId) {
            return NextResponse.json({ error: 'No puedes enviarte mensajes a ti mismo' }, { status: 400 });
        }

        const message = await (prisma as any).message.create({
            data: {
                senderId,
                recipientId: recipientPlayer.id,
                subject,
                content
            }
        });

        // Emitir evento para notificar al destinatario en tiempo real
        gameEvents.emit('NEW_MESSAGE', {
            targetPlayerId: recipientPlayer.id,
            senderName: recipientName // We should ideally get the sender's name too
        });

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
