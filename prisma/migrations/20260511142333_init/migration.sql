-- CreateEnum
CREATE TYPE "AiTool" AS ENUM ('CURSOR', 'GITHUB_COPILOT', 'CLAUDE', 'CHATGPT', 'ANTHROPIC_API', 'OPENAI_API', 'GEMINI', 'WINDSURF', 'V0');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'PRO', 'TEAM', 'BUSINESS', 'ENTERPRISE', 'CUSTOM', 'PAY_AS_YOU_GO');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('DOWNGRADE', 'UPGRADE', 'SWITCH_TOOL', 'CONSOLIDATE', 'SWITCH_TO_API', 'SWITCH_TO_CONSUMER', 'OPTIMAL');

-- CreateEnum
CREATE TYPE "PricingUnit" AS ENUM ('PER_SEAT_MONTHLY', 'FLAT_MONTHLY', 'PER_TOKEN', 'PER_REQUEST', 'CREDIT_BASED');

-- CreateEnum
CREATE TYPE "UseCase" AS ENUM ('CODE_GENERATION', 'CONTENT_WRITING', 'DATA_ANALYSIS', 'CUSTOMER_SUPPORT', 'RESEARCH', 'GENERAL_PRODUCTIVITY', 'MIXED');

-- CreateTable
CREATE TABLE "AuditReport" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalMonthlySpend" DECIMAL(10,2) NOT NULL,
    "totalMonthlySavings" DECIMAL(10,2) NOT NULL,
    "totalAnnualSavings" DECIMAL(10,2) NOT NULL,
    "teamSize" INTEGER NOT NULL DEFAULT 1,
    "primaryUseCase" "UseCase" NOT NULL DEFAULT 'MIXED',
    "summary" TEXT NOT NULL,
    "auditScore" INTEGER NOT NULL,
    "leadId" TEXT,

    CONSTRAINT "AuditReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toolName" "AiTool" NOT NULL,
    "currentPlan" "PlanTier" NOT NULL,
    "recommendedPlan" "PlanTier" NOT NULL,
    "currentMonthlyCost" DECIMAL(10,2) NOT NULL,
    "recommendedMonthlyCost" DECIMAL(10,2) NOT NULL,
    "monthlySavings" DECIMAL(10,2) NOT NULL,
    "annualSavings" DECIMAL(10,2) NOT NULL,
    "recommendationType" "RecommendationType" NOT NULL,
    "reasoning" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "AuditItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT,
    "role" TEXT,
    "estimatedTeamSize" INTEGER,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingSnapshot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor" "AiTool" NOT NULL,
    "plan" "PlanTier" NOT NULL,
    "monthlyPrice" DECIMAL(10,4) NOT NULL,
    "pricingUnit" "PricingUnit" NOT NULL,
    "sourceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,

    CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditReport_publicId_key" ON "AuditReport"("publicId");

-- CreateIndex
CREATE INDEX "AuditReport_publicId_idx" ON "AuditReport"("publicId");

-- CreateIndex
CREATE INDEX "AuditReport_createdAt_idx" ON "AuditReport"("createdAt");

-- CreateIndex
CREATE INDEX "AuditReport_leadId_idx" ON "AuditReport"("leadId");

-- CreateIndex
CREATE INDEX "AuditReport_auditScore_idx" ON "AuditReport"("auditScore");

-- CreateIndex
CREATE INDEX "AuditItem_reportId_idx" ON "AuditItem"("reportId");

-- CreateIndex
CREATE INDEX "AuditItem_toolName_idx" ON "AuditItem"("toolName");

-- CreateIndex
CREATE INDEX "AuditItem_recommendationType_idx" ON "AuditItem"("recommendationType");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "PricingSnapshot_vendor_plan_idx" ON "PricingSnapshot"("vendor", "plan");

-- CreateIndex
CREATE INDEX "PricingSnapshot_verifiedAt_idx" ON "PricingSnapshot"("verifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PricingSnapshot_vendor_plan_verifiedAt_key" ON "PricingSnapshot"("vendor", "plan", "verifiedAt");

-- CreateIndex
CREATE INDEX "RateLimitEvent_ipHash_endpoint_createdAt_idx" ON "RateLimitEvent"("ipHash", "endpoint", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitEvent_createdAt_idx" ON "RateLimitEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditItem" ADD CONSTRAINT "AuditItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AuditReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
