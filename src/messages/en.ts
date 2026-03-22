import type { Gender, Race } from "@/lib/lsdp/types";

/** English UI copy (optional locale); game rule text may stay French in data files. */
export const en = {
  appName: "LSDP — Tools",
  metadata: {
    title: "LSDP — Play tools",
    description:
      "Generators for Les Souvenirs du Protecteur — characters, villages, and more.",
  },
  common: {
    loading: "Loading…",
  },
  hub: {
    title: "Les Souvenirs du Protecteur — tools",
    subtitle: "Random generators for play: characters, villages, and more.",
    characterCardTitle: "Inhabitant",
    characterCardDescription:
      "Type (D6), age & personality (card), context (card), name (2D6), gender (1D6, optional).",
    villageCardTitle: "Village",
    villageCardDescription:
      "5 cards: establishments (Ace–10) and village traits (face cards). Red jack: 3 extra establishments.",
    open: "Open",
  },
  character: {
    pageTitle: "Inhabitant generator",
    pageDescription:
      "Results follow the rulebook: roll everything at once or note outcomes at the table.",
    rollAll: "Generate all",
    emptySummaryBefore: "Click « ",
    emptySummaryAfter: " » to roll an inhabitant.",
    sectionRace: "Type / people",
    sectionGender: "Gender (optional, 1D6)",
    sectionAgePersonality: "Age & personality",
    sectionContext: "Context",
    sectionName: "Name",
    raceDieLabel: "1D6",
    nameDiceLabel: "2D6",
    cardLabel: "Card",
    contextCardNote: "(only rank matters for context)",
    copyHint: "Paste context text from the book when you edit the data files.",
    rerollRace: "Reroll type (D6)",
    rerollName: "Reroll name (2D6)",
    rerollAgePersonalityCard: "Reroll age & personality card",
    rerollContextCard: "Reroll context card",
    rerollGender: "Reroll gender (1D6)",
    contextSevenFollowupLabel: "Map offered (1D6, p. 49)",
    contextSevenMapLocalisation: "Location map (1–3)",
    contextSevenMapBiome: "Biome map (4–6)",
    rollContextSevenDie: "Roll D6 (map type)",
    rerollContextSevenDie: "Reroll D6 (map offered)",
    contextSpokenNameLabel: "Name spoken aloud (2D6, p. 60)",
    rollContextSpokenNameDice: "Roll 2D6 (spoken name)",
    rerollContextSpokenNameDice: "Reroll spoken name (2D6)",
  },
  village: {
    pageTitle: "Village generator",
    pageDescription:
      "Draw 5 cards as in the rulebook: each card is an establishment or a village trait. Share results via the URL.",
    rollAll: "Draw 5 cards",
    emptySummaryBefore: "Click « ",
    emptySummaryAfter: " » to generate a village.",
    sectionTraits: "Village traits",
    sectionEstablishments: "Establishments",
    duplicateRuleHint:
      "If you draw the same establishment twice: either **two** sites of that type, or **one** larger, more imposing site — decide at the table.",
    groupedToggle:
      "Group duplicates (small+small→large, large+large→immense, mixed→large)",
    mergedEstablishmentLabel: "Immense",
    rerollCard: "Reroll this card",
    copyOneLiner: "Copy summary",
    copyOneLinerSuccess: "Summary copied to clipboard.",
    copyOneLinerError: "Could not copy (clipboard permission).",
    rulebookPageAria: "Rulebook reference",
  },
  genders: {
    man: "♂ Man",
    woman: "♀ Woman",
    nonBinary: "⚥ Non-binary",
    indeterminate: "☿ Indeterminate",
  } satisfies Record<Gender, string>,
  races: {
    bruja: "Bruja",
    cucurbitus: "Cucurbitus",
    kiore: "Kiore",
    mousseron: "Mousseron",
  } satisfies Record<Race, string>,
  ageBands: {
    child: "Child",
    teenager: "Teenager",
    adult: "Adult",
    elderly: "Elder",
  },
  personalities: {
    enthusiast: "Enthusiast",
    poetic: "Poetic",
    sarcastic: "Sarcastic",
    charismatic: "Charismatic",
    grumpy: "Grumpy",
    curious: "Curious",
    friendly: "Friendly",
    embarrassed: "Embarrassed",
    hasty: "Hasty",
    dreamy: "Dreamy",
    calm: "Calm",
    joyful: "Joyful",
    sad: "Sad",
  },
  suits: {
    hearts: "Hearts",
    diamonds: "Diamonds",
    clubs: "Clubs",
    spades: "Spades",
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
    J: "Jack",
    Q: "Queen",
    K: "King",
    A: "Ace",
  },
  nav: {
    backHome: "← Home",
  },
} as const;

export function formatVillageRulebookPage(page: number): string {
  return `p. ${page}`;
}

export function formatVillageRulebookPagesJoined(pages: number[]): string {
  return [...new Set(pages)]
    .sort((a, b) => a - b)
    .map(formatVillageRulebookPage)
    .join(" · ");
}

export function villageRulebookRefsNoteEn(
  villageChapterPage: number,
  establishmentTablePage: number,
): string {
  return `Book — Villages (draw, duplicates): p. ${villageChapterPage}. “Establishment” table: p. ${establishmentTablePage}.`;
}
