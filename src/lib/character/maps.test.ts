import { describe, expect, it } from "vitest";
import { RANKS } from "../types";
import {
  ageBandFromSuit,
  canonicalGenderDie,
  canonicalRaceDie,
  genderFromD6,
  personalityFromRank,
  raceFromD6,
  rankFromPersonality,
  suitFromAgeBand,
} from "./maps";

describe("character/maps", () => {
  describe("raceFromD6 / canonicalRaceDie", () => {
    it("maps D6 to races", () => {
      expect(raceFromD6(1)).toBe("bruja");
      expect(raceFromD6(2)).toBe("bruja");
      expect(raceFromD6(3)).toBe("cucurbitus");
      expect(raceFromD6(4)).toBe("cucurbitus");
      expect(raceFromD6(5)).toBe("kiore");
      expect(raceFromD6(6)).toBe("mousseron");
    });

    it("canonicalRaceDie round-trips through raceFromD6", () => {
      const races = ["bruja", "cucurbitus", "kiore", "mousseron"] as const;
      for (const r of races) {
        expect(raceFromD6(canonicalRaceDie(r))).toBe(r);
      }
    });
  });

  it("genderFromD6 covers four bands", () => {
    expect(genderFromD6(1)).toBe("man");
    expect(genderFromD6(2)).toBe("man");
    expect(genderFromD6(3)).toBe("woman");
    expect(genderFromD6(4)).toBe("woman");
    expect(genderFromD6(5)).toBe("nonBinary");
    expect(genderFromD6(6)).toBe("indeterminate");
  });

  it("canonicalGenderDie round-trips through genderFromD6", () => {
    const genders = ["man", "woman", "nonBinary", "indeterminate"] as const;
    for (const g of genders) {
      expect(genderFromD6(canonicalGenderDie(g))).toBe(g);
    }
  });

  it("ageBandFromSuit maps suits", () => {
    expect(ageBandFromSuit("hearts")).toBe("child");
    expect(ageBandFromSuit("diamonds")).toBe("teenager");
    expect(ageBandFromSuit("clubs")).toBe("adult");
    expect(ageBandFromSuit("spades")).toBe("elderly");
  });

  it("personalityFromRank maps A–K", () => {
    expect(personalityFromRank("A")).toBe("enthusiast");
    expect(personalityFromRank("10")).toBe("dreamy");
    expect(personalityFromRank("J")).toBe("calm");
    expect(personalityFromRank("K")).toBe("sad");
  });

  it("suitFromAgeBand inverts ageBandFromSuit", () => {
    const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
    for (const suit of suits) {
      expect(suitFromAgeBand(ageBandFromSuit(suit))).toBe(suit);
    }
  });

  it("rankFromPersonality inverts personalityFromRank for every rank", () => {
    for (const rank of RANKS) {
      expect(rankFromPersonality(personalityFromRank(rank))).toBe(rank);
    }
  });
});
