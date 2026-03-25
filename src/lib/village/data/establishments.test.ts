import { describe, expect, it } from "vitest";
import {
  establishmentLine,
  establishmentLineFromSizeTier,
  rankUsesEstablishmentSizeTiers,
} from "./establishments";
import { testLocalize } from "@/lib/localization/testLocalize";

describe("establishments", () => {
  it("rankUsesEstablishmentSizeTiers is true for ranks 2–8 only", () => {
    expect(rankUsesEstablishmentSizeTiers("2")).toBe(true);
    expect(rankUsesEstablishmentSizeTiers("8")).toBe(true);
    expect(rankUsesEstablishmentSizeTiers("9")).toBe(false);
    expect(rankUsesEstablishmentSizeTiers("A")).toBe(false);
    expect(rankUsesEstablishmentSizeTiers("10")).toBe(false);
  });

  it("establishmentLineFromSizeTier throws for ranks outside the tier table", () => {
    expect(() => establishmentLineFromSizeTier("9", 1, testLocalize)).toThrow(/rank 9/);
  });

  it("establishmentLine maps tier ranks to red vs black size bands", () => {
    const redLine = establishmentLine({ rank: "4", suit: "diamonds" }, testLocalize);
    const blackLine = establishmentLine({ rank: "4", suit: "spades" }, testLocalize);
    expect(redLine).toBe(establishmentLineFromSizeTier("4", 2, testLocalize));
    expect(blackLine).toBe(establishmentLineFromSizeTier("4", 1, testLocalize));
    expect(redLine).not.toBe(blackLine);
  });

  it("establishmentLine resolves A, 9, and 10 from the non-tier copy table", () => {
    expect(establishmentLine({ rank: "A", suit: "hearts" }, testLocalize)).toBeTruthy();
    expect(establishmentLine({ rank: "A", suit: "clubs" }, testLocalize)).toBeTruthy();
    expect(establishmentLine({ rank: "9", suit: "hearts" }, testLocalize)).toBeTruthy();
    expect(establishmentLine({ rank: "9", suit: "clubs" }, testLocalize)).toBeTruthy();
    expect(establishmentLine({ rank: "10", suit: "spades" }, testLocalize)).toBeTruthy();
  });

  it("establishmentLine rejects face establishment ranks", () => {
    expect(() =>
      establishmentLine({ rank: "J", suit: "hearts" }, testLocalize),
    ).toThrow(/face card/);
  });
});
