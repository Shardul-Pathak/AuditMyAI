-- Add public share id for `/report/[publicId]` (schema expects this column; older DBs may lack it).

ALTER TABLE "AuditReport" ADD COLUMN IF NOT EXISTS "publicId" TEXT;

UPDATE "AuditReport" SET "publicId" = "id" WHERE "publicId" IS NULL;

ALTER TABLE "AuditReport" ALTER COLUMN "publicId" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "AuditReport_publicId_key" ON "AuditReport"("publicId");
