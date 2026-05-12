export type AiTool =
  | "CURSOR"
  | "GITHUB_COPILOT"
  | "CLAUDE"
  | "CHATGPT"
  | "ANTHROPIC_API"
  | "OPENAI_API"
  | "GEMINI"
  | "WINDSURF"
  | "V0";

export type PlanTier =
  | "FREE"
  | "PRO"
  | "TEAM"
  | "BUSINESS"
  | "ENTERPRISE"
  | "CUSTOM"
  | "PAY_AS_YOU_GO";

export type RecommendationType =
  | "DOWNGRADE"
  | "UPGRADE"
  | "SWITCH_TOOL"
  | "CONSOLIDATE"
  | "SWITCH_TO_API"
  | "SWITCH_TO_CONSUMER"
  | "OPTIMAL";

export type PricingUnit =
  | "PER_SEAT_MONTHLY"
  | "FLAT_MONTHLY"
  | "PER_TOKEN"
  | "PER_REQUEST"
  | "CREDIT_BASED";

export type UseCase =
  | "CODE_GENERATION"
  | "CONTENT_WRITING"
  | "DATA_ANALYSIS"
  | "CUSTOMER_SUPPORT"
  | "RESEARCH"
  | "GENERAL_PRODUCTIVITY"
  | "MIXED";

export interface ToolSubscription {
  tool: AiTool;
  plan: PlanTier;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolSubscription[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface AuditItemResult {
  toolName: AiTool;
  currentPlan: PlanTier;
  recommendedPlan: PlanTier;
  currentMonthlyCost: number;
  recommendedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  recommendationType: RecommendationType;
  reasoning: string;
  confidenceScore: number;
}

export interface AuditResult {
  items: AuditItemResult[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  auditScore: number;
  summary: string;
}

export interface PlanPricing {
  plan: PlanTier;
  monthlyPrice: number;
  pricingUnit: PricingUnit;
  isEnterprise: boolean;
  minSeats?: number;
  maxSeats?: number;
}

export interface ToolPricing {
  tool: AiTool;
  displayName: string;
  plans: PlanPricing[];
}

export interface RuleContext {
  subscription: ToolSubscription;
  toolPricing: ToolPricing;
  allSubscriptions: ToolSubscription[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export type RuleResult = Omit<AuditItemResult, "toolName"> | null;

export interface AuditRule {
  name: string;
  description: string;
  priority: number;
  evaluate(context: RuleContext): RuleResult;
}

export interface PublicAuditReportDto {
  publicId: string;
  createdAt: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  teamSize: number;
  primaryUseCase: UseCase;
  summary: string;
  auditScore: number;
  items: AuditItemResult[];
}

export type LeadCompanySizeBucket = "1" | "1-10" | "11-50" | "50+";

export interface CreateLeadInput {
  email: string;
  companyName: string;
  firstName: string;
  lastName: string;
  companySize: LeadCompanySizeBucket;
  reportPublicId?: string;
}

export interface LeadDto {
  id: string;
  email: string;
  companyName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  /** Stored enum label from Prisma, e.g. `ONE`, `TWO_TO_TEN`. */
  companySize?: string | null;
  createdAt: string;
}
