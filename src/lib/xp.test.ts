import { describe, expect, it } from "vitest";

function computeLevel(xp: number) {
  return Math.floor(1 + Math.sqrt(xp / 100));
}

describe("computeLevel", () => {
  it("levels up with xp", () => {
    expect(computeLevel(0)).toBe(1);
    expect(computeLevel(100)).toBe(2);
    expect(computeLevel(400)).toBe(3);
  });
});


