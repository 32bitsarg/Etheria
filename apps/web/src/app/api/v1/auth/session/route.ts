import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
                player: {
                    include: {
                        city: {
                            include: {
                                buildings: true,
                                constructionQueue: true,
                                trainingQueue: true,
                                units: true
                            }
                        },
                        allianceMember: {
                            include: {
                                alliance: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username },
            player: user.player,
            needsRaceSelection: !user.player
        });

    } catch (error) {
        console.error('V1 Session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
