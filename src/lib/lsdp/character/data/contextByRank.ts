import { copy } from "@/messages/fr";
import type { Rank } from "../../types";

/**
 * Inhabitant context by card rank (suit ignored). Inline styling: **bold**, *italic*
 * — parsed by `renderSimpleInlineMarkup`. Strings live in `messages/fr.ts`.
 */
export const contextByRank: Record<Rank, string> = copy.game
  .characterContextByRank as Record<Rank, string>;
