import type { PlayingCard } from "../../types";
import { suitIsRed } from "../../suitGlyphs";

/** Rich-text (markdown-style) French trait for a face card (J, Q, K). */
export function villageTraitTextFr(card: PlayingCard): string {
  const { rank, suit } = card;
  const red = suitIsRed(suit);
  switch (rank) {
    case "J":
      return red
        ? "**Ville.** C’est une **grande colonie**. Tirez **3 cartes d’établissement supplémentaires** ; si vous tirez une **figure** (valet, dame, roi), **ignorez-la** et tirez à nouveau jusqu’à obtenir une **carte numérotée**."
        : "**Merveille.** Le village est **d’une beauté exceptionnelle**. Décrivez-le. Vous gagnez **2 points d’Inspiration**.";
    case "Q":
      return red
        ? "**Fortifié.** Le village est **entouré de murs** avec une **entrée gardée**. Vous devez avoir **au moins 1 point d’Honneur** pour y entrer."
        : "**Luxuriant.** Il comporte une **étendue d’eau** (rivière, lac, etc.) et un **jardin**. Vous pouvez utiliser la **table de collecte du biome** **sans équipement particulier**.";
    case "K":
      return red
        ? "**Abandonné.** Les bâtiments semblent **inhabités**. Les **établissements sont inopérants** tant que quelqu’un ne décide pas de **reconstruire le village**."
        : "**Nomade.** Le village **se déplace**. Lorsque vous revenez sur cette **case de carte**, vous devez réussir un **test de Courage**. En cas d’**échec**, le village **n’est plus là**.";
    default:
      throw new Error("villageTraitTextFr: expected face card");
  }
}
