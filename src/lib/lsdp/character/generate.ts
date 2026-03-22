import { randomCard, roll2D6, rollD6 } from "../rng";
import type { Gender, PlayingCard, Race } from "../types";
import { contextByRank } from "./data/contextByRank";
import { lookupName } from "./data/namesByRace";
import {
  ageBandFromSuit,
  canonicalRaceDie,
  genderFromD6,
  personalityFromRank,
  raceFromD6,
} from "./maps";

export type CharacterRerollPart =
  | "race"
  | "nameDice"
  | "agePersonalityCard"
  | "contextCard"
  | "gender"
  | "contextSevenDie"
  | "contextSpokenNameDice";

export type CharacterRoll = {
  raceDie: number;
  race: Race;
  agePersonalityCard: PlayingCard;
  contextCard: PlayingCard;
  nameDice: [number, number];
  name: string;
  contextText: string;
  genderDie: number;
  gender: Gender;
  /** Context rank 7 — rulebook D6: 1–3 localisation, 4–6 biome (p. 49). */
  contextSevenDie?: number;
  /** Context rank 10 — name pronounced in the scene (2D6, same table as inhabitant name, p. 60). */
  contextSpokenNameDice?: [number, number];
  contextSpokenName?: string;
};

/** Map type offered by the cartographer context (rank 7). */
export function mapKindFromContextSevenDie(
  die: number,
): "localisation" | "biome" {
  return die >= 1 && die <= 3 ? "localisation" : "biome";
}

function rollContextFollowups(
  roll: Pick<CharacterRoll, "race" | "contextCard">,
  rng: () => number,
): Pick<
  CharacterRoll,
  "contextSevenDie" | "contextSpokenNameDice" | "contextSpokenName"
> {
  const rank = roll.contextCard.rank;
  if (rank === "7") {
    const contextSevenDie = rollD6(rng);
    return { contextSevenDie };
  }
  if (rank === "10") {
    const contextSpokenNameDice = roll2D6(rng);
    const contextSpokenName = lookupName(
      roll.race,
      contextSpokenNameDice[0],
      contextSpokenNameDice[1],
    );
    return { contextSpokenNameDice, contextSpokenName };
  }
  return {};
}

function rollCharacterRoll(
  raceDie: number,
  race: Race,
  rng: () => number,
): CharacterRoll {
  const agePersonalityCard = randomCard(rng);
  const contextCard = randomCard(rng);
  const nameDice = roll2D6(rng);
  const name = lookupName(race, nameDice[0], nameDice[1]);
  const contextText = contextByRank[contextCard.rank];
  const genderDie = rollD6(rng);
  const gender = genderFromD6(genderDie);
  const follow = rollContextFollowups({ race, contextCard }, rng);

  return {
    raceDie,
    race,
    agePersonalityCard,
    contextCard,
    nameDice,
    name,
    contextText,
    genderDie,
    gender,
    ...follow,
  };
}

/** Random inhabitant with a fixed people / race (village owners, etc.). */
export function generateCharacterWithRace(
  race: Race,
  rng: () => number = Math.random,
): CharacterRoll {
  return rollCharacterRoll(canonicalRaceDie(race), race, rng);
}

export function generateCharacter(
  rng: () => number = Math.random,
): CharacterRoll {
  const raceDie = rollD6(rng);
  const race = raceFromD6(raceDie);
  return rollCharacterRoll(raceDie, race, rng);
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
      const contextSpokenName =
        roll.contextCard.rank === "10" && roll.contextSpokenNameDice
          ? lookupName(
              race,
              roll.contextSpokenNameDice[0],
              roll.contextSpokenNameDice[1],
            )
          : roll.contextSpokenName;
      return { ...roll, raceDie, race, name, contextSpokenName };
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
      const follow = rollContextFollowups({ race: roll.race, contextCard }, rng);
      return {
        ...roll,
        contextCard,
        contextText,
        contextSevenDie: undefined,
        contextSpokenNameDice: undefined,
        contextSpokenName: undefined,
        ...follow,
      };
    }
    case "contextSevenDie": {
      if (roll.contextCard.rank !== "7") return roll;
      return { ...roll, contextSevenDie: rollD6(rng) };
    }
    case "contextSpokenNameDice": {
      if (roll.contextCard.rank !== "10") return roll;
      const contextSpokenNameDice = roll2D6(rng);
      const contextSpokenName = lookupName(
        roll.race,
        contextSpokenNameDice[0],
        contextSpokenNameDice[1],
      );
      return { ...roll, contextSpokenNameDice, contextSpokenName };
    }
    case "gender": {
      const genderDie = rollD6(rng);
      const gender = genderFromD6(genderDie);
      return { ...roll, genderDie, gender };
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
