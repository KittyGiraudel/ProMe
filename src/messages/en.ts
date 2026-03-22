import type { Race } from "@/lib/lsdp/types";

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
    subtitle: "Random generators for play: characters, with more to come.",
    characterCardTitle: "Inhabitant",
    characterCardDescription:
      "Type (D6), age & personality (card), context (card), name (2D6).",
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
    sectionAgePersonality: "Age & personality",
    sectionContext: "Context",
    sectionName: "Name",
    raceDieLabel: "1D6",
    nameDiceLabel: "2D6",
    cardLabel: "Card",
    contextCardNote: "(only rank matters for context)",
    copyHint: "Paste context text from the book when you edit the data files.",
  },
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
