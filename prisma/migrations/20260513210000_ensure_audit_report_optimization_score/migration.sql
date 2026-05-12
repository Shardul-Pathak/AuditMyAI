-- Legacy NOT NULL "optimizationScore" on "AuditReport" (denormalized score; mirrors `audit_score`).
-- Rename snake_case if present; add if missing; backfill from `audit_score`.

DO $$
BEGIN
  IF to_regclass('public."AuditReport"') IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'optimization_score' AND a.attnum > 0 AND NOT a.attisdropped
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'optimizationScore' AND a.attnum > 0 AND NOT a.attisdropped
  ) THEN
    EXECUTE 'ALTER TABLE "AuditReport" RENAME COLUMN "optimization_score" TO "optimizationScore"';
  END IF;
END $$;

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "optimizationScore" INTEGER;

UPDATE "AuditReport" r
SET "optimizationScore" = COALESCE(r."optimizationScore", r."audit_score", 0)
WHERE r."optimizationScore" IS NULL;

ALTER TABLE "AuditReport" ALTER COLUMN "optimizationScore" SET NOT NULL;
