import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { encrypt, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password, email } = body;

        if (!username || !password || !email) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
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
            const error = existingUser.username.toLowerCase() === normalizedUsername.toLowerCase()
                ? 'El nombre de usuario ya está en uso'
                : 'El correo electrónico ya está registrado';
            return NextResponse.json({ error }, { status: 400 });
        }

        // Hash password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create user
        const user = await prisma.user.create({
            data: {
                username: normalizedUsername,
                password: hashedPassword,
                email: normalizedEmail,
            },
        });

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
            needsRaceSelection: true
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
        console.error('V1 Register error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
