import { describe, expect, it } from "vitest";
import type { PlayingCard } from "../types";
import { generateOwnersForVillage } from "./ownersGenerate";
import { toVillagePrimaryTuple } from "./primaryTuple";

const c = (rank: PlayingCard["rank"], suit: PlayingCard["suit"]): PlayingCard =>
  ({ rank, suit });

describe("ownersGenerate", () => {
  it("generates one inhabitant roll per resolved establishment", () => {
    const primary = toVillagePrimaryTuple([
      c("2", "hearts"),
      c("3", "clubs"),
      c("4", "diamonds"),
      c("5", "spades"),
      c("6", "hearts"),
    ])!;
    const roll = { primary, expansion: [] };
    const rng = () => 0.42;
    const owners = generateOwnersForVillage(roll, "mousseron", rng);
    expect(owners).toHaveLength(5);
    for (const o of owners) {
      expect(o.race).toBe("mousseron");
    }
  });

  it("does not generate an owner for Ruines (rank 10)", () => {
    const primary = toVillagePrimaryTuple([
      c("10", "spades"),
      c("2", "hearts"),
      c("3", "clubs"),
      c("4", "diamonds"),
      c("5", "spades"),
    ])!;
    const roll = { primary, expansion: [] };
    const owners = generateOwnersForVillage(roll, "bruja", () => 0.5);
    expect(owners).toHaveLength(4);
  });
});
