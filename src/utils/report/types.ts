import { z } from "zod";

const topOpportunitySchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(1000),
  recommendation: z.string().min(1).max(1000),
  businessImpact: z.string().min(1).max(500),
});

const benchmarkInsightsSchema = z.object({
  spendEfficiency: z.string().min(1).max(500),
  toolOverlap: z.string().min(1).max(500),
  operationalRisk: z.string().min(1).max(500),
});

const implementationPhaseSchema = z.object({
  phase: z.string().min(1).max(200),
  objective: z.string().min(1).max(500),
  expectedOutcome: z.string().min(1).max(500),
});

const pageInsightSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(1000),
});

const implementationTimelineSchema = z.object({
  week: z.string().min(1).max(100),
  action: z.string().min(1).max(500),
  expectedSavings: z.string().min(1).max(200),
});

const summaryCardSchema = z.object({
  title: z.string().min(1).max(200),
  value: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

export const generatedReportContentSchema = z.object({
  executiveSummary: z.string().min(50).max(2000),
  stackOverviewSummary: z.string().min(50).max(1000),
  topOpportunities: z.array(topOpportunitySchema).min(1).max(10),
  benchmarkInsights: benchmarkInsightsSchema,
  implementationRoadmap: z.array(implementationPhaseSchema).min(1).max(5),
  finalRecommendation: z.string().min(50).max(1000),
  credexOpportunity: z.string().min(50).max(1000),
  pageInsights: z.array(pageInsightSchema).min(1).max(10),
  implementationTimeline: z.array(implementationTimelineSchema).min(1).max(12),
  summaryCards: z.array(summaryCardSchema).min(1).max(10),
});

export type GeneratedReportContent = z.infer<typeof generatedReportContentSchema>;
