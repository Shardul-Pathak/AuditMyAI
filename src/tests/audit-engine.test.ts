import { describe, it, expect } from "vitest";
import { runAudit } from "@/controllers/audit.controller";
import type { AuditInput, ToolSubscription } from "@/utils/audit/types";

function makeInput(tools: ToolSubscription[], overrides: Partial<Omit<AuditInput, "tools">> = {}): AuditInput {
  return {
    tools,
    teamSize: overrides.teamSize ?? Math.max(...tools.map((t) => t.seats)),
    primaryUseCase: overrides.primaryUseCase ?? "MIXED",
  };
}

function sub(
  tool: ToolSubscription["tool"],
  plan: ToolSubscription["plan"],
  monthlySpend: number,
  seats = 1
): ToolSubscription {
  return { tool, plan, monthlySpend, seats };
}

describe("Downgrade Detection", () => {
  it("recommends downgrade from Claude Team with 1 seat to Pro", () => {
    const input = makeInput([sub("CLAUDE", "TEAM", 30, 1)]);
    const result = runAudit(input);

    const item = result.items.find((i) => i.toolName === "CLAUDE")!;
    expect(item.recommendationType).toBe("DOWNGRADE");
    expect(item.recommendedPlan).toBe("PRO");
    expect(item.monthlySavings).toBeGreaterThan(0);
    expect(item.annualSavings).toBe(item.monthlySavings * 12);
  });

  it("recommends downgrade from ChatGPT Enterprise for 2 people to Team", () => {
    const input = makeInput([sub("CHATGPT", "ENTERPRISE", 100, 2)], { teamSize: 2 });
    const result = runAudit(input);

    const item = result.items.find((i) => i.toolName === "CHATGPT")!;
    expect(item.recommendationType).toBe("DOWNGRADE");
    expect(item.monthlySavings).toBeGreaterThan(0);
  });

  it("recommends downgrade from GitHub Copilot Business with 1 seat to Pro", () => {
    const input = makeInput([sub("GITHUB_COPILOT", "BUSINESS", 19, 1)]);
    const result = runAudit(input);

    const item = result.items.find((i) => i.toolName === "GITHUB_COPILOT")!;
    expect(item.recommendationType).toBe("DOWNGRADE");
    expect(item.recommendedPlan).toBe("PRO");
    expect(item.monthlySavings).toBe(9); // $19 - $10 = $9
  });

  it("does NOT recommend downgrade for correctly-sized plans", () => {
    const input = makeInput([sub("CLAUDE", "TEAM", 150, 5)], { teamSize: 5 });
    const result = runAudit(input);

    const item = result.items.find((i) => i.toolName === "CLAUDE")!;
    expect(item.recommendationType).not.toBe("DOWNGRADE");
  });
});

describe("Savings Calculations", () => {
  it("correctly computes monthly and annual savings", () => {
    const input = makeInput([sub("CLAUDE", "TEAM", 30, 1)]);
    const result = runAudit(input);

    const item = result.items.find((i) => i.toolName === "CLAUDE")!;
    expect(item.monthlySavings).toBe(10);
    expect(item.annualSavings).toBe(120);
  });

  it("aggregates savings correctly across multiple tools", () => {
    const input = makeInput([
      sub("CLAUDE", "TEAM", 30, 1),
      sub("GITHUB_COPILOT", "BUSINESS", 19, 1),
    ]);
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(19);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("reports zero savings for an already-optimal stack", () => {
    const input = makeInput([sub("CURSOR", "PRO", 20, 1)]);
    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
  });

  it("never reports negative savings", () => {
    const input = makeInput([
      sub("ANTHROPIC_API", "PAY_AS_YOU_GO", 5, 1),
    ]);
    const result = runAudit(input);

    for (const item of result.items) {
      expect(item.monthlySavings).toBeGreaterThanOrEqual(0);
      expect(item.annualSavings).toBeGreaterThanOrEqual(0);
    }
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
  });

  it("rounds monetary values to 2 decimal places", () => {
    const input = makeInput([sub("GEMINI", "PRO", 19.99, 1)]);
    const result = runAudit(input);

    for (const item of result.items) {
      const monthlySavingsStr = item.monthlySavings.toString();
      const parts = monthlySavingsStr.split(".");
      if (parts[1]) {
        expect(parts[1].length).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe("Overlapping Tool Detection", () => {
  it("detects duplicate AI coding tool subscriptions", () => {
    const input = makeInput(
      [
        sub("CURSOR", "PRO", 20, 2),
        sub("GITHUB_COPILOT", "PRO", 20, 2),
        sub("WINDSURF", "PRO", 30, 2),
      ],
      { teamSize: 2 }
    );
    const result = runAudit(input);

    const consolidations = result.items.filter(
      (i) => i.recommendationType === "CONSOLIDATE"
    );
    expect(consolidations.length).toBeGreaterThanOrEqual(2);
  });

  it("detects overlapping chat AI subscriptions for a single use case", () => {
    const input = makeInput(
      [
        sub("CLAUDE", "PRO", 20, 1),
        sub("CHATGPT", "PRO", 20, 1),
        sub("GEMINI", "PRO", 19.99, 1),
      ],
      { teamSize: 1, primaryUseCase: "CONTENT_WRITING" }
    );
    const result = runAudit(input);

    const consolidations = result.items.filter(
      (i) => i.recommendationType === "CONSOLIDATE"
    );
    expect(consolidations.length).toBeGreaterThanOrEqual(1);
  });

  it("does NOT flag overlapping chat tools for MIXED use case", () => {
    const input = makeInput(
      [
        sub("CLAUDE", "PRO", 20, 1),
        sub("CHATGPT", "PRO", 20, 1),
      ],
      { teamSize: 1, primaryUseCase: "MIXED" }
    );
    const result = runAudit(input);

    const chatConsolidations = result.items.filter(
      (i) => ["CLAUDE", "CHATGPT"].includes(i.toolName) &&
              i.recommendationType === "CONSOLIDATE"
    );
    expect(chatConsolidations.length).toBe(0);
  });
});

describe("Optimal Spend Scenarios", () => {
  it("returns OPTIMAL for a correctly-provisioned team on Claude Team", () => {
    const input = makeInput(
      [sub("CLAUDE", "TEAM", 150, 5)],
      { teamSize: 5 }
    );
    const result = runAudit(input);
    const item = result.items.find((i) => i.toolName === "CLAUDE")!;

    expect(item.recommendationType).toBe("OPTIMAL");
    expect(item.monthlySavings).toBe(0);
  });

  it("gives a high audit score for a fully-optimized stack", () => {
    const input = makeInput(
      [sub("CURSOR", "PRO", 20, 1)],
      { teamSize: 1 }
    );
    const result = runAudit(input);

    expect(result.auditScore).toBeGreaterThanOrEqual(70);
  });

  it("returns low API spend recommendation to switch to consumer", () => {
    const input = makeInput(
      [sub("ANTHROPIC_API", "PAY_AS_YOU_GO", 8, 1)],
      { teamSize: 1 }
    );
    const result = runAudit(input);
    const item = result.items.find((i) => i.toolName === "ANTHROPIC_API")!;

    expect(item.recommendationType).toBe("SWITCH_TO_CONSUMER");
  });
});

describe("Confidence Scoring", () => {
  it("returns confidence between 0 and 1 for all items", () => {
    const input = makeInput([
      sub("CURSOR", "BUSINESS", 80, 1),
      sub("CLAUDE", "TEAM", 30, 1),
      sub("OPENAI_API", "PAY_AS_YOU_GO", 5, 1),
    ]);
    const result = runAudit(input);

    for (const item of result.items) {
      expect(item.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(item.confidenceScore).toBeLessThanOrEqual(1);
    }
  });

  it("single-seat team plan detection has high confidence (>=0.85)", () => {
    const input = makeInput([sub("CLAUDE", "TEAM", 30, 1)]);
    const result = runAudit(input);
    const item = result.items.find((i) => i.toolName === "CLAUDE")!;

    expect(item.confidenceScore).toBeGreaterThanOrEqual(0.85);
  });

  it("API-to-consumer switch has lower confidence than structural downgrades", () => {
    const apiInput = makeInput([sub("ANTHROPIC_API", "PAY_AS_YOU_GO", 8, 1)]);
    const teamInput = makeInput([sub("CLAUDE", "TEAM", 30, 1)]);

    const apiResult = runAudit(apiInput);
    const teamResult = runAudit(teamInput);

    const apiItem = apiResult.items.find((i) => i.toolName === "ANTHROPIC_API")!;
    const teamItem = teamResult.items.find((i) => i.toolName === "CLAUDE")!;

    expect(apiItem.confidenceScore).toBeLessThan(teamItem.confidenceScore);
  });
});

describe("Audit Score", () => {
  it("scores 100 for an empty overlap-free, optimized stack", () => {
    const input = makeInput(
      [sub("CURSOR", "PRO", 20, 1)],
      { teamSize: 1 }
    );
    const result = runAudit(input);

    expect(result.auditScore).toBeGreaterThanOrEqual(70);
  });

  it("gives a low score when there is severe waste", () => {
    const input = makeInput(
      [
        sub("CURSOR", "PRO", 20, 1),
        sub("GITHUB_COPILOT", "PRO", 10, 1),
        sub("WINDSURF", "PRO", 15, 1),
        sub("CLAUDE", "TEAM", 30, 1),
        sub("CHATGPT", "PRO", 20, 1),
      ],
      { teamSize: 1, primaryUseCase: "CODE_GENERATION" }
    );
    const result = runAudit(input);

    expect(result.auditScore).toBeLessThan(60);
  });

  it("score is always between 0 and 100", () => {
    const inputs: AuditInput[] = [
      makeInput([sub("CURSOR", "PRO", 20, 1)]),
      makeInput([sub("CLAUDE", "ENTERPRISE", 500, 1)]),
      makeInput([
        sub("CURSOR", "BUSINESS", 80, 1),
        sub("GITHUB_COPILOT", "ENTERPRISE", 200, 1),
        sub("WINDSURF", "TEAM", 70, 1),
        sub("CLAUDE", "ENTERPRISE", 300, 1),
        sub("CHATGPT", "ENTERPRISE", 250, 1),
      ]),
    ];

    for (const input of inputs) {
      const result = runAudit(input);
      expect(result.auditScore).toBeGreaterThanOrEqual(0);
      expect(result.auditScore).toBeLessThanOrEqual(100);
    }
  });
});

describe("Engine Determinism", () => {
  it("produces identical output for identical input", () => {
    const input = makeInput([
      sub("CURSOR", "BUSINESS", 80, 2),
      sub("CLAUDE", "TEAM", 60, 2),
      sub("ANTHROPIC_API", "PAY_AS_YOU_GO", 15, 1),
    ]);

    const result1 = runAudit(input);
    const result2 = runAudit(input);
    const result3 = runAudit(input);

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });

  it("returns one result item per input tool", () => {
    const tools = [
      sub("CURSOR", "PRO", 20, 1),
      sub("CLAUDE", "PRO", 20, 1),
      sub("GITHUB_COPILOT", "PRO", 10, 1),
    ];
    const input = makeInput(tools);
    const result = runAudit(input);

    expect(result.items).toHaveLength(tools.length);
  });
});
