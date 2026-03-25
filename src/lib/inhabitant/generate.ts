import { randomCard, roll2D6, rollD6 } from "../rng";
import type { AgeBand, Gender, Personality, PlayingCard, Faction } from "../types";
import { lookupName } from "./data/namesByFaction";
import {
  ageBandFromSuit,
  canonicalGenderDie,
  canonicalFactionDie,
  genderFromD6,
  personalityFromRank,
  factionFromD6,
  rankFromPersonality,
  suitFromAgeBand,
} from "./maps";
import { Localize } from "../localization/localize";
import { _Translator } from "next-intl";

export type InhabitantRerollPart =
  | "faction"
  | "nameDice"
  | "ageCard"
  | "personalityCard"
  | "contextCard"
  | "gender"
  | "contextSevenDie"
  | "contextSpokenNameDice";

export type InhabitantRoll = {
  factionDie: number;
  faction: Faction;
  /** Suit → age band (book: one draw for age). */
  ageCard: PlayingCard;
  /** Rank → personality (book: one draw for personality). */
  personalityCard: PlayingCard;
  contextCard: PlayingCard;
  nameDice: [number, number];
  name: string;
  contextText: string;
  genderDie: number;
  gender: Gender;
  contextSevenDie?: number;
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
  roll: Pick<InhabitantRoll, "faction" | "contextCard">,
  rng: () => number,
): Pick<
  InhabitantRoll,
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
      roll.faction,
      contextSpokenNameDice[0],
      contextSpokenNameDice[1],
    );
    return { contextSpokenNameDice, contextSpokenName };
  }
  return {};
}

function rollInhabitantRoll(
  factionDie: number,
  faction: Faction,
  t: _Translator,
  rng: () => number,
): InhabitantRoll {
  const ageCard = randomCard(rng);
  const personalityCard = randomCard(rng);
  const contextCard = randomCard(rng);
  const nameDice = roll2D6(rng);
  const name = lookupName(faction, nameDice[0], nameDice[1]);
  const contextText = t(`game.inhabitantContextByRank.${contextCard.rank}`);
  const genderDie = rollD6(rng);
  const gender = genderFromD6(genderDie);
  const follow = rollContextFollowups({ faction, contextCard }, rng);

  return {
    factionDie,
    faction,
    ageCard,
    personalityCard,
    contextCard,
    nameDice,
    name,
    contextText,
    genderDie,
    gender,
    ...follow,
  };
}

export function generateInhabitantWithFaction(
  faction: Faction,
  t: _Translator,
  rng: () => number = Math.random,
): InhabitantRoll {
  return rollInhabitantRoll(
    canonicalFactionDie(faction),
    faction,
    t,
    rng,
  );
}

export function generateInhabitant(
  t: _Translator,
  rng: () => number = Math.random,
): InhabitantRoll {
  const factionDie = rollD6(rng);
  const faction = factionFromD6(factionDie);
  return rollInhabitantRoll(factionDie, faction, t, rng);
}

export function setInhabitantFaction(roll: InhabitantRoll, faction: Faction): InhabitantRoll {
  const factionDie = canonicalFactionDie(faction);
  const name = lookupName(faction, roll.nameDice[0], roll.nameDice[1]);
  const contextSpokenName =
    roll.contextCard.rank === "10" && roll.contextSpokenNameDice
      ? lookupName(
          faction,
          roll.contextSpokenNameDice[0],
          roll.contextSpokenNameDice[1],
        )
      : roll.contextSpokenName;
  return { ...roll, factionDie, faction, name, contextSpokenName };
}

export function setInhabitantNameDice(
  roll: InhabitantRoll,
  nameDice: [number, number],
): InhabitantRoll {
  const name = lookupName(roll.faction, nameDice[0], nameDice[1]);
  return { ...roll, nameDice, name };
}

export function setInhabitantAgeBand(
  roll: InhabitantRoll,
  ageBand: AgeBand,
): InhabitantRoll {
  return {
    ...roll,
    ageCard: { ...roll.ageCard, suit: suitFromAgeBand(ageBand) },
  };
}

export function setInhabitantPersonality(
  roll: InhabitantRoll,
  personality: Personality,
): InhabitantRoll {
  return {
    ...roll,
    personalityCard: {
      ...roll.personalityCard,
      rank: rankFromPersonality(personality),
    },
  };
}

export function setInhabitantGender(
  roll: InhabitantRoll,
  gender: Gender,
): InhabitantRoll {
  const genderDie = canonicalGenderDie(gender);
  return { ...roll, genderDie, gender };
}

export function rerollInhabitantPart(
  roll: InhabitantRoll,
  part: InhabitantRerollPart,
  t: _Translator,
  rng: () => number = Math.random,
): InhabitantRoll {
  switch (part) {
    case "faction": {
      const factionDie = rollD6(rng);
      const faction = factionFromD6(factionDie);
      const name = lookupName(faction, roll.nameDice[0], roll.nameDice[1]);
      const contextSpokenName =
        roll.contextCard.rank === "10" && roll.contextSpokenNameDice
          ? lookupName(
              faction,
              roll.contextSpokenNameDice[0],
              roll.contextSpokenNameDice[1],
            )
          : roll.contextSpokenName;
      return { ...roll, factionDie, faction, name, contextSpokenName };
    }
    case "nameDice": {
      const nameDice = roll2D6(rng);
      const name = lookupName(roll.faction, nameDice[0], nameDice[1]);
      return { ...roll, nameDice, name };
    }
    case "ageCard": {
      return { ...roll, ageCard: randomCard(rng) };
    }
    case "personalityCard": {
      return { ...roll, personalityCard: randomCard(rng) };
    }
    case "contextCard": {
      const contextCard = randomCard(rng);
      const contextText = t(`game.inhabitantContextByRank.${contextCard.rank}`);
      const follow = rollContextFollowups({ faction: roll.faction, contextCard }, rng);
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
        roll.faction,
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

export function getAgeBand(roll: InhabitantRoll) {
  return ageBandFromSuit(roll.ageCard.suit);
}

export function getPersonality(roll: InhabitantRoll) {
  return personalityFromRank(roll.personalityCard.rank);
}
