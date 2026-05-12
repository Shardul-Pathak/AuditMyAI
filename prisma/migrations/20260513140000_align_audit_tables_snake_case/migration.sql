-- Align "AuditReport" / "AuditItem" / "Lead" with Prisma @@map (snake_case column names).
-- Renames camelCase -> snake_case when the camel name exists and the snake name does not.
-- Adds missing "AuditReport" financial / JSON / metadata columns as snake_case.

-- ---------- AuditReport renames ----------
DO $$
DECLARE
  pair text[];
  pairs text[][] := ARRAY[
    ARRAY['publicId', 'public_id'],
    ARRAY['createdAt', 'created_at'],
    ARRAY['updatedAt', 'updated_at'],
    ARRAY['totalMonthlySpend', 'total_monthly_spend'],
    ARRAY['totalMonthlySavings', 'total_monthly_savings'],
    ARRAY['totalAnnualSavings', 'total_annual_savings'],
    ARRAY['teamSize', 'team_size'],
    ARRAY['primaryUseCase', 'primary_use_case'],
    ARRAY['auditScore', 'audit_score'],
    ARRAY['leadId', 'lead_id'],
    ARRAY['adobePdfUrl', 'adobe_pdf_url'],
    ARRAY['generatedReport', 'generated_report']
  ];
BEGIN
  IF to_regclass('public."AuditReport"') IS NULL THEN
    RAISE EXCEPTION 'Table public."AuditReport" does not exist. Apply the Prisma schema first (e.g. prisma migrate dev / db push).';
  END IF;

  FOREACH pair SLICE 1 IN ARRAY pairs
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'AuditReport'
        AND a.attname = pair[1]
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) AND NOT EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'AuditReport'
        AND a.attname = pair[2]
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) THEN
      EXECUTE format('ALTER TABLE "AuditReport" RENAME COLUMN %I TO %I;', pair[1], pair[2]);
    END IF;
  END LOOP;
END $$;

DROP INDEX IF EXISTS "AuditReport_publicId_key";
DROP INDEX IF EXISTS "AuditReport_public_id_key";

-- ---------- AuditReport: ensure columns exist ----------
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "public_id" TEXT;
UPDATE "AuditReport" SET "public_id" = "id" WHERE "public_id" IS NULL;
ALTER TABLE "AuditReport" ALTER COLUMN "public_id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "AuditReport_public_id_key" ON "AuditReport"("public_id");

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "total_monthly_spend" DECIMAL(10,2);
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "total_monthly_savings" DECIMAL(10,2);
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "total_annual_savings" DECIMAL(10,2);
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "team_size" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "primary_use_case" "UseCase" NOT NULL DEFAULT 'MIXED'::"UseCase";
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "summary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "audit_score" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "lead_id" TEXT;
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "adobe_pdf_url" TEXT;
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "generated_report" JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "AuditReport" SET "total_monthly_spend" = 0 WHERE "total_monthly_spend" IS NULL;
UPDATE "AuditReport" SET "total_monthly_savings" = 0 WHERE "total_monthly_savings" IS NULL;
UPDATE "AuditReport" SET "total_annual_savings" = 0 WHERE "total_annual_savings" IS NULL;

ALTER TABLE "AuditReport" ALTER COLUMN "total_monthly_spend" SET NOT NULL;
ALTER TABLE "AuditReport" ALTER COLUMN "total_monthly_savings" SET NOT NULL;
ALTER TABLE "AuditReport" ALTER COLUMN "total_annual_savings" SET NOT NULL;

-- ---------- AuditItem renames ----------
DO $$
DECLARE
  pair text[];
  pairs text[][] := ARRAY[
    ARRAY['createdAt', 'created_at'],
    ARRAY['toolName', 'tool_name'],
    ARRAY['currentPlan', 'current_plan'],
    ARRAY['recommendedPlan', 'recommended_plan'],
    ARRAY['currentMonthlyCost', 'current_monthly_cost'],
    ARRAY['recommendedMonthlyCost', 'recommended_monthly_cost'],
    ARRAY['monthlySavings', 'monthly_savings'],
    ARRAY['annualSavings', 'annual_savings'],
    ARRAY['recommendationType', 'recommendation_type'],
    ARRAY['confidenceScore', 'confidence_score'],
    ARRAY['reportId', 'report_id']
  ];
BEGIN
  IF to_regclass('public."AuditItem"') IS NULL THEN
    RETURN;
  END IF;

  FOREACH pair SLICE 1 IN ARRAY pairs
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'AuditItem'
        AND a.attname = pair[1]
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) AND NOT EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'AuditItem'
        AND a.attname = pair[2]
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) THEN
      EXECUTE format('ALTER TABLE "AuditItem" RENAME COLUMN %I TO %I;', pair[1], pair[2]);
    END IF;
  END LOOP;
END $$;

-- ---------- Lead renames ----------
DO $$
DECLARE
  pair text[];
  pairs text[][] := ARRAY[
    ARRAY['createdAt', 'created_at'],
    ARRAY['updatedAt', 'updated_at'],
    ARRAY['companyName', 'company_name'],
    ARRAY['estimatedTeamSize', 'estimated_team_size']
  ];
BEGIN
  IF to_regclass('public."Lead"') IS NULL THEN
    RETURN;
  END IF;

  FOREACH pair SLICE 1 IN ARRAY pairs
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'Lead'
        AND a.attname = pair[1]
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) AND NOT EXISTS (
      SELECT 1
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'Lead'
        AND a.attname = pair[2]
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) THEN
      EXECUTE format('ALTER TABLE "Lead" RENAME COLUMN %I TO %I;', pair[1], pair[2]);
    END IF;
  END LOOP;
END $$;

ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "company_name" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "estimated_team_size" INTEGER;
