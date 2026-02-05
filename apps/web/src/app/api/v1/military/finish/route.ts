import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPlayer } from '@/lib/player-utils';

const INSTANT_FINISH_THRESHOLD = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
    try {
        const { queueId } = await request.json();
        const player = await getAuthPlayer();

        if (!player || !player.city) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const queueItem = player.city.trainingQueue.find(q => q.id === queueId);
        if (!queueItem) return NextResponse.json({ error: 'Training not found' }, { status: 404 });

        const now = new Date();
        const timeLeft = new Date(queueItem.endTime).getTime() - now.getTime();

        if (timeLeft > INSTANT_FINISH_THRESHOLD) {
            return NextResponse.json({ error: 'Too early to finish', timeLeft: Math.floor(timeLeft / 1000) }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.unit.upsert({
                where: { cityId_type: { cityId: player.city!.id, type: queueItem.unitType } },
                update: { count: { increment: queueItem.count } },
                create: { cityId: player.city!.id, type: queueItem.unitType, count: queueItem.count }
            });
            await tx.trainingQueueItem.delete({ where: { id: queueId } });
        });

        return NextResponse.json({ success: true, message: 'Entrenamiento finalizado' });

    } catch (error) {
        console.error('V1 Finish Training error:', error.message);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
