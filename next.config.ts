import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Load Prisma from node_modules at runtime so Turbopack does not embed a stale
  // generated client (fixes "Unknown argument …" after Prisma schema changes).
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "puppeteer"],
};

export default nextConfig;
