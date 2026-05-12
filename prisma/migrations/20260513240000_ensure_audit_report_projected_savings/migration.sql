-- Legacy NOT NULL "projectedSavings" on "AuditReport" (denormalized monthly savings projection).
-- Rename snake_case if present; add if missing; backfill from `total_monthly_savings`.

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
      AND a.attname = 'projected_savings' AND a.attnum > 0 AND NOT a.attisdropped
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'projectedSavings' AND a.attnum > 0 AND NOT a.attisdropped
  ) THEN
    EXECUTE 'ALTER TABLE "AuditReport" RENAME COLUMN "projected_savings" TO "projectedSavings"';
  END IF;
END $$;

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "projectedSavings" DECIMAL(10,2);

UPDATE "AuditReport" r
SET "projectedSavings" = COALESCE(r."projectedSavings", r."total_monthly_savings", 0)
WHERE r."projectedSavings" IS NULL;

ALTER TABLE "AuditReport" ALTER COLUMN "projectedSavings" SET NOT NULL;
