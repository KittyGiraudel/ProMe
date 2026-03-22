import {
  decodeCharacterRollParam,
  encodeCharacterRoll,
} from "../character/characterUrlCodec";
import type { CharacterRoll } from "../character/generate";

/** Not used in `encodeCharacterRoll` output. */
const BLOB_SEP = "~";

export function encodeVillageOwners(owners: CharacterRoll[]): string {
  return owners.map(encodeCharacterRoll).join(BLOB_SEP);
}

export function decodeVillageOwnersParam(raw: string): CharacterRoll[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(BLOB_SEP).filter(Boolean);
  const out: CharacterRoll[] = [];
  for (const p of parts) {
    const c = decodeCharacterRollParam(p);
    if (!c) return null;
    out.push(c);
  }
  return out;
}
