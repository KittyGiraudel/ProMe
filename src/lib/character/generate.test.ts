import { describe, expect, it } from "vitest";
import { lookupName } from "./data/namesByRace";
import {
  generateCharacterWithRace,
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
  rerollCharacterPart,
  type CharacterRoll,
} from "./generate";

function makeRoll(over: Partial<CharacterRoll> = {}): CharacterRoll {
  return {
    raceDie: 1,
    race: "bruja",
    ageCard: { suit: "hearts", rank: "2" },
    personalityCard: { suit: "hearts", rank: "2" },
    contextCard: { suit: "clubs", rank: "3" },
    nameDice: [1, 1],
    name: lookupName("bruja", 1, 1),
    contextText: "",
    genderDie: 1,
    gender: "man",
    ...over,
  };
}

describe("character/generate", () => {
  it("mapKindFromContextSevenDie splits 1–3 vs 4–6", () => {
    expect(mapKindFromContextSevenDie(1)).toBe("localisation");
    expect(mapKindFromContextSevenDie(3)).toBe("localisation");
    expect(mapKindFromContextSevenDie(4)).toBe("biome");
    expect(mapKindFromContextSevenDie(6)).toBe("biome");
  });

  it("generateCharacterWithRace uses canonical race die", () => {
    const rng = () => 0.0001;
    const roll = generateCharacterWithRace("cucurbitus", rng);
    expect(roll.race).toBe("cucurbitus");
    expect(roll.raceDie).toBe(3);
  });

  it("getAgeBand uses suit of age card; getPersonality uses rank of personality card", () => {
    const roll = makeRoll({
      ageCard: { suit: "spades", rank: "2" },
      personalityCard: { suit: "hearts", rank: "Q" },
    });
    expect(getAgeBand(roll)).toBe("elderly");
    expect(getPersonality(roll)).toBe("joyful");
  });

  it("rerollCharacterPart ageCard and personalityCard are independent", () => {
    const roll = makeRoll();
    const nextAge = rerollCharacterPart(roll, "ageCard", () => 0.5);
    expect(nextAge.personalityCard).toEqual(roll.personalityCard);
    const nextPers = rerollCharacterPart(roll, "personalityCard", () => 0.5);
    expect(nextPers.ageCard).toEqual(roll.ageCard);
  });

  it("rerollCharacterPart race updates name for new race grid", () => {
    const roll = makeRoll({ race: "bruja", nameDice: [1, 1] });
    const next = rerollCharacterPart(roll, "race", () => 0.999);
    expect(next.raceDie).toBe(6);
    expect(next.race).toBe("mousseron");
    expect(next.name).toBe(lookupName("mousseron", 1, 1));
  });

  it("rerollCharacterPart contextSevenDie is a no-op when context is not 7", () => {
    const roll = makeRoll();
    const next = rerollCharacterPart(roll, "contextSevenDie", () => 0.99);
    expect(next).toBe(roll);
  });

  it("rerollCharacterPart contextSpokenNameDice is a no-op when context is not 10", () => {
    const roll = makeRoll();
    const next = rerollCharacterPart(roll, "contextSpokenNameDice", () => 0.99);
    expect(next).toBe(roll);
  });
});
