import { copy } from "@/messages/fr";
import type { PlayingCard } from "../../types";
import { suitIsRed } from "../../suitGlyphs";

/** Rich-text (markdown-style) trait line for a face card (J, Q, K). */
export function villageTraitText(card: PlayingCard): string {
  const { rank, suit } = card;
  const red = suitIsRed(suit);
  const t = copy.game.villageTraits;
  switch (rank) {
    case "J":
      return red ? t.J.red : t.J.black;
    case "Q":
      return red ? t.Q.red : t.Q.black;
    case "K":
      return red ? t.K.red : t.K.black;
    default:
      throw new Error("villageTraitText: expected face card");
  }
}
