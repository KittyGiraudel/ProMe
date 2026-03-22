import {
  generateCharacterWithRace,
  type CharacterRoll,
} from "../character/generate";
import type { Race } from "../types";
import type { VillageRoll } from "./generate";
import { countVillageEstablishments } from "./resolveDisplay";

export function generateOwnersForVillage(
  roll: VillageRoll,
  race: Race,
  rng: () => number = Math.random,
): CharacterRoll[] {
  const n = countVillageEstablishments(roll);
  const out: CharacterRoll[] = [];
  for (let i = 0; i < n; i++) {
    out.push(generateCharacterWithRace(race, rng));
  }
  return out;
}
