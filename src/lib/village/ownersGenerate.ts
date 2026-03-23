import {
  generateInhabitantWithFaction,
  type InhabitantRoll,
} from '../inhabitant/generate'
import type { Faction } from "../types";
import type { VillageRoll } from "./generate";
import { countVillageOwnerSlots } from "./resolveDisplay";

export function generateOwnersForVillage(
  roll: VillageRoll,
  faction: Faction,
  rng: () => number = Math.random,
): InhabitantRoll[] {
  const n = countVillageOwnerSlots(roll);
  const out: InhabitantRoll[] = [];
  for (let i = 0; i < n; i++) {
    out.push(generateInhabitantWithFaction(faction, rng));
  }
  return out;
}
