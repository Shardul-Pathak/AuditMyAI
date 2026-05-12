-- Lead capture: first/last name and company size bucket.

DO $$ BEGIN
  CREATE TYPE "LeadCompanySize" AS ENUM ('ONE', 'TWO_TO_TEN', 'ELEVEN_TO_FIFTY', 'FIFTY_PLUS');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "first_name" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "last_name" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "company_size" "LeadCompanySize";
