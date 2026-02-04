import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * POST /api/auth/login
 * Login with password verification
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || username.trim().length < 2) {
            return NextResponse.json(
                { error: 'Username must be at least 2 characters' },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Find user
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

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Verify password
        // If user has no password (legacy), we strictly require one now, so fail.
        if (!user.password) {
            return NextResponse.json(
                { error: 'Cuenta legacy: por favor contacta soporte (o regístrate de nuevo)' },
                { status: 401 }
            );
        }

        const hashedInput = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        if (hashedInput !== user.password) {
            return NextResponse.json(
                { error: 'Contraseña incorrecta' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
            },
            player: user.player,
            needsRaceSelection: !user.player,
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
