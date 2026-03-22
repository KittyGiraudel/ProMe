import { describe, expect, it } from "vitest";
import {
  establishmentLine,
  establishmentLineFromSizeTier,
  rankUsesEstablishmentSizeTiers,
} from "./establishments";

describe("establishments", () => {
  it("rankUsesEstablishmentSizeTiers is true for ranks 2–8 only", () => {
    expect(rankUsesEstablishmentSizeTiers("2")).toBe(true);
    expect(rankUsesEstablishmentSizeTiers("8")).toBe(true);
    expect(rankUsesEstablishmentSizeTiers("9")).toBe(false);
    expect(rankUsesEstablishmentSizeTiers("A")).toBe(false);
    expect(rankUsesEstablishmentSizeTiers("10")).toBe(false);
  });

  it("establishmentLineFromSizeTier throws for ranks outside the tier table", () => {
    expect(() => establishmentLineFromSizeTier("9", 1)).toThrow(/rank 9/);
  });

  it("establishmentLine maps tier ranks to red vs black size bands", () => {
    const redLine = establishmentLine({ rank: "4", suit: "diamonds" });
    const blackLine = establishmentLine({ rank: "4", suit: "spades" });
    expect(redLine).toBe(establishmentLineFromSizeTier("4", 2));
    expect(blackLine).toBe(establishmentLineFromSizeTier("4", 1));
    expect(redLine).not.toBe(blackLine);
  });

  it("establishmentLine resolves A, 9, and 10 from the non-tier copy table", () => {
    expect(establishmentLine({ rank: "A", suit: "hearts" })).toBeTruthy();
    expect(establishmentLine({ rank: "A", suit: "clubs" })).toBeTruthy();
    expect(establishmentLine({ rank: "9", suit: "hearts" })).toBeTruthy();
    expect(establishmentLine({ rank: "9", suit: "clubs" })).toBeTruthy();
    expect(establishmentLine({ rank: "10", suit: "spades" })).toBeTruthy();
  });

  it("establishmentLine rejects face establishment ranks", () => {
    expect(() =>
      establishmentLine({ rank: "J", suit: "hearts" }),
    ).toThrow(/face card/);
  });
});
