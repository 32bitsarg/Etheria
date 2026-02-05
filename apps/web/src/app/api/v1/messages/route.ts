import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gameEvents } from '@/lib/gameEvents';
import { getAuthPlayer } from '@/lib/player-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') || 'inbox';
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const messages = await (prisma as any).message.findMany({
            where: folder === 'sent'
                ? { senderId: player.id, deletedBySender: false }
                : { recipientId: player.id, deletedByRecipient: false },
            include: {
                sender: { select: { id: true, user: { select: { username: true } } } },
                recipient: { select: { id: true, user: { select: { username: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error('V1 Messages GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { recipientName, subject, content } = await request.json();
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!recipientName || !subject || !content) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        const recipient = await (prisma as any).player.findFirst({
            where: {
                OR: [
                    { user: { username: { equals: recipientName, mode: 'insensitive' } } },
                    { city: { name: { equals: recipientName, mode: 'insensitive' } } }
                ]
            },
            select: { id: true }
        });

        if (!recipient) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
        if (recipient.id === player.id) return NextResponse.json({ error: 'No puedes enviarte mensajes a ti mismo' }, { status: 400 });

        const message = await (prisma as any).message.create({
            data: { senderId: player.id, recipientId: recipient.id, subject, content }
        });

        gameEvents.emit('NEW_MESSAGE', { targetPlayerId: recipient.id, senderName: (player as any).user.username });

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('V1 Messages POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
