import type { Faction } from "../types";
import { FACTIONS } from "../types";

export function decodeVillageFactionParam(raw: string | null): Faction | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return (FACTIONS as readonly string[]).includes(s) ? (s as Faction) : null;
}
