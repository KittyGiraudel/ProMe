import { describe, expect, it } from "vitest";
import {
  decodeCharacterRollParam,
  encodeCharacterRoll,
} from "./characterUrlCodec";
import { lookupName } from "./data/namesByRace";
import { contextByRank } from "@/messages/fr";
import { genderFromD6, raceFromD6 } from "./maps";

describe("characterUrlCodec", () => {
  it("decodes legacy 8-char and round-trips through v2 encode", () => {
    const legacy = "1H2C3111";
    const roll = decodeCharacterRollParam(legacy);
    expect(roll).not.toBeNull();
    expect(roll!.ageCard).toEqual(roll!.personalityCard);
    expect(encodeCharacterRoll(roll!)).toBe("1H2H2C3111");
    expect(decodeCharacterRollParam(encodeCharacterRoll(roll!))).toEqual(roll);
  });

  it("decodes legacy context rank 7 and round-trips", () => {
    const legacy = "1H2C71115";
    const roll = decodeCharacterRollParam(legacy);
    expect(roll).not.toBeNull();
    expect(roll!.contextCard.rank).toBe("7");
    expect(roll!.contextSevenDie).toBe(5);
    expect(encodeCharacterRoll(roll!)).toBe("1H2H2C71115");
    expect(decodeCharacterRollParam(encodeCharacterRoll(roll!))).toEqual(roll);
  });

  it("decodes legacy context rank 10 with two spoken-name dice", () => {
    const legacy = "1H2DT31111";
    const roll = decodeCharacterRollParam(legacy);
    expect(roll).not.toBeNull();
    expect(roll!.contextCard.rank).toBe("10");
    expect(roll!.contextSpokenNameDice).toEqual([1, 1]);
    expect(roll!.contextSpokenName).toBeDefined();
    expect(encodeCharacterRoll(roll!)).toBe("1H2H2DT31111");
    expect(decodeCharacterRollParam(encodeCharacterRoll(roll!))).toEqual(roll);
  });

  it("round-trips v2 when age and personality cards differ", () => {
    const raceDie = 1;
    const race = raceFromD6(raceDie);
    const nameDice: [number, number] = [2, 3];
    const roll = {
      raceDie,
      race,
      ageCard: { suit: "hearts" as const, rank: "5" as const },
      personalityCard: { suit: "spades" as const, rank: "K" as const },
      contextCard: { suit: "clubs" as const, rank: "3" as const },
      nameDice,
      name: lookupName(race, nameDice[0], nameDice[1]),
      contextText: contextByRank["3"],
      genderDie: 4,
      gender: genderFromD6(4),
    };
    const encoded = encodeCharacterRoll(roll);
    expect(encoded).toBe("1H5SKC3234");
    expect(decodeCharacterRollParam(encoded)).toEqual(roll);
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
