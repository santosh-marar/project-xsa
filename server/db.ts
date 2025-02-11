import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const createPrismaClient = () =>
  new PrismaClient({
    // log:  env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Function to check database connection
export async function checkDatabaseConnection() {
  try {
    await db.$connect(); // Try connecting
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw new Error("Database connection failed. Please check your database server.");
  } finally {
    await db.$disconnect(); // Ensure disconnection after check
  }
}


