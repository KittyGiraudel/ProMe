import type { CharacterRoll } from "@/lib/lsdp/character/generate";
import {
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
} from "@/lib/lsdp/character/generate";
import { genderCompactSymbol } from "@/lib/lsdp/genderSymbols";
import type { VillageRoll } from "@/lib/lsdp/village/generate";
import { resolveVillageDisplay } from "@/lib/lsdp/village/resolveDisplay";
import type { Gender, Race } from "@/lib/lsdp/types";

/** French UI copy and localized labels (game data in French lives in `data/` modules). */
export const fr = {
  appName: "LSDP — Outils",
  metadata: {
    title: "LSDP — Outils de jeu",
    description:
      "Générateurs pour Les Souvenirs du Protecteur — personnages, villages et plus.",
  },
  common: {
    loading: "Chargement…",
  },
  hub: {
    title: "Outils pour Les Souvenirs du Protecteur",
    subtitle: "Générateurs aléatoires pour la table : personnages, villages, et plus.",
    characterCardTitle: "Habitant",
    characterCardDescription:
      "Type (D6), âge & personnalité (carte), contexte (carte), nom (2D6), genre (1D6, optionnel).",
    villageCardTitle: "Village",
    villageCardDescription:
      "5 cartes : établissements (As–10) et traits du village (figures). Valet rouge : 3 établissements en plus.",
    open: "Ouvrir",
  },
  character: {
    pageTitle: "Générateur d’habitant",
    pageDescription:
      "Les résultats suivent les règles du livre : lancez tout d’un coup ou notez les tirages pour votre partie.",
    rollAll: "Tout générer",
    /** Use as: `{before}{rollAll}{after}` */
    emptySummaryBefore: "Cliquez sur « ",
    emptySummaryAfter: " » pour tirer un habitant.",
    sectionRace: "Type / peuple",
    sectionGender: "Genre (optionnel, 1D6)",
    sectionAgePersonality: "Âge & personnalité",
    sectionContext: "Contexte",
    sectionName: "Nom",
    raceDieLabel: "1D6",
    nameDiceLabel: "2D6",
    cardLabel: "Carte",
    contextCardNote: "(seule la hauteur compte pour le contexte)",
    copyHint: "Copiez le texte de contexte depuis le livre si vous éditez les données.",
    rerollRace: "Relancer le type (D6)",
    rerollName: "Relancer le nom (2D6)",
    rerollAgePersonalityCard: "Relancer la carte âge & personnalité",
    rerollContextCard: "Relancer la carte de contexte",
    rerollGender: "Relancer le genre (1D6)",
    contextSevenFollowupLabel: "Carte offerte (1D6, p. 49)",
    contextSevenMapLocalisation: "Carte de localisation (1–3)",
    contextSevenMapBiome: "Carte de biome (4–6)",
    rollContextSevenDie: "Lancer le D6 (type de carte)",
    rerollContextSevenDie: "Relancer le D6 (carte offerte)",
    contextSpokenNameLabel: "Nom prononcé (2D6, p. 60)",
    rollContextSpokenNameDice: "Lancer les 2D6 (nom prononcé)",
    rerollContextSpokenNameDice: "Relancer le nom prononcé (2D6)",
    copyOneLiner: "Copier le résumé",
    copyOneLinerSuccess: "Résumé copié dans le presse-papiers.",
    copyOneLinerError: "Impossible de copier (autorisez le presse-papiers).",
  },
  village: {
    pageTitle: "Générateur de village",
    pageDescription:
      "Tirez 5 cartes comme au livre : chaque carte indique un établissement ou un trait. Partagez le résultat via l’URL.",
    rollAll: "Tirer 5 cartes",
    emptySummaryBefore: "Cliquez sur « ",
    emptySummaryAfter: " » pour générer un village.",
    sectionTraits: "Traits du village",
    sectionEstablishments: "Établissements",
    duplicateRuleHint:
      "Si vous tirez deux fois le même établissement : soit **deux** lieux du même type, soit **un seul** plus grand et imposant — à trancher à la table.",
    groupedToggle:
      "Regrouper les doublons (petite + petite → grande, grande + grande → immense, mixte → grande)",
    /** Libellé proposé quand la case « regrouper » fusionne plusieurs fois le même type (règle « plus grand »). */
    mergedEstablishmentLabel: "Immense",
    rerollCard: "Relancer cette carte",
    copyOneLiner: "Copier le résumé",
    copyOneLinerSuccess: "Résumé copié dans le presse-papiers.",
    copyOneLinerError: "Impossible de copier (autorisez le presse-papiers).",
    rulebookPageAria: "Référence livre",
  },
  genders: {
    man: "♂ Homme",
    woman: "♀ Femme",
    nonBinary: "⚥ Non-binaire",
    indeterminate: "☿ Indéterminé",
  } satisfies Record<Gender, string>,
  races: {
    bruja: "Bruja",
    cucurbitus: "Cucurbitus",
    kiore: "Kiore",
    mousseron: "Mousseron",
  } satisfies Record<Race, string>,
  ageBands: {
    child: "Enfant",
    teenager: "Adolescent·e",
    adult: "Adulte",
    elderly: "Personne âgée",
  },
  personalities: {
    enthusiast: "Enthousiaste",
    poetic: "Poétique",
    sarcastic: "Sarcastique",
    charismatic: "Charismatique",
    grumpy: "Grincheux·se",
    curious: "Curieux·se",
    friendly: "Amical·e",
    embarrassed: "Gêné·e",
    hasty: "Pressé·e",
    dreamy: "Rêveur·se",
    calm: "Calme",
    joyful: "Joyeux·se",
    sad: "Triste",
  },
  suits: {
    hearts: "Cœur",
    diamonds: "Carreau",
    clubs: "Trèfle",
    spades: "Pique",
  },
  ranks: {
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    J: "Valet",
    Q: "Dame",
    K: "Roi",
    A: "As",
  },
  nav: {
    backHome: "← Accueil",
  },
} as const;

/** “Rank of suit” label for the current French UI. */
export function formatPlayingCard(
  suit: keyof typeof fr.suits,
  rank: keyof typeof fr.ranks,
): string {
  return `${fr.ranks[rank]} de ${fr.suits[suit]}`;
}

/** One-line share text: `♀ Ada (Bruja), Adolescent·e Amical·e (https://…)`. */
export function formatCharacterCopyOneLiner(
  roll: CharacterRoll,
  shareUrl: string,
): string {
  const age = getAgeBand(roll);
  const personality = getPersonality(roll);
  const g = genderCompactSymbol(roll.gender);
  const parts = [
    `${g} ${roll.name} (${fr.races[roll.race]}), ${fr.ageBands[age]} ${fr.personalities[personality]}`,
  ];
  if (roll.contextCard.rank === "7" && roll.contextSevenDie != null) {
    const kind = mapKindFromContextSevenDie(roll.contextSevenDie);
    parts.push(
      kind === "localisation"
        ? fr.character.contextSevenMapLocalisation
        : fr.character.contextSevenMapBiome,
    );
  }
  if (roll.contextCard.rank === "10" && roll.contextSpokenName) {
    parts.push(`${fr.character.contextSpokenNameLabel}: ${roll.contextSpokenName}`);
  }
  return `${parts.join(" — ")} (${shareUrl})`;
}

function stripBoldMarkers(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1");
}

/** One-line share: traits (sans mise en forme) + établissements. */
export function formatVillageCopyOneLiner(
  roll: VillageRoll,
  shareUrl: string,
): string {
  const { traits, establishments } = resolveVillageDisplay(roll);
  const t = traits.map((row) => stripBoldMarkers(row.text)).join(" — ");
  const e = establishments.map((row) => row.text).join(" — ");
  const body = [t, e].filter(Boolean).join(" — ");
  return `${body} (${shareUrl})`;
}

export function formatVillageRulebookPage(page: number): string {
  return `p. ${page}`;
}

export function formatVillageRulebookPagesJoined(pages: number[]): string {
  return [...new Set(pages)]
    .sort((a, b) => a - b)
    .map(formatVillageRulebookPage)
    .join(" · ");
}

export function villageRulebookRefsNoteFr(
  villageChapterPage: number,
  establishmentTablePage: number,
): string {
  return `Livre — Les villages (tirage, doublons) : p. ${villageChapterPage}. Table « Établissement » : p. ${establishmentTablePage}.`;
}
