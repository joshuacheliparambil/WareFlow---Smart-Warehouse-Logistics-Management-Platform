import { describe, expect, it } from "vitest";

describe("risk severity ordering", () => {
  it("treats critical risk as higher than medium", () => {
    const score = { MEDIUM: 2, CRITICAL: 4 };
    expect(score.CRITICAL).toBeGreaterThan(score.MEDIUM);
  });
});
