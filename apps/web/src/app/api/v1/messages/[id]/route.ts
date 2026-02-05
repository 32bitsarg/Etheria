import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { read } = await request.json();
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const message = await (prisma as any).message.findUnique({ where: { id } });
        if (!message || (message.recipientId !== player.id && message.senderId !== player.id)) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        await (prisma as any).message.update({
            where: { id },
            data: { read: message.recipientId === player.id ? read : message.read }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const player = await getAuthPlayer();

        if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const message = await (prisma as any).message.findUnique({ where: { id } });
        if (!message || (message.senderId !== player.id && message.recipientId !== player.id)) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (message.senderId === player.id) {
            await (prisma as any).message.update({ where: { id }, data: { deletedBySender: true } });
        } else if (message.recipientId === player.id) {
            await (prisma as any).message.update({ where: { id }, data: { deletedByRecipient: true } });
        }

        const updated = await (prisma as any).message.findUnique({ where: { id } });
        if (updated?.deletedBySender && updated?.deletedByRecipient) {
            await (prisma as any).message.delete({ where: { id } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
