import { calculateMonthlyCost, getAvailablePlans } from "@/utils/prices";
import type { AuditRule, RuleContext, RuleResult } from "./types";

function savings(current: number, recommended: number) {
  const monthly = Math.max(0, current - recommended);
  return { monthly, annual: monthly * 12 };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const singleSeatDowngradeRule: AuditRule = {
  name: "single-seat-downgrade",
  description: "Detects team/business plans with a single seat",
  priority: 10,

  evaluate({ subscription, toolPricing }: RuleContext): RuleResult {
    const { plan, seats, monthlySpend } = subscription;
    if (seats !== 1) return null;
    if (!["TEAM", "BUSINESS", "ENTERPRISE"].includes(plan)) return null;
    const singleSeatPlans = getAvailablePlans(toolPricing.tool, true).filter(
      (p) => p.monthlyPrice > 0 && (!p.minSeats || p.minSeats <= 1)
    );

    const bestSingleSeat = singleSeatPlans.length
      ? singleSeatPlans.reduce((best, p) =>
          p.monthlyPrice < best.monthlyPrice ? p : best
        )
      : undefined;

    if (!bestSingleSeat || bestSingleSeat.plan === plan) return null;

    const recommendedCost = bestSingleSeat.monthlyPrice;
    const { monthly, annual } = savings(monthlySpend, recommendedCost);

    if (monthly <= 0) return null;

    return {
      currentPlan: plan,
      recommendedPlan: bestSingleSeat.plan,
      currentMonthlyCost: round2(monthlySpend),
      recommendedMonthlyCost: round2(recommendedCost),
      monthlySavings: round2(monthly),
      annualSavings: round2(annual),
      recommendationType: "DOWNGRADE",
      reasoning: `You're on ${plan} with only 1 seat. Downgrading to ${bestSingleSeat.plan} gives you equivalent single-user access at $${recommendedCost}/month — saving $${monthly}/month.`,
      confidenceScore: 0.95,
    };
  },
};

export const smallTeamDowngradeRule: AuditRule = {
  name: "small-team-downgrade",
  description: "Detects enterprise/business plans for very small teams (<5 seats)",
  priority: 20,

  evaluate({ subscription, toolPricing }: RuleContext): RuleResult {
    const { plan, seats, monthlySpend } = subscription;

    if (seats >= 5) return null;
    if (!["ENTERPRISE", "BUSINESS"].includes(plan)) return null;

    const teamPlan = getAvailablePlans(toolPricing.tool, true).find(
      (p) => p.plan === "TEAM" || p.plan === "PRO"
    );

    if (!teamPlan) return null;

    const recommendedCost =
      teamPlan.pricingUnit === "PER_SEAT_MONTHLY"
        ? calculateMonthlyCost(toolPricing.tool, teamPlan.plan, seats)
        : teamPlan.monthlyPrice;

    const { monthly, annual } = savings(monthlySpend, recommendedCost);
    if (monthly <= 0) return null;

    return {
      currentPlan: plan,
      recommendedPlan: teamPlan.plan,
      currentMonthlyCost: round2(monthlySpend),
      recommendedMonthlyCost: round2(recommendedCost),
      monthlySavings: round2(monthly),
      annualSavings: round2(annual),
      recommendationType: "DOWNGRADE",
      reasoning: `With only ${seats} seats, ${plan} is oversized. ${teamPlan.plan} covers your team at $${recommendedCost}/month — $${monthly}/month less.`,
      confidenceScore: 0.85,
    };
  },
};

const API_TO_CONSUMER_THRESHOLDS: Partial<Record<string, { threshold: number; consumerTool: string; consumerPlan: string }>> = {
  OPENAI_API:     { threshold: 25,  consumerTool: "CHATGPT",       consumerPlan: "PRO" },
  ANTHROPIC_API:  { threshold: 25,  consumerTool: "CLAUDE",        consumerPlan: "PRO" },
};

export const lowApiSpendRule: AuditRule = {
  name: "low-api-spend-consumer-switch",
  description: "Recommends consumer plans when API spend is below consumer plan cost",
  priority: 30,

  evaluate({ subscription }: RuleContext): RuleResult {
    const { tool, monthlySpend } = subscription;
    const config = API_TO_CONSUMER_THRESHOLDS[tool];
    if (!config) return null;
    if (monthlySpend > config.threshold) return null;

    const consumerPlanCost = 20;
    const { monthly, annual } = savings(monthlySpend > consumerPlanCost ? monthlySpend : 0, consumerPlanCost);

    return {
      currentPlan: "PAY_AS_YOU_GO",
      recommendedPlan: "PRO" as const,
      currentMonthlyCost: round2(monthlySpend),
      recommendedMonthlyCost: round2(consumerPlanCost),
      monthlySavings: round2(monthly),
      annualSavings: round2(annual),
      recommendationType: "SWITCH_TO_CONSUMER",
      reasoning: `Your API spend of $${monthlySpend}/month is low. A ${config.consumerTool} ${config.consumerPlan} subscription ($${consumerPlanCost}/month) gives unlimited access for typical usage patterns — and may cost less overall.`,
      confidenceScore: 0.75,
    };
  },
};

export const highConsumerSpendApiRule: AuditRule = {
  name: "high-consumer-spend-api-switch",
  description: "Recommends API migration when consumer plan use is maxed out",
  priority: 35,

  evaluate({ subscription, primaryUseCase }: RuleContext): RuleResult {
    const { tool, plan, monthlySpend, seats } = subscription;
    if (!["CLAUDE", "CHATGPT"].includes(tool)) return null;
    if (!["ENTERPRISE", "BUSINESS"].includes(plan)) return null;
    if (!["CODE_GENERATION", "DATA_ANALYSIS"].includes(primaryUseCase)) return null;
    const costPerSeat = monthlySpend / seats;
    if (costPerSeat < 40) return null;
    const estimatedApiCost = round2(monthlySpend * 0.6);
    const { monthly, annual } = savings(monthlySpend, estimatedApiCost);

    return {
      currentPlan: plan,
      recommendedPlan: "PAY_AS_YOU_GO",
      currentMonthlyCost: round2(monthlySpend),
      recommendedMonthlyCost: estimatedApiCost,
      monthlySavings: round2(monthly),
      annualSavings: round2(annual),
      recommendationType: "SWITCH_TO_API",
      reasoning: `For technical teams doing ${primaryUseCase.toLowerCase().replace("_", " ")}, direct API access often reduces cost by 30–40% compared to enterprise consumer plans. Estimated API spend: ~$${estimatedApiCost}/month.`,
      confidenceScore: 0.60,
    };
  },
};

const CODING_TOOLS = new Set(["CURSOR", "GITHUB_COPILOT", "WINDSURF"]);

export const overlappingCodingToolsRule: AuditRule = {
  name: "overlapping-coding-tools",
  description: "Detects multiple AI coding assistant subscriptions",
  priority: 40,

  evaluate({ subscription, allSubscriptions }: RuleContext): RuleResult {
    if (!CODING_TOOLS.has(subscription.tool)) return null;
    const otherCodingTools = allSubscriptions.filter(
      (s) => CODING_TOOLS.has(s.tool) && s.tool !== subscription.tool
    );

    if (otherCodingTools.length === 0) return null;
    const allCodingSpend = [subscription, ...otherCodingTools].reduce(
      (sum, s) => sum + s.monthlySpend, 0
    );

    const recommendedCost = 20;
    const { } = savings(subscription.monthlySpend, 0);

    return {
      currentPlan: subscription.plan,
      recommendedPlan: subscription.plan,
      currentMonthlyCost: round2(subscription.monthlySpend),
      recommendedMonthlyCost: 0,
      monthlySavings: round2(subscription.monthlySpend),
      annualSavings: round2(subscription.monthlySpend * 12),
      recommendationType: "CONSOLIDATE",
      reasoning: `You're paying for ${otherCodingTools.length + 1} overlapping AI coding tools (${[subscription.tool, ...otherCodingTools.map((t) => t.tool)].join(", ")}). Total combined cost: $${allCodingSpend}/month. Consolidating to a single tool (e.g. Cursor Pro at $${recommendedCost}/seat) eliminates $${round2(subscription.monthlySpend)}/month in redundancy.`,
      confidenceScore: 0.90,
    };
  },
};

const CHAT_TOOLS = new Set(["CLAUDE", "CHATGPT", "GEMINI"]);

export const overlappingChatToolsRule: AuditRule = {
  name: "overlapping-chat-tools",
  description: "Detects multiple AI chat subscriptions with overlapping capabilities",
  priority: 45,

  evaluate({ subscription, allSubscriptions, primaryUseCase }: RuleContext): RuleResult {
    if (!CHAT_TOOLS.has(subscription.tool)) return null;
    if (primaryUseCase === "MIXED") return null;

    const otherChatTools = allSubscriptions.filter(
      (s) => CHAT_TOOLS.has(s.tool) && s.tool !== subscription.tool && s.plan !== "FREE"
    );

    if (otherChatTools.length === 0) return null;

    return {
      currentPlan: subscription.plan,
      recommendedPlan: subscription.plan,
      currentMonthlyCost: round2(subscription.monthlySpend),
      recommendedMonthlyCost: 0,
      monthlySavings: round2(subscription.monthlySpend),
      annualSavings: round2(subscription.monthlySpend * 12),
      recommendationType: "CONSOLIDATE",
      reasoning: `Multiple AI chat subscriptions detected (${[subscription.tool, ...otherChatTools.map((t) => t.tool)].join(", ")}). Since your primary use case is ${primaryUseCase.toLowerCase()}, pick the single best-fit tool and cancel the others.`,
      confidenceScore: 0.80,
    };
  },
};

export const optimalPlanRule: AuditRule = {
  name: "optimal-plan",
  description: "Confirms when a subscription is already right-sized",
  priority: 100,

  evaluate({ subscription, toolPricing }: RuleContext): RuleResult {
    const { plan, seats, monthlySpend } = subscription;
    const expectedCost = calculateMonthlyCost(toolPricing.tool, plan, seats);
    const variance = Math.abs(monthlySpend - expectedCost) / Math.max(expectedCost, 1);
    if (variance > 0.05 && expectedCost > 0) return null;

    return {
      currentPlan: plan,
      recommendedPlan: plan,
      currentMonthlyCost: round2(monthlySpend),
      recommendedMonthlyCost: round2(monthlySpend),
      monthlySavings: 0,
      annualSavings: 0,
      recommendationType: "OPTIMAL",
      reasoning: `${toolPricing.displayName} ${plan} is correctly sized for ${seats} seat(s) at $${monthlySpend}/month. No changes recommended.`,
      confidenceScore: 0.70,
    };
  },
};

export const ALL_RULES: AuditRule[] = [
  singleSeatDowngradeRule,
  smallTeamDowngradeRule,
  lowApiSpendRule,
  highConsumerSpendApiRule,
  overlappingCodingToolsRule,
  overlappingChatToolsRule,
  optimalPlanRule,
].sort((a, b) => a.priority - b.priority);
