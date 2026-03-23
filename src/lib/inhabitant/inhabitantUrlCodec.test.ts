import { describe, expect, it } from "vitest";
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from "./inhabitantUrlCodec";
import { lookupName } from "./data/namesByRace";
import { contextByRank } from "@/messages/fr";
import { genderFromD6, raceFromD6 } from "./maps";

describe("inhabitantUrlCodec", () => {
  it("decodes legacy 8-char and round-trips through v2 encode", () => {
    const legacy = "1H2C3111";
    const roll = decodeInhabitantRollParam(legacy);
    expect(roll).not.toBeNull();
    expect(roll!.ageCard).toEqual(roll!.personalityCard);
    expect(encodeInhabitantRoll(roll!)).toBe("1H2H2C3111");
    expect(decodeInhabitantRollParam(encodeInhabitantRoll(roll!))).toEqual(roll);
  });

  it("decodes legacy context rank 7 and round-trips", () => {
    const legacy = "1H2C71115";
    const roll = decodeInhabitantRollParam(legacy);
    expect(roll).not.toBeNull();
    expect(roll!.contextCard.rank).toBe("7");
    expect(roll!.contextSevenDie).toBe(5);
    expect(encodeInhabitantRoll(roll!)).toBe("1H2H2C71115");
    expect(decodeInhabitantRollParam(encodeInhabitantRoll(roll!))).toEqual(roll);
  });

  it("decodes legacy context rank 10 with two spoken-name dice", () => {
    const legacy = "1H2DT31111";
    const roll = decodeInhabitantRollParam(legacy);
    expect(roll).not.toBeNull();
    expect(roll!.contextCard.rank).toBe("10");
    expect(roll!.contextSpokenNameDice).toEqual([1, 1]);
    expect(roll!.contextSpokenName).toBeDefined();
    expect(encodeInhabitantRoll(roll!)).toBe("1H2H2DT31111");
    expect(decodeInhabitantRollParam(encodeInhabitantRoll(roll!))).toEqual(roll);
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
    const encoded = encodeInhabitantRoll(roll);
    expect(encoded).toBe("1H5SKC3234");
    expect(decodeInhabitantRollParam(encoded)).toEqual(roll);
  });

  it("rejects wrong tail for context rank", () => {
    expect(decodeInhabitantRollParam("1H2C31115")).toBeNull();
    expect(decodeInhabitantRollParam("1H2C711112")).toBeNull();
  });

  it("rejects bad lengths and garbage", () => {
    expect(decodeInhabitantRollParam("")).toBeNull();
    expect(decodeInhabitantRollParam("1H2C311")).toBeNull();
    expect(decodeInhabitantRollParam("1H2C31111X")).toBeNull();
  });
});
