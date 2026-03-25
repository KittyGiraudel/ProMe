import {
  decodePlayingCardString,
  encodePlayingCard,
} from "../codec/cards";
import { Faction, FACTIONS } from "../types";
import type { VillageRoll } from "./generate";
import { countRedJacksInPrimary, isValidExpansionCard } from "./generate";
import { toVillagePrimaryTuple } from "./primaryTuple";
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from '../inhabitant/inhabitantUrlCodec'
import type { InhabitantRoll } from '../inhabitant/generate'
import { Localize } from '../localization/localize';

/** Not used in `encodeInhabitantRoll` output. */
const BLOB_SEP = "~";

export function encodeVillageOwners(owners: InhabitantRoll[]): string {
  return owners.map(encodeInhabitantRoll).join(BLOB_SEP);
}

export function decodeVillageOwnersParam(localize: Localize, raw: string): InhabitantRoll[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(BLOB_SEP).filter(Boolean);
  const out: InhabitantRoll[] = [];
  for (const p of parts) {
    const c = decodeInhabitantRollParam(p, localize);
    if (!c) return null;
    out.push(c);
  }
  return out;
}

export function encodeVillageRoll(roll: VillageRoll): string {
  let s = "";
  for (const c of roll.primary) {
    s += encodePlayingCard(c);
  }
  for (const c of roll.expansion) {
    s += encodePlayingCard(c);
  }
  return s;
}

export function decodeVillageRollParam(raw: string): VillageRoll | null {
  const compact = raw.trim().toUpperCase();
  if (compact.length < 10 || compact.length % 2 !== 0) return null;
  const cards = decodePlayingCardString(compact);
  if (!cards || cards.length < 5) return null;

  const primary = toVillagePrimaryTuple(cards.slice(0, 5));
  if (!primary) return null;
  const expansion = cards.slice(5);
  const need = countRedJacksInPrimary(primary) * 3;
  if (expansion.length !== need) return null;
  for (const c of expansion) {
    if (!isValidExpansionCard(c)) return null;
  }
  return { primary, expansion };
}

export function decodeVillageFactionParam(raw: string | null): Faction | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return (FACTIONS as readonly string[]).includes(s) ? (s as Faction) : null;
}
