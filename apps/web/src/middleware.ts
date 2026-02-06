import { NextRequest, NextResponse } from 'next/server';
import { decrypt, AUTH_COOKIE_NAME } from '@/lib/auth';

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/register', '/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/session', '/manifest.json', '/sw.js'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Check if the path is public or a static asset
    const isPublicPath = publicPaths.some(publicPath => path === publicPath) ||
        path.startsWith('/assets/') ||
        path.startsWith('/_next/') ||
        path.match(/\.(json|js|css|png|jpg|jpeg|webp|ico|svg|webmanifest)$/) !== null;

    if (isPublicPath) {
        return NextResponse.next();
    }

    // 2. Get the session cookie
    const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    // 3. If no session and trying to access a protected route
    if (!session) {
        // If it's an API request, return 401
        if (path.startsWith('/api/v1/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // If it's a page request, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Verify the session
    try {
        const payload = await decrypt(session);

        // Check expiration
        if (parsedPayloadExpired(payload)) {
            throw new Error('Session expired');
        }

        // Add user info to headers so APIs can use it without decrypting again (performance)
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error('Middleware auth error:', error);
        // Invalid session
        const response = path.startsWith('/api/v1/')
            ? NextResponse.json({ error: 'Invalid session' }, { status: 401 })
            : NextResponse.redirect(new URL('/login', request.url));

        // Clear the invalid cookie
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
    }
}

function parsedPayloadExpired(payload: any) {
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
}

// Configure which routes the middleware targets
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json
         * - sw.js
         * - assets
         */
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|assets).*)',
    ],
};
