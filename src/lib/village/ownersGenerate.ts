import {
  generateInhabitantWithRace,
  type InhabitantRoll,
} from '../inhabitant/generate'
import type { Race } from "../types";
import type { VillageRoll } from "./generate";
import { countVillageOwnerSlots } from "./resolveDisplay";

export function generateOwnersForVillage(
  roll: VillageRoll,
  race: Race,
  rng: () => number = Math.random,
): InhabitantRoll[] {
  const n = countVillageOwnerSlots(roll);
  const out: InhabitantRoll[] = [];
  for (let i = 0; i < n; i++) {
    out.push(generateInhabitantWithRace(race, rng));
  }
  return out;
}
