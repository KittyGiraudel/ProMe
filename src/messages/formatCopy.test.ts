import { describe, expect, it } from "vitest";
import { lookupName } from "@/lib/character/data/namesByRace";
import type { CharacterRoll } from "@/lib/character/generate";
import type { PlayingCard } from "@/lib/types";
import { toVillagePrimaryTuple } from "@/lib/village/primaryTuple";
import {
  formatCharacterCopyOneLiner,
  formatVillageCopyOneLiner,
  formatVillageRulebookPagesJoined,
} from "./formatCopy";

const card = (rank: PlayingCard["rank"], suit: PlayingCard["suit"]): PlayingCard =>
  ({ rank, suit });

function makeRoll(over: Partial<CharacterRoll> = {}): CharacterRoll {
  return {
    raceDie: 1,
    race: "bruja",
    agePersonalityCard: { suit: "hearts", rank: "2" },
    contextCard: { suit: "clubs", rank: "3" },
    nameDice: [1, 1],
    name: lookupName("bruja", 1, 1),
    contextText: "",
    genderDie: 1,
    gender: "woman",
    ...over,
  };
}

describe("formatCopy", () => {
  describe("formatCharacterCopyOneLiner", () => {
    it("builds the share line with gender, name, race, age, personality", () => {
      const line = formatCharacterCopyOneLiner(
        makeRoll({ gender: "man" }),
        "https://example.com/c",
      );
      expect(line).toContain("♂");
      expect(line).toContain(lookupName("bruja", 1, 1));
      expect(line.endsWith("(https://example.com/c)")).toBe(true);
    });

    it("appends cartographer map kind when context is 7", () => {
      const localisation = formatCharacterCopyOneLiner(
        makeRoll({
          contextCard: { suit: "diamonds", rank: "7" },
          contextSevenDie: 2,
        }),
        "https://x",
      );
      expect(localisation).toContain("localisation");
      const biome = formatCharacterCopyOneLiner(
        makeRoll({
          contextCard: { suit: "diamonds", rank: "7" },
          contextSevenDie: 5,
        }),
        "https://x",
      );
      expect(biome).toContain("biome");
    });

    it("appends spoken name label when context is 10", () => {
      const line = formatCharacterCopyOneLiner(
        makeRoll({
          contextCard: { suit: "spades", rank: "10" },
          contextSpokenName: "Mira",
        }),
        "https://x",
      );
      expect(line).toContain("Mira");
    });
  });

  describe("formatVillageCopyOneLiner", () => {
    it("ends with the village URL and lists establishments", () => {
      const primary = toVillagePrimaryTuple([
        card("2", "hearts"),
        card("3", "clubs"),
        card("4", "diamonds"),
        card("5", "spades"),
        card("6", "hearts"),
      ])!;
      const roll = { primary, expansion: [] };
      const out = formatVillageCopyOneLiner(roll, "https://village.example");
      expect(out.endsWith("https://village.example")).toBe(true);
      expect(out).toContain("Établissements");
    });

    it("inlines owner one-liners when owners align with establishments", () => {
      const primary = toVillagePrimaryTuple([
        card("2", "hearts"),
        card("3", "clubs"),
        card("4", "diamonds"),
        card("5", "spades"),
        card("6", "hearts"),
      ])!;
      const roll = { primary, expansion: [] };
      const owners = [
        makeRoll({ name: "OwnerA", gender: "woman" }),
        makeRoll({ name: "OwnerB", gender: "man" }),
        makeRoll({ name: "OwnerC", gender: "nonBinary" }),
        makeRoll({ name: "OwnerD", gender: "indeterminate" }),
        makeRoll({ name: "OwnerE", gender: "woman" }),
      ];
      const out = formatVillageCopyOneLiner(roll, "https://v", owners, {
        characterShareUrl: (o) => `https://char/${o.name}`,
      });
      expect(out).toContain("Propriétaire");
      expect(out).toContain("https://char/OwnerA");
    });

    it("lists owner details without character URLs when owners are aligned", () => {
      const primary = toVillagePrimaryTuple([
        card("2", "hearts"),
        card("3", "clubs"),
        card("4", "diamonds"),
        card("5", "spades"),
        card("6", "hearts"),
      ])!;
      const roll = { primary, expansion: [] };
      const owners = [
        makeRoll({ name: "PlainA", gender: "man" }),
        makeRoll({ name: "PlainB", gender: "woman" }),
        makeRoll({ name: "PlainC", gender: "man" }),
        makeRoll({ name: "PlainD", gender: "woman" }),
        makeRoll({ name: "PlainE", gender: "man" }),
      ];
      const out = formatVillageCopyOneLiner(roll, "https://v", owners);
      expect(out).toContain("PlainA");
      expect(out).not.toContain("https://char/");
    });

    it("skips proprietor lines for Ruines (rank 10) while keeping other owners aligned", () => {
      const primary = toVillagePrimaryTuple([
        card("10", "spades"),
        card("2", "hearts"),
        card("3", "clubs"),
        card("4", "diamonds"),
        card("5", "spades"),
      ])!;
      const roll = { primary, expansion: [] };
      const owners = [
        makeRoll({ name: "AfterRuin", gender: "woman" }),
        makeRoll({ name: "Second", gender: "man" }),
        makeRoll({ name: "Third", gender: "woman" }),
        makeRoll({ name: "Fourth", gender: "man" }),
      ];
      const out = formatVillageCopyOneLiner(roll, "https://v", owners);
      expect(out).toContain("AfterRuin");
      expect(out.match(/Propriétaire/g)?.length).toBe(4);
    });

    it("includes trait bullets with bold markers stripped", () => {
      const primary = toVillagePrimaryTuple([
        card("J", "clubs"),
        card("2", "hearts"),
        card("3", "diamonds"),
        card("4", "clubs"),
        card("5", "spades"),
      ])!;
      const roll = { primary, expansion: [] };
      const out = formatVillageCopyOneLiner(roll, "https://traits");
      expect(out).toContain("Traits du village");
      expect(out).not.toContain("**Merveille.**");
    });
  });

  describe("formatVillageRulebookPagesJoined", () => {
    it("dedupes, sorts ascending, and joins citations", () => {
      expect(formatVillageRulebookPagesJoined([5, 1, 5, 3])).toBe(
        "p. 1 · p. 3 · p. 5",
      );
    });
  });
});
