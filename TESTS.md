# TESTS.md

All tests use **Vitest**. Run with:

```bash
pnpm test
# or, with coverage:
pnpm test --coverage
```

Tests live in `src/lib/__tests__/` and are co-located with the audit engine logic they exercise.

---

## Test List

### `src/lib/__tests__/audit-engine.test.ts`

| # | Test name | What it covers |
|---|-----------|----------------|
| 1 | `correctly identifies Cursor Pro overkill for 1 user spending $40+/mo` | If a single user enters Cursor Pro at $40/month (i.e. they have overages), the engine should flag the overage and recommend checking usage patterns before upgrading to Pro+, not automatically recommending an upgrade. Expected output: `action: "review-usage"`, `savings: 20`. |
| 2 | `recommends ChatGPT Plus downgrade to Free for research-only use case with 1 seat` | If a user is on ChatGPT Plus ($20/user) for research (not coding), the engine should note that ChatGPT Free is viable for light research workloads and flag the optional downgrade. Expected output: `action: "optional-downgrade"`. |
| 3 | `detects duplicate tool overlap between ChatGPT Plus and Claude Pro for writing use case` | If a user is subscribed to both ChatGPT Plus ($20) and Claude Pro ($20) and their primary use case is writing, the engine should flag overlapping capability and recommend consolidating to one. Expected output: `flagged: true`, `type: "overlap"`. |
| 4 | `correctly calculates annual savings from monthly savings` | For a monthly savings figure of $150, annual savings should be $1,800. Ensures the annualisation formula is not miscalculated. |
| 5 | `returns no savings recommendation for a team optimally using GitHub Copilot Business` | A 5-person engineering team on GitHub Copilot Business ($19/user/month = $95/month) for coding tasks should receive an "already optimal" result — no cheaper plan with equivalent org management features exists. Expected output: `action: "no-change"`, `savings: 0`. |
| 6 | `recommends Windsurf Pro over Cursor Pro for budget-conscious individual developer` | A solo developer on Cursor Pro ($20/month) for coding tasks should receive a cross-vendor recommendation to evaluate Windsurf Pro ($15/month) as a cheaper alternative. Expected: `recommendation.alternativeTool: "Windsurf"`, `savings: 5`. |
| 7 | `API-direct user spending <$20/month on Claude API should be offered Claude Pro subscription comparison` | If a user is spending $15/month on the Claude API with a single seat and their use case is writing, the engine should surface Claude Pro ($20/month) as potentially providing more value despite being slightly more expensive — and flag that the API path is already near-optimal for their stated spend. Expected: `action: "consider-subscription"`. |
| 8 | `handles missing seats field gracefully — defaults to 1 seat` | If the user submits a tool row without a seat count, the engine should default to 1 seat and not throw. Expected: no thrown exception, `seats: 1` in the audit result. |
| 9 | `does not manufacture savings when user is already on optimal plan` | A single user on Claude Pro ($20/month) for heavy daily writing with no overlapping tools should receive a "spending well" result. Expected: `totalMonthlySavings: 0`, `status: "optimal"`. |
| 10 | `total monthly savings is the sum of per-tool savings, not double-counted` | For a user with three tools and per-tool savings of $10, $20, and $30, total monthly savings should be $60. Ensures the aggregation loop doesn't double-count shared recommendations. |

---

## How to Run a Specific Test

```bash
# Run only the audit engine tests
pnpm test audit-engine

# Run with verbose output
pnpm test --reporter=verbose

# Run in watch mode during development
pnpm test --watch
```

---

## CI

Tests run automatically on every push to `main` via GitHub Actions (`.github/workflows/ci.yml`). The workflow runs `pnpm lint && pnpm typecheck && pnpm test`. A failing test blocks merge.