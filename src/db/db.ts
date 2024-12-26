import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Use the global prisma client instance
const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

// Assign to globalThis.prisma in non-production environments
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
