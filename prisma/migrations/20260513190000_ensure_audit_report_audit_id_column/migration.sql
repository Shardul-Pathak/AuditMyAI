-- Ensure `AuditReport` has the legacy `"auditId"` column Prisma expects (camelCase, quoted).
-- Handles: only `audit_id` exists (rename), column missing (add + backfill), or already correct.

DO $$
BEGIN
  IF to_regclass('public."AuditReport"') IS NULL THEN
    RETURN;
  END IF;

  -- If a mistaken snake_case column exists from earlier experiments, rename to "auditId".
  IF EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'audit_id' AND a.attnum > 0 AND NOT a.attisdropped
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'AuditReport'
      AND a.attname = 'auditId' AND a.attnum > 0 AND NOT a.attisdropped
  ) THEN
    EXECUTE 'ALTER TABLE "AuditReport" RENAME COLUMN "audit_id" TO "auditId"';
  END IF;
END $$;

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "auditId" TEXT;

UPDATE "AuditReport"
SET "auditId" = COALESCE(NULLIF(trim("auditId"), ''), "public_id", "id")
WHERE "auditId" IS NULL OR trim(COALESCE("auditId", '')) = '';

ALTER TABLE "AuditReport" ALTER COLUMN "auditId" SET NOT NULL;
