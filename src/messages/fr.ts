import type { Gender, Race, Rank, Suit } from "@/lib/types";

/**
 * User-facing copy: UI chrome, rulebook citations, and localized game tables
 * (établissements, traits de village, contexte habitant). Inhabitant **names** live
 * in `character/data/namesByRace.ts` (rulebook proper nouns, not localized).
 */
export const copy = {
  appName: "LSDP — Outils",
  metadata: {
    title: "LSDP — Outils de jeu",
    description:
      "Companion de jeu pour Les Souvenirs du Protecteur — personnages, villages et plus.",
  },
  common: {
    loading: "Chargement…",
    emDashSpaced: " — ",
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
    contextCardNote: "Seule la hauteur compte pour le contexte.",
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
      "Tirez 5 cartes comme au livre : chaque carte indique un établissement ou un trait. Un habitant est généré par établissement (copropriété si fusion). Partagez via l’URL.",
    villageRaceLabel: "Peuple du village",
    rollAll: "Tirer 5 cartes",
    emptySummaryBefore: "Cliquez sur « ",
    emptySummaryAfter: " » pour générer un village.",
    sectionTraits: "Traits du village",
    sectionEstablishments: "Établissements",
    ownerLabel: "Propriétaire",
    coOwnersLabel: "Copropriétaires",
    openInCharacterBuilder: "Ouvrir dans le générateur d’habitant",
    rerollOwner: "Regénérer cet habitant",
    duplicateRuleHint:
      "Si vous tirez deux fois le même établissement : soit **deux** lieux du même type, soit **un seul** plus grand et imposant — à trancher à la table.",
    groupedToggle:
      "Regrouper les doublons (petite + petite → grande, grande + grande → immense, mixte → grande)",
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
  a11y: {
    dieSingle(value: number): string {
      return `Dé ${value}`;
    },
    diceList(commaJoinedRest: string, last: number): string {
      return `Dés ${commaJoinedRest} et ${last}`;
    },
  },
  rulebook: {
    pageCitation(page: number): string {
      return `p. ${page}`;
    },
    villageFootnote:
      "Livre — Les villages (tirage, doublons) : p. 42. Table « Établissement » : p. 43.",
    characterFootnote:
      "Livre — Les habitants (tirage, cartes, contexte) : p. 56–58. Table des noms : p. 60.",
  },
  game: {
    characterContextByRank: {
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
    } satisfies Record<Rank, string>,
    villageTraits: {
      J: {
        red: "**Ville.** C’est une **grande colonie**. Tirez **3 cartes d’établissement supplémentaires** ; si vous tirez une **figure** (valet, dame, roi), **ignorez-la** et tirez à nouveau jusqu’à obtenir une **carte numérotée**.",
        black:
          "**Merveille.** Le village est **d’une beauté exceptionnelle**. Décrivez-le. Vous gagnez **2 points d’Inspiration**.",
      },
      Q: {
        red: "**Fortifié.** Le village est **entouré de murs** avec une **entrée gardée**. Vous devez avoir **au moins 1 point d’Honneur** pour y entrer.",
        black:
          "**Luxuriant.** Il comporte une **étendue d’eau** (rivière, lac, etc.) et un **jardin**. Vous pouvez utiliser la **table de collecte du biome** **sans équipement particulier**.",
      },
      K: {
        red: "**Abandonné.** Les bâtiments semblent **inhabités**. Les **établissements sont inopérants** tant que quelqu’un ne décide pas de **reconstruire le village**.",
        black:
          "**Nomade.** Le village **se déplace**. Lorsque vous revenez sur cette **case de carte**, vous devez réussir un **test de Courage**. En cas d’**échec**, le village **n’est plus là**.",
      },
    },
    villageEstablishments: {
      establishmentSizeTierLines: {
        "2": [
          "Petite boutique de potions",
          "Grande boutique de potions",
          "Immense boutique de potions",
        ],
        "3": [
          "Petite boutique d’équipement",
          "Grande boutique d’équipement",
          "Immense boutique d’équipement",
        ],
        "4": [
          "Petite boutique de vêtements",
          "Grande boutique de vêtements",
          "Immense boutique de vêtements",
        ],
        "5": [
          "Petite taverne",
          "Grande taverne",
          "Immense taverne",
        ],
        "6": [
          "Petit bureau de cartographie",
          "Grand bureau de cartographie",
          "Immense bureau de cartographie",
        ],
        "7": [
          "Petite auberge",
          "Grande auberge",
          "Immense auberge",
        ],
        "8": [
          "Petite agence de missions",
          "Grande agence de missions",
          "Immense agence de missions",
        ],
      },
      rankA: {
        red: "Oratoire permanent",
        black: "Oratoire éphémère",
      },
      rank9: {
        red: "Gare en activité",
        black: "Gare à l'abandon",
      },
      rank10: "Ruines",
    },
  },
} as const;

/** Context hook by card rank (suit ignored); alias of `copy.game.characterContextByRank`. */
export const contextByRank: Record<Rank, string> =
  copy.game.characterContextByRank as Record<Rank, string>;

/** Screen reader label: « {rang} de {couleur} » (wording lives in `copy.ranks` / `copy.suits`). */
export function playingCardAriaLabel(suit: Suit, rank: Rank): string {
  return `${copy.ranks[rank]} de ${copy.suits[suit]}`;
}
