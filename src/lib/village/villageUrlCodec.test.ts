import { describe, expect, it } from "vitest";
import type { PlayingCard } from "../types";
import type { VillageRoll } from "./generate";
import { toVillagePrimaryTuple } from "./primaryTuple";
import { decodeVillageRollParam, encodeVillageRoll } from "./villageUrlCodec";

const card = (rank: PlayingCard["rank"], suit: PlayingCard["suit"]): PlayingCard =>
  ({ rank, suit });

describe("villageUrlCodec", () => {
  it("round-trips a roll with no red jacks", () => {
    const primary = toVillagePrimaryTuple([
      card("2", "spades"),
      card("3", "clubs"),
      card("4", "diamonds"),
      card("5", "hearts"),
      card("6", "spades"),
    ])!;
    const roll: VillageRoll = { primary, expansion: [] };
    const encoded = encodeVillageRoll(roll);
    expect(decodeVillageRollParam(encoded)).toEqual(roll);
  });

  it("round-trips a roll with one red jack and required expansion cards", () => {
    const primary = toVillagePrimaryTuple([
      { rank: "J", suit: "hearts" },
      card("2", "clubs"),
      card("3", "clubs"),
      card("4", "clubs"),
      card("5", "clubs"),
    ])!;
    const expansion: PlayingCard[] = [
      { rank: "A", suit: "spades" },
      { rank: "10", suit: "diamonds" },
      { rank: "7", suit: "clubs" },
    ];
    const roll: VillageRoll = { primary, expansion };
    const encoded = encodeVillageRoll(roll);
    expect(decodeVillageRollParam(encoded)).toEqual(roll);
  });

  it("rejects invalid params", () => {
    expect(decodeVillageRollParam("")).toBeNull();
    expect(decodeVillageRollParam("abc")).toBeNull();
  });

  it("rejects expansion cards that are face ranks (length already valid)", () => {
    const primary = toVillagePrimaryTuple([
      { rank: "J", suit: "hearts" },
      card("2", "clubs"),
      card("3", "clubs"),
      card("4", "clubs"),
      card("5", "clubs"),
    ])!;
    const badExpansion: PlayingCard[] = [
      { rank: "Q", suit: "spades" },
      card("7", "diamonds"),
      card("8", "hearts"),
    ];
    expect(decodeVillageRollParam(encodeVillageRoll({ primary, expansion: badExpansion }))).toBeNull();
  });
});
