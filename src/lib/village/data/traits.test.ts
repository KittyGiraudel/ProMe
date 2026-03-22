import { describe, expect, it } from "vitest";
import { villageTraitText } from "./traits";

describe("villageTraitText", () => {
  it("selects red vs black copy for each face rank", () => {
    expect(villageTraitText({ rank: "J", suit: "hearts" })).toContain("Ville");
    expect(villageTraitText({ rank: "J", suit: "clubs" })).toContain("Merveille");
    expect(villageTraitText({ rank: "Q", suit: "diamonds" })).toBeTruthy();
    expect(villageTraitText({ rank: "Q", suit: "spades" })).toBeTruthy();
    expect(villageTraitText({ rank: "K", suit: "hearts" })).toBeTruthy();
    expect(villageTraitText({ rank: "K", suit: "clubs" })).toBeTruthy();
  });

  it("rejects numbered ranks", () => {
    expect(() =>
      villageTraitText({ rank: "5", suit: "hearts" }),
    ).toThrow(/face card/);
  });
});
