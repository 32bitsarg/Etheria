import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * PATCH /api/messages/[id]
 * Mark as read
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { read } = body;

        await (prisma as any).message.update({
            where: { id },
            data: { read }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/messages/[id]?playerId=xxx
 * Logical deletion
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');

        if (!playerId) {
            return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
        }

        const message = await (prisma as any).message.findUnique({
            where: { id }
        });

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (message.senderId === playerId) {
            await (prisma as any).message.update({
                where: { id },
                data: { deletedBySender: true }
            });
        } else if (message.recipientId === playerId) {
            await (prisma as any).message.update({
                where: { id },
                data: { deletedByRecipient: true }
            });
        }

        // Si ambos lo borraron, borrar físicamente (u opcionalmente dejarlo así)
        const updated = await (prisma as any).message.findUnique({ where: { id } });
        if (updated?.deletedBySender && updated?.deletedByRecipient) {
            await (prisma as any).message.delete({ where: { id } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
