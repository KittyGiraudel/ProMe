import type { Race } from "../types";
import { RACES } from "../types";

export function decodeVillageRaceParam(raw: string | null): Race | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return (RACES as readonly string[]).includes(s) ? (s as Race) : null;
}
