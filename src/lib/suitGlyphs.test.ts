import { describe, expect, it } from "vitest";
import { suitIsRed } from "./suitGlyphs";

describe("suitIsRed", () => {
  it("marks hearts and diamonds as red", () => {
    expect(suitIsRed("hearts")).toBe(true);
    expect(suitIsRed("diamonds")).toBe(true);
  });

  it("marks clubs and spades as not red", () => {
    expect(suitIsRed("clubs")).toBe(false);
    expect(suitIsRed("spades")).toBe(false);
  });
});
