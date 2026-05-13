import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const rawDatabaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_URL;

if (!rawDatabaseUrl) {
  throw new Error(
    "DATABASE_URL or SUPABASE_URL must be set (Prisma CLI accepts either; runtime DB uses the same resolution)."
  );
}

const adapter = new PrismaPg(
  new Pool({
    connectionString: rawDatabaseUrl,
  })
);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? (["query", "error", "warn"] as const)
        : (["error"] as const),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
