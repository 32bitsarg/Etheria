
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
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

        const userData = user as any;

        // If user has no player, they need race selection
        if (!userData.player) {
            return NextResponse.json({
                user: { id: userData.id, username: userData.username },
                player: null,
                needsRaceSelection: true
            });
        }

        // Return full data similar to login/tick
        return NextResponse.json({
            user: { id: userData.id, username: userData.username },
            player: userData.player,
            needsRaceSelection: false
        });

    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
