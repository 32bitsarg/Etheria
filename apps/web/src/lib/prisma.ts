import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    max: 10 // optimización básica de pool
});

const adapter = new PrismaPg(pool);

export const prisma =
    new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
