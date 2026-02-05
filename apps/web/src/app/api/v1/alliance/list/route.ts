import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const alliances = await prisma.alliance.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: {
                members: {
                    _count: 'desc'
                }
            },
            take: 50
        });

        return NextResponse.json(alliances);
    } catch (error) {
        console.error('Error fetching alliances:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
