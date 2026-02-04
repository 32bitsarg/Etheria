import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password, email } = body;

        if (!username || username.trim().length < 3) {
            return NextResponse.json(
                { error: 'El usuario debe tener al menos 3 caracteres' },
                { status: 400 }
            );
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Correo electrónico inválido' },
                { status: 400 }
            );
        }

        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Check availability
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: normalizedUsername },
                    { email: normalizedEmail }
                ]
            },
        });

        if (existingUser) {
            if (existingUser.username.toLowerCase() === normalizedUsername.toLowerCase()) {
                return NextResponse.json(
                    { error: 'El nombre de usuario ya está en uso' },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { error: 'El correo electrónico ya está registrado' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        // Create user
        const user = await prisma.user.create({
            data: {
                username: normalizedUsername,
                password: hashedPassword,
                email: normalizedEmail,
            },
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username },
            needsRaceSelection: true
        });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
