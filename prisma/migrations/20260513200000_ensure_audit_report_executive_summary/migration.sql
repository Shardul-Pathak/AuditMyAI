-- Legacy NOT NULL "executiveSummary" on "AuditReport" (denormalized narrative; mirrors `summary` / JSON).
-- Rename snake_case if present; add if missing; backfill from `summary` or `generated_report` JSON.

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
      AND a.attname = 'executive_summary' AND a.attnum > 0 AND NOT a.attisdropped
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'executiveSummary' AND a.attnum > 0 AND NOT a.attisdropped
  ) THEN
    EXECUTE 'ALTER TABLE "AuditReport" RENAME COLUMN "executive_summary" TO "executiveSummary"';
  END IF;
END $$;

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "executiveSummary" TEXT;

UPDATE "AuditReport" r
SET "executiveSummary" = COALESCE(
  NULLIF(trim(r."executiveSummary"), ''),
  NULLIF(trim(r."summary"), ''),
  COALESCE(r."generated_report"->>'executiveSummary', '')
)
WHERE r."executiveSummary" IS NULL OR trim(COALESCE(r."executiveSummary", '')) = '';

ALTER TABLE "AuditReport" ALTER COLUMN "executiveSummary" SET NOT NULL;
