import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "Missing DATABASE_URL or SUPABASE_URL (set one in .env for Prisma CLI and migrations)."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: databaseUrl,
  },
});
