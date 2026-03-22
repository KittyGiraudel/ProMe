import { randomCard, roll2D6, rollD6 } from "../rng";
import type { PlayingCard, Race } from "../types";
import { contextByRank } from "./data/contextByRank";
import { lookupName } from "./data/namesByRace";
import { ageBandFromSuit, personalityFromRank, raceFromD6 } from "./maps";

export type CharacterRerollPart =
  | "race"
  | "nameDice"
  | "agePersonalityCard"
  | "contextCard";

export type CharacterRoll = {
  raceDie: number;
  race: Race;
  agePersonalityCard: PlayingCard;
  contextCard: PlayingCard;
  nameDice: [number, number];
  name: string;
  contextText: string;
};

export function generateCharacter(
  rng: () => number = Math.random,
): CharacterRoll {
  const raceDie = rollD6(rng);
  const race = raceFromD6(raceDie);
  const agePersonalityCard = randomCard(rng);
  const contextCard = randomCard(rng);
  const nameDice = roll2D6(rng);
  const name = lookupName(race, nameDice[0], nameDice[1]);
  const contextText = contextByRank[contextCard.rank];

  return {
    raceDie,
    race,
    agePersonalityCard,
    contextCard,
    nameDice,
    name,
    contextText,
  };
}

/** Reroll one mechanical input; keeps other fields and fixes derived fields (name, context text). */
export function rerollCharacterPart(
  roll: CharacterRoll,
  part: CharacterRerollPart,
  rng: () => number = Math.random,
): CharacterRoll {
  switch (part) {
    case "race": {
      const raceDie = rollD6(rng);
      const race = raceFromD6(raceDie);
      const name = lookupName(race, roll.nameDice[0], roll.nameDice[1]);
      return { ...roll, raceDie, race, name };
    }
    case "nameDice": {
      const nameDice = roll2D6(rng);
      const name = lookupName(roll.race, nameDice[0], nameDice[1]);
      return { ...roll, nameDice, name };
    }
    case "agePersonalityCard": {
      return { ...roll, agePersonalityCard: randomCard(rng) };
    }
    case "contextCard": {
      const contextCard = randomCard(rng);
      const contextText = contextByRank[contextCard.rank];
      return { ...roll, contextCard, contextText };
    }
    default: {
      const _exhaustive: never = part;
      return _exhaustive;
    }
  }
}

export function getAgeBand(roll: CharacterRoll) {
  return ageBandFromSuit(roll.agePersonalityCard.suit);
}

export function getPersonality(roll: CharacterRoll) {
  return personalityFromRank(roll.agePersonalityCard.rank);
}
