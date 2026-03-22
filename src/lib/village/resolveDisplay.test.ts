import { describe, expect, it } from "vitest";
import type { PlayingCard } from "../types";
import type { VillageRoll } from "./generate";
import {
  countVillageEstablishments,
  resolveVillageDisplay,
} from "./resolveDisplay";
import { toVillagePrimaryTuple } from "./primaryTuple";

const card = (rank: PlayingCard["rank"], suit: PlayingCard["suit"]): PlayingCard =>
  ({ rank, suit });

function roll(
  primary: PlayingCard[],
  expansion: PlayingCard[],
): VillageRoll {
  return {
    primary: toVillagePrimaryTuple(primary)!,
    expansion,
  };
}

describe("resolveVillageDisplay", () => {
  it("lists one trait row per distinct face trait and all numbered establishments", () => {
    const r = roll(
      [
        card("2", "hearts"),
        card("3", "clubs"),
        card("Q", "spades"),
        card("5", "diamonds"),
        card("6", "hearts"),
      ],
      [],
    );
    const { traits, establishments } = resolveVillageDisplay(r);
    expect(traits).toHaveLength(1);
    expect(traits[0]!.instances).toHaveLength(1);
    expect(establishments).toHaveLength(4);
    for (const e of establishments) {
      expect(e.rerollPrimarySlot).not.toBeNull();
    }
  });

  it("merges two face cards that share the same trait text into one row", () => {
    const r = roll(
      [
        card("K", "hearts"),
        card("K", "diamonds"),
        card("2", "clubs"),
        card("3", "spades"),
        card("4", "hearts"),
      ],
      [],
    );
    const { traits, establishments } = resolveVillageDisplay(r);
    expect(traits).toHaveLength(1);
    expect(traits[0]!.instances).toHaveLength(2);
    expect(establishments).toHaveLength(3);
  });

  it("consumes three expansion cards per red jack in order", () => {
    const r = roll(
      [
        card("J", "hearts"),
        card("2", "clubs"),
        card("3", "diamonds"),
        card("4", "spades"),
        card("5", "hearts"),
      ],
      [
        card("6", "clubs"),
        card("7", "diamonds"),
        card("8", "spades"),
      ],
    );
    const { establishments } = resolveVillageDisplay(r);
    const fromJack = establishments.filter((e) => e.rerollPrimarySlot === null);
    expect(fromJack).toHaveLength(3);
    expect(fromJack.map((e) => e.card)).toEqual(r.expansion);
  });

  it("throws when expansion is too long for red jacks", () => {
    const r = roll(
      [
        card("J", "hearts"),
        card("2", "clubs"),
        card("3", "diamonds"),
        card("4", "spades"),
        card("5", "hearts"),
      ],
      [
        card("6", "clubs"),
        card("7", "diamonds"),
        card("8", "spades"),
        card("9", "hearts"),
      ],
    );
    expect(() => resolveVillageDisplay(r)).toThrow(
      /expansion length mismatch/,
    );
  });

  it("countVillageEstablishments matches establishments length", () => {
    const r = roll(
      [
        card("A", "hearts"),
        card("2", "clubs"),
        card("3", "diamonds"),
        card("4", "spades"),
        card("5", "hearts"),
      ],
      [],
    );
    expect(countVillageEstablishments(r)).toBe(
      resolveVillageDisplay(r).establishments.length,
    );
  });
});
