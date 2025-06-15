// server/prisma/client.ts
import { PrismaClient } from '@prisma/client';

// Avoid creating multiple instances during dev
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Create the client
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['query', 'error', 'warn'], // You can remove this in prod
	});

// Reuse the client in development
if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
