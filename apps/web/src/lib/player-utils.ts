import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function getAuthPlayer() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return null;
    }

    const player = await prisma.player.findUnique({
        where: { userId },
        include: {
            city: {
                include: {
                    buildings: true,
                    constructionQueue: true,
                    trainingQueue: true,
                    units: true,
                }
            },
            allianceMember: {
                include: {
                    alliance: true
                }
            }
        }
    });

    return player;
}
