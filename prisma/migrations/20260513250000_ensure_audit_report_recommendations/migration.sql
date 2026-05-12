-- Legacy NOT NULL "recommendations" on "AuditReport" (JSON array of per-tool recommendation rows).
-- Optional rename if an older snake_case column exists; add if missing; backfill from `generated_report` or `[]`.

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
      AND a.attname = 'recommendations_json' AND a.attnum > 0 AND NOT a.attisdropped
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'recommendations' AND a.attnum > 0 AND NOT a.attisdropped
  ) THEN
    EXECUTE 'ALTER TABLE "AuditReport" RENAME COLUMN "recommendations_json" TO "recommendations"';
  END IF;
END $$;

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "recommendations" JSONB;

UPDATE "AuditReport" r
SET "recommendations" = COALESCE(
  r."recommendations",
  CASE
    WHEN jsonb_typeof(COALESCE(r."generated_report", '{}'::jsonb)->'topOpportunities') = 'array'
    THEN r."generated_report"->'topOpportunities'
    ELSE '[]'::jsonb
  END
)
WHERE r."recommendations" IS NULL;

ALTER TABLE "AuditReport" ALTER COLUMN "recommendations" SET DEFAULT '[]'::jsonb;
UPDATE "AuditReport" SET "recommendations" = '[]'::jsonb WHERE "recommendations" IS NULL;
ALTER TABLE "AuditReport" ALTER COLUMN "recommendations" SET NOT NULL;
