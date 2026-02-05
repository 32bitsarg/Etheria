import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { encrypt, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username: username.trim() },
            include: {
                player: {
                    include: {
                        city: {
                            include: {
                                buildings: true,
                                constructionQueue: true,
                                trainingQueue: true,
                                units: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedInput !== user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT payload
        const sessionPayload = {
            userId: user.id,
            username: user.username,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };

        // Create the response
        const response = NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username },
            player: user.player,
            needsRaceSelection: !user.player,
        });

        // Set the cookie
        const token = await encrypt(sessionPayload);
        response.cookies.set({
            name: AUTH_COOKIE_NAME,
            value: token,
            httpOnly: true,
            expires: sessionPayload.expires,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
        });

        return response;

    } catch (error) {
        console.error('V1 Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
