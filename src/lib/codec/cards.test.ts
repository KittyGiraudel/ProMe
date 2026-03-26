import { describe, expect, it } from "vitest";
import type { PlayingCard, Rank, Suit } from "@/lib/types";
import {
  decodePlayingCardPair,
  decodePlayingCardString,
  encodePlayingCard,
} from "./cards";

const card = (suit: Suit, rank: Rank): PlayingCard => ({ suit, rank });

describe("codec/cards", () => {
  it("encodePlayingCard uses suit letter and T for ten", () => {
    expect(encodePlayingCard(card("hearts", "10"))).toBe("HT");
    expect(encodePlayingCard(card("spades", "A"))).toBe("SA");
  });

  it("decodePlayingCardPair round-trips encodePlayingCard", () => {
    const samples: PlayingCard[] = [
      card("diamonds", "2"),
      card("clubs", "J"),
      card("spades", "10"),
    ];
    for (const c of samples) {
      expect(decodePlayingCardPair(encodePlayingCard(c))).toEqual(c);
    }
  });

  it("decodePlayingCardPair accepts lowercase input", () => {
    expect(decodePlayingCardPair("ht")).toEqual(card("hearts", "10"));
  });

  it("decodePlayingCardPair rejects invalid tokens", () => {
    expect(decodePlayingCardPair("")).toBeNull();
    expect(decodePlayingCardPair("X2")).toBeNull();
    expect(decodePlayingCardPair("HZ")).toBeNull();
  });

  it("decodePlayingCardString parses concatenated pairs", () => {
    expect(decodePlayingCardString("H2C3DTS5")).toEqual([
      card("hearts", "2"),
      card("clubs", "3"),
      card("diamonds", "10"),
      card("spades", "5"),
    ]);
  });

  it("decodePlayingCardString rejects odd length", () => {
    expect(decodePlayingCardString("H")).toBeNull();
    expect(decodePlayingCardString("H2C")).toBeNull();
  });

  it("decodePlayingCardString rejects an invalid pair inside the string", () => {
    expect(decodePlayingCardString("H2XZ")).toBeNull();
  });
});
