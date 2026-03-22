import { describe, expect, it } from "vitest";
import { mergeEstablishmentSizeTiers } from "./mergeEstablishmentSizeTiers";

describe("mergeEstablishmentSizeTiers", () => {
  it("returns default tier when empty", () => {
    expect(mergeEstablishmentSizeTiers([])).toBe(2);
  });

  it("returns single tier unchanged", () => {
    expect(mergeEstablishmentSizeTiers([1])).toBe(1);
    expect(mergeEstablishmentSizeTiers([2])).toBe(2);
  });

  it("merges pairs: 1+1 → 2, 2+2 → 3, 1+2 → 2", () => {
    expect(mergeEstablishmentSizeTiers([1, 1])).toBe(2);
    expect(mergeEstablishmentSizeTiers([2, 2])).toBe(3);
    expect(mergeEstablishmentSizeTiers([1, 2])).toBe(2);
  });

  it("merges three base tiers left with repeated smallest-first rule", () => {
    expect(mergeEstablishmentSizeTiers([1, 1, 1])).toBe(2);
    expect(mergeEstablishmentSizeTiers([2, 2, 2])).toBe(3);
  });
});
