import { PrismaClient } from "@/app/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error", "info", "warn", "query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
