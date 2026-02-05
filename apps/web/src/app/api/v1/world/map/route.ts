import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const cities = await prisma.city.findMany({
            select: {
                id: true, name: true, x: true, y: true,
                player: {
                    select: {
                        race: true,
                        allianceMember: { select: { alliance: { select: { name: true, tag: true } } } }
                    }
                }
            }
        });

        return NextResponse.json({ success: true, cities });
    } catch (error) {
        console.error('V1 World Map error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
