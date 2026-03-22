import { describe, expect, it } from "vitest";
import { isFaceRank } from "./types";

describe("types / isFaceRank", () => {
  it("is true only for J, Q, K", () => {
    expect(isFaceRank("J")).toBe(true);
    expect(isFaceRank("Q")).toBe(true);
    expect(isFaceRank("K")).toBe(true);
  });

  it("is false for numbered ranks and ace", () => {
    for (const rank of ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"] as const) {
      expect(isFaceRank(rank)).toBe(false);
    }
  });
});
