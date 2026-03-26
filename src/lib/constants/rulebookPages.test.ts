import { describe, expect, it } from "vitest";
import type { Rank } from "@/lib/types";
import {
  RULEBOOK_PAGES,
  establishmentDetailRulebookPage,
} from "./rulebookPages";

describe("rulebookPages", () => {
  it("establishmentDetailRulebookPage maps each numbered rank to a detail page", () => {
    const table = RULEBOOK_PAGES.village.establishmentDetailByRank;
    for (const rank of Object.keys(table) as Rank[]) {
      if (rank === "J" || rank === "Q" || rank === "K") continue;
      expect(establishmentDetailRulebookPage(rank)).toBe(table[rank]);
    }
  });

  it("establishmentDetailRulebookPage sends face ranks to the establishment table page", () => {
    const tablePage = RULEBOOK_PAGES.village.establishmentTable;
    expect(establishmentDetailRulebookPage("J")).toBe(tablePage);
    expect(establishmentDetailRulebookPage("Q")).toBe(tablePage);
    expect(establishmentDetailRulebookPage("K")).toBe(tablePage);
  });
});
