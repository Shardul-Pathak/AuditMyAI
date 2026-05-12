import { createHash } from "crypto";
import { db } from "./db";

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

const DEFAULT_CONFIG: Record<string, RateLimitConfig> = {
  "/api/audit": { maxRequests: 10, windowSeconds: 3600 },
  "/api/leads": { maxRequests: 5, windowSeconds: 3600 },
  "/api/lead": { maxRequests: 5, windowSeconds: 3600 },
  "/api/report": { maxRequests: 100, windowSeconds: 3600 },
};
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const { maxRequests, windowSeconds } =
    config ?? DEFAULT_CONFIG[endpoint] ?? { maxRequests: 20, windowSeconds: 3600 };

  const ipHash = hashIp(ip);
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  try {
    const recentCount = await db.rateLimitEvent.count({
      where: {
        ipHash,
        endpoint,
        createdAt: { gte: windowStart },
      },
    });

    if (recentCount >= maxRequests) {
      return { allowed: false, retryAfterSeconds: windowSeconds };
    }

    await db.rateLimitEvent.create({
      data: { ipHash, endpoint },
    });

    return { allowed: true, remaining: maxRequests - recentCount - 1 };
  } catch (error) {
    console.error("[RateLimit] Database unavailable, allowing request", {
      endpoint,
      error: error instanceof Error ? error.message : String(error),
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }
}

export async function cleanupRateLimitEvents(): Promise<number> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const { count } = await db.rateLimitEvent.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return count;
  } catch (error) {
    console.error("[RateLimit] Cleanup skipped due to database error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

export function extractClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
