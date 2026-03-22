import { describe, expect, it } from "vitest";
import {
  decodeCharacterRollParam,
  encodeCharacterRoll,
} from "./characterUrlCodec";

describe("characterUrlCodec", () => {
  it("round-trips an 8-char roll without context tail", () => {
    const compact = "1H2C3111";
    const roll = decodeCharacterRollParam(compact);
    expect(roll).not.toBeNull();
    expect(encodeCharacterRoll(roll!)).toBe(compact);
    expect(decodeCharacterRollParam(encodeCharacterRoll(roll!))).toEqual(roll);
  });

  it("round-trips context rank 7 with one extra D6", () => {
    const compact = "1H2C71115";
    const roll = decodeCharacterRollParam(compact);
    expect(roll).not.toBeNull();
    expect(roll!.contextCard.rank).toBe("7");
    expect(roll!.contextSevenDie).toBe(5);
    expect(encodeCharacterRoll(roll!)).toBe(compact);
    expect(decodeCharacterRollParam(encodeCharacterRoll(roll!))).toEqual(roll);
  });

  it("round-trips context rank 10 with two spoken-name dice", () => {
    const compact = "1H2DT31111";
    const roll = decodeCharacterRollParam(compact);
    expect(roll).not.toBeNull();
    expect(roll!.contextCard.rank).toBe("10");
    expect(roll!.contextSpokenNameDice).toEqual([1, 1]);
    expect(roll!.contextSpokenName).toBeDefined();
    expect(encodeCharacterRoll(roll!)).toBe(compact);
    expect(decodeCharacterRollParam(encodeCharacterRoll(roll!))).toEqual(roll);
  });

  it("rejects wrong tail for context rank", () => {
    expect(decodeCharacterRollParam("1H2C31115")).toBeNull();
    expect(decodeCharacterRollParam("1H2C711112")).toBeNull();
  });

  it("rejects bad lengths and garbage", () => {
    expect(decodeCharacterRollParam("")).toBeNull();
    expect(decodeCharacterRollParam("1H2C311")).toBeNull();
    expect(decodeCharacterRollParam("1H2C31111X")).toBeNull();
  });
});
