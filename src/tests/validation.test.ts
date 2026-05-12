import { describe, it, expect } from "vitest";
import { auditInputSchema, createLeadSchema } from "@/utils/audit/validator";

describe("auditInputSchema", () => {
  it("accepts valid input", () => {
    const result = auditInputSchema.safeParse({
      tools: [{ tool: "CURSOR", plan: "PRO", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      primaryUseCase: "CODE_GENERATION",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative monthly spend", () => {
    const result = auditInputSchema.safeParse({
      tools: [{ tool: "CURSOR", plan: "PRO", monthlySpend: -5, seats: 1 }],
      teamSize: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero seats", () => {
    const result = auditInputSchema.safeParse({
      tools: [{ tool: "CURSOR", plan: "PRO", monthlySpend: 20, seats: 0 }],
      teamSize: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty tools array", () => {
    const result = auditInputSchema.safeParse({
      tools: [],
      teamSize: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate tool+plan combinations", () => {
    const result = auditInputSchema.safeParse({
      tools: [
        { tool: "CURSOR", plan: "PRO", monthlySpend: 20, seats: 1 },
        { tool: "CURSOR", plan: "PRO", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects team size smaller than max seat count", () => {
    const result = auditInputSchema.safeParse({
      tools: [{ tool: "CURSOR", plan: "PRO", monthlySpend: 100, seats: 10 }],
      teamSize: 5,
    });
    expect(result.success).toBe(false);
  });

  it("coerces monthly spend to 2 decimal places", () => {
    const result = auditInputSchema.safeParse({
      tools: [{ tool: "CURSOR", plan: "PRO", monthlySpend: 19.999, seats: 1 }],
      teamSize: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tools[0].monthlySpend).toBe(20);
    }
  });

  it("applies default primaryUseCase of MIXED", () => {
    const result = auditInputSchema.safeParse({
      tools: [{ tool: "CURSOR", plan: "PRO", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.primaryUseCase).toBe("MIXED");
    }
  });
});

describe("createLeadSchema", () => {
  const validLead = {
    email: "test@example.com",
    companyName: "Acme Inc",
    firstName: "Jane",
    lastName: "Smith",
    companySize: "1-10" as const,
  };

  it("accepts a valid lead", () => {
    const result = createLeadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("lowercases and trims email", () => {
    const result = createLeadSchema.safeParse({
      ...validLead,
      email: "  TEST@EXAMPLE.COM  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("rejects invalid email", () => {
    const result = createLeadSchema.safeParse({
      ...validLead,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing company name", () => {
    const result = createLeadSchema.safeParse({
      ...validLead,
      companyName: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid company size bucket", () => {
    const result = createLeadSchema.safeParse({
      ...validLead,
      companySize: "99-99",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional reportPublicId", () => {
    const result = createLeadSchema.safeParse({
      ...validLead,
      reportPublicId: "abc123",
    });
    expect(result.success).toBe(true);
  });
});
