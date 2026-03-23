import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from '../inhabitant/inhabitantUrlCodec'
import type { InhabitantRoll } from '../inhabitant/generate'

/** Not used in `encodeInhabitantRoll` output. */
const BLOB_SEP = "~";

export function encodeVillageOwners(owners: InhabitantRoll[]): string {
  return owners.map(encodeInhabitantRoll).join(BLOB_SEP);
}

export function decodeVillageOwnersParam(raw: string): InhabitantRoll[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(BLOB_SEP).filter(Boolean);
  const out: InhabitantRoll[] = [];
  for (const p of parts) {
    const c = decodeInhabitantRollParam(p);
    if (!c) return null;
    out.push(c);
  }
  return out;
}
