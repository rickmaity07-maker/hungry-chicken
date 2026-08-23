import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. Initialize the new Postgres Adapter using your Neon URL
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL as string 
});

// 2. Pass the adapter directly into the PrismaClient constructor
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;