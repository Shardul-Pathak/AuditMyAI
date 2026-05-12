import type { AiTool, PlanTier, PricingUnit, ToolPricing } from "@/utils/audit/types";

function plan(
  plan: PlanTier,
  monthlyPrice: number,
  pricingUnit: PricingUnit,
  options: { isEnterprise?: boolean; minSeats?: number; maxSeats?: number } = {}
) {
  return {
    plan,
    monthlyPrice,
    pricingUnit,
    isEnterprise: options.isEnterprise ?? false,
    minSeats: options.minSeats,
    maxSeats: options.maxSeats,
  };
}

const PRICING_REGISTRY: Record<AiTool, ToolPricing> = {
  CURSOR: {
    tool: "CURSOR",
    displayName: "Cursor",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        20,    "PER_SEAT_MONTHLY",  { minSeats: 1 }),
      plan("BUSINESS",   40,    "PER_SEAT_MONTHLY",  { minSeats: 2 }),
      plan("ENTERPRISE", 0,     "PER_SEAT_MONTHLY",  { isEnterprise: true, minSeats: 20 }),
    ],
  },

  GITHUB_COPILOT: {
    tool: "GITHUB_COPILOT",
    displayName: "GitHub Copilot",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        10,    "PER_SEAT_MONTHLY",  { minSeats: 1 }),
      plan("BUSINESS",   19,    "PER_SEAT_MONTHLY",  { minSeats: 1 }),
      plan("ENTERPRISE", 39,    "PER_SEAT_MONTHLY",  { isEnterprise: true, minSeats: 1 }),
    ],
  },

  CLAUDE: {
    tool: "CLAUDE",
    displayName: "Claude (Anthropic)",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        20,    "PER_SEAT_MONTHLY",  { minSeats: 1, maxSeats: 1 }),
      plan("TEAM",       30,    "PER_SEAT_MONTHLY",  { minSeats: 5 }),
      plan("ENTERPRISE", 0,     "PER_SEAT_MONTHLY",  { isEnterprise: true, minSeats: 25 }),
    ],
  },

  CHATGPT: {
    tool: "CHATGPT",
    displayName: "ChatGPT (OpenAI)",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        20,    "PER_SEAT_MONTHLY",  { minSeats: 1, maxSeats: 1 }),
      plan("TEAM",       25,    "PER_SEAT_MONTHLY",  { minSeats: 2 }),
      plan("ENTERPRISE", 0,     "PER_SEAT_MONTHLY",  { isEnterprise: true, minSeats: 50 }),
    ],
  },

  ANTHROPIC_API: {
    tool: "ANTHROPIC_API",
    displayName: "Anthropic API",
    plans: [
      plan("PAY_AS_YOU_GO", 0,  "PER_TOKEN",        {}),
      plan("CUSTOM",        0,  "CREDIT_BASED",     { isEnterprise: true }),
    ],
  },

  OPENAI_API: {
    tool: "OPENAI_API",
    displayName: "OpenAI API",
    plans: [
      plan("PAY_AS_YOU_GO", 0,  "PER_TOKEN",        {}),
      plan("CUSTOM",        0,  "CREDIT_BASED",     { isEnterprise: true }),
    ],
  },

  GEMINI: {
    tool: "GEMINI",
    displayName: "Google Gemini",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        19.99, "PER_SEAT_MONTHLY",  { minSeats: 1, maxSeats: 1 }),
      plan("BUSINESS",   30,    "PER_SEAT_MONTHLY",  { minSeats: 1 }),
      plan("ENTERPRISE", 0,     "PER_SEAT_MONTHLY",  { isEnterprise: true }),
    ],
  },

  WINDSURF: {
    tool: "WINDSURF",
    displayName: "Windsurf (Codeium)",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        15,    "PER_SEAT_MONTHLY",  { minSeats: 1 }),
      plan("TEAM",       35,    "PER_SEAT_MONTHLY",  { minSeats: 2 }),
      plan("ENTERPRISE", 0,     "PER_SEAT_MONTHLY",  { isEnterprise: true }),
    ],
  },

  V0: {
    tool: "V0",
    displayName: "v0 (Vercel)",
    plans: [
      plan("FREE",       0,     "FLAT_MONTHLY",     { maxSeats: 1 }),
      plan("PRO",        20,    "PER_SEAT_MONTHLY",  { minSeats: 1 }),
      plan("TEAM",       0,     "PER_SEAT_MONTHLY",  { isEnterprise: true }),
    ],
  },
};

export function getToolPricing(tool: AiTool): ToolPricing {
  const pricing = PRICING_REGISTRY[tool];
  if (!pricing) throw new Error(`No pricing data found for tool: ${tool}`);
  return pricing;
}

export function getPlanPricing(tool: AiTool, planTier: PlanTier) {
  const toolPricing = getToolPricing(tool);
  return toolPricing.plans.find((p) => p.plan === planTier) ?? null;
}

export function calculateMonthlyCost(tool: AiTool, planTier: PlanTier, seats: number): number {
  const planData = getPlanPricing(tool, planTier);
  if (!planData) return 0;

  switch (planData.pricingUnit) {
    case "PER_SEAT_MONTHLY":
      return planData.monthlyPrice * seats;
    case "FLAT_MONTHLY":
      return planData.monthlyPrice;
    case "PER_TOKEN":
    case "CREDIT_BASED":
      return 0;
    default:
      return planData.monthlyPrice;
  }
}

export function getAvailablePlans(tool: AiTool, excludeEnterprise = false) {
  const pricing = getToolPricing(tool);
  return excludeEnterprise
    ? pricing.plans.filter((p) => !p.isEnterprise)
    : pricing.plans;
}

export { PRICING_REGISTRY };
