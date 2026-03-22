import type { Rank } from "../../types";

/**
 * Inhabitant context by card rank (suit ignored). Rulebook text in French.
 * Inline styling: **bold**, *italic* — parsed by `renderSimpleInlineMarkup`.
 */
export const contextByRank: Record<Rank, string> = {
  A: "**Cet habitant pleure une perte récente.** Il a peut-être perdu un animal de compagnie ou un ami proche. Peut-être qu’une discussion serait la bienvenue ? À moins qu’il ait besoin d’écoute pour se sentir mieux ?",
  "2": "**Cet habitant est à la recherche de quelque chose.** Peut-être quelque chose qui n’est pas vendu dans ce village, ou quelque chose que l’on ne peut trouver que loin d’ici ? Mais au-delà de ça, il semble avoir peur de l’inconnu. Il y a peut-être une histoire derrière tout ça.",
  "3": "**Cet habitant rêve de voyager dans un autre village.** Peut-être pourriez-vous l’accompagner et en savoir plus sur ses motivations et ses envies !",
  "4": "**Cet habitant est très malade et n’a plus que peu de temps à vivre.** Il est seul et personne pour l’épauler dans ces instants difficiles. Peut-être qu’une conversation lui donnerait un peu de baume au cœur ? *Si vous avez rencontré cet habitant dans un village, la prochaine fois que vous visiterez cet endroit, vous devrez réussir un test de Courage pour le retrouver.*",
  "5": "**Cet habitant cherche l’amitié — ou peut-être l’amour ?** Vous n’en êtes pas sûr, mais il semble se sentir seul. Vous pouvez l’aider à trouver quelqu’un qui cherche quelque chose de similaire.",
  "6": "**Cet habitant se languit d’un être cher.** Peut-être est-ce quelqu’un qui vit ailleurs ou qui vient juste de partir. Mais il est aussi à la recherche d’un objet très spécial qui lui rappelle cette personne. Quel est cet objet ?",
  "7": "Cet habitant est un **cartographe**. Vous le croisez alors qu’il va quitter le village et il reconnaît en vous un voyageur. Il vous offre une de ses cartes. Lancez un D6 : *Carte de localisation (1-3)* ou *Carte de biome (4-6)* (voir p. 49).",
  "8": "Cet habitant est **en train de peindre un tableau**. Se rendant compte que vous êtes un voyageur, il vous demande si vous avez un croquis représentant un endroit qui lui est inconnu, ou si vous pouvez décrire un panorama que vous avez vu au cours de votre voyage ! Il ne s’est jamais aventuré dans des endroits éloignés de son village et recherche l’inspiration !",
  "9": "Il existe des rumeurs sur de mystérieuses Ruines parsemées à travers le monde et **cet habitant est curieux d’en savoir plus sur le sujet**. Voyant que vous êtes un voyageur, il s’approche de vous pour voir si vous avez des informations à partager !",
  "10": "**Cet habitant prononce un nom en errant dans le village.** De qui s’agit-il ? Pourquoi cet habitant prononce-t-il ce nom ? Que s’est-il passé ? *Si vous devez créer un nom, consultez la table page 60.*",
  J: "**Cet habitant achète des objets provenant d’autres endroits du monde et offre 100 pièces pour chaque objet digne de son intérêt.** Parlez-lui ! Peut-être que vous avez sur vous un objet qu’il pourrait acquérir.",
  Q: "**Cet habitant ressemble à quelqu’un que vous avez déjà rencontré.** S’agit-il d’une impression ? Vous pouvez toujours lui demander pour en avoir le cœur net. Il a peut-être déjà croisé votre chemin, à moins que ce ne soit un inconnu avec de nouvelles histoires à raconter !",
  K: "**Cet habitant est un bâtisseur.** Il vous dit qu’avec 3 bois et 3 fers ou avec 1000 pièces, il peut construire l’établissement de votre choix dans le village.",
};
