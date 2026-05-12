import { z } from "zod";

const AI_TOOLS = [
  "CURSOR",
  "GITHUB_COPILOT",
  "CLAUDE",
  "CHATGPT",
  "ANTHROPIC_API",
  "OPENAI_API",
  "GEMINI",
  "WINDSURF",
  "V0",
] as const;

const PLAN_TIERS = [
  "FREE",
  "PRO",
  "TEAM",
  "BUSINESS",
  "ENTERPRISE",
  "CUSTOM",
  "PAY_AS_YOU_GO",
] as const;

const RECOMMENDATION_TYPES = [
  "DOWNGRADE",
  "UPGRADE",
  "SWITCH_TOOL",
  "CONSOLIDATE",
  "SWITCH_TO_API",
  "SWITCH_TO_CONSUMER",
  "OPTIMAL",
] as const;

const USE_CASES = [
  "CODE_GENERATION",
  "CONTENT_WRITING",
  "DATA_ANALYSIS",
  "CUSTOMER_SUPPORT",
  "RESEARCH",
  "GENERAL_PRODUCTIVITY",
  "MIXED",
] as const;

const aiToolSchema = z.enum(AI_TOOLS);
const planTierSchema = z.enum(PLAN_TIERS);
const useCaseSchema = z.enum(USE_CASES);

const monthlySpendSchema = z
  .number({ error: "Monthly spend must be a number" })
  .min(0, "Monthly spend cannot be negative")
  .max(100_000, "Monthly spend exceeds maximum allowed value ($100,000)")
  .transform((v) => Math.round(v * 100) / 100);

const seatsSchema = z
  .number({ error: "Seats must be a number" })
  .int("Seats must be a whole number")
  .min(1, "Must have at least 1 seat")
  .max(10_000, "Seat count exceeds maximum (10,000)");

const teamSizeSchema = z
  .number({ error: "Team size must be a number" })
  .int("Team size must be a whole number")
  .min(1, "Team size must be at least 1")
  .max(100_000, "Team size exceeds maximum (100,000)")
  .default(1);

export const toolSubscriptionSchema = z.object({
  tool: aiToolSchema,
  plan: planTierSchema,
  monthlySpend: monthlySpendSchema,
  seats: seatsSchema,
});

export const auditInputSchema = z
  .object({
    tools: z
      .array(toolSubscriptionSchema)
      .min(1, "At least one tool subscription is required")
      .max(20, "Cannot audit more than 20 tool subscriptions at once")
      .refine(
        (tools) => {
          const seen = new Set<string>();
          return tools.every((t) => {
            const key = `${t.tool}:${t.plan}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        },
        { message: "Duplicate tool+plan combinations are not allowed" }
      ),
    teamSize: teamSizeSchema,
    primaryUseCase: useCaseSchema.default("MIXED"),
  })
  .refine(
    (data) => {
      const maxSeats = Math.max(...data.tools.map((t) => t.seats));
      return data.teamSize >= maxSeats;
    },
    {
      message: "Team size cannot be smaller than the seat count on any subscription",
      path: ["teamSize"],
    }
  );

export const auditItemResultSchema = z.object({
  toolName: aiToolSchema,
  currentPlan: planTierSchema,
  recommendedPlan: planTierSchema,
  currentMonthlyCost: z.number().nonnegative(),
  recommendedMonthlyCost: z.number().nonnegative(),
  monthlySavings: z.number(),
  annualSavings: z.number(),
  recommendationType: z.enum(RECOMMENDATION_TYPES),
  reasoning: z.string().min(1).max(1000),
  confidenceScore: z.number().min(0).max(1),
});

export const auditResultSchema = z.object({
  items: z.array(auditItemResultSchema),
  totalMonthlySpend: z.number().nonnegative(),
  totalMonthlySavings: z.number().nonnegative(),
  totalAnnualSavings: z.number().nonnegative(),
  auditScore: z.number().int().min(0).max(100),
  summary: z.string().min(1),
});

/** UI / API bucket for company headcount (maps to `LeadCompanySize` in Prisma). */
export const leadCompanySizeBucketSchema = z.enum(["1", "1-10", "11-50", "50+"]);

export const createLeadSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Must be a valid email address")
    .max(255, "Email too long"),

  companyName: z
    .string({ error: "Company name is required" })
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name too long"),

  firstName: z
    .string({ error: "First name is required" })
    .trim()
    .min(1, "First name is required")
    .max(100, "First name too long"),

  lastName: z
    .string({ error: "Last name is required" })
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name too long"),

  companySize: leadCompanySizeBucketSchema,

  reportPublicId: z.string().max(100).optional(),
});

/** POST /api/lead body (report slug + lead fields). */
export const leadSubmitSchema = createLeadSchema.extend({
  auditId: z.string().min(1, "Report reference is required"),
});

export const publicIdParamSchema = z.object({
  publicId: z.string().min(1).max(100).regex(/^[a-z0-9]+$/i, "Invalid public ID format"),
});

export type AuditInputDto = z.infer<typeof auditInputSchema>;
export type ToolSubscriptionDto = z.infer<typeof toolSubscriptionSchema>;
export type AuditResultDto = z.infer<typeof auditResultSchema>;
export type CreateLeadDto = z.infer<typeof createLeadSchema>;
export type LeadSubmitDto = z.infer<typeof leadSubmitSchema>;
