import type { Gender, Race, Rank, Suit } from "@/lib/types";

/**
 * User-facing copy: UI chrome, rulebook citations, and localized game tables
 * (établissements, traits de village, contexte habitant). Inhabitant **names** live
 * in `inhabitant/data/namesByRace.ts` (rulebook proper nouns, not localized).
 */
export const copy = {
  appName: "LSDP — Companion de jeu",
  metadata: {
    title: "LSDP — Companion de jeu",
    description:
      "Companion de jeu pour Les Souvenirs du Protecteur : gestionnaires, générateurs de personnages, villages et plus.",
  },
  common: {
    loading: "Chargement…",
    emDashSpaced: " — ",
  },
  hub: {
    title: "Companion du Protecteur",
    subtitle: "Ce site rassemble des outils, un gestionnaires de personnages et des générateurs aléatoires d’habitants et villages, et davantage pour accompagner une partie du jeu « Les Souvenirs du Protecteur », par Enzo Salviato.",
    inhabitantCardTitle: "Générateur d’habitant",
    inhabitantCardDescription:
      "Nom, faction, âge, personnalité, contexte, genre.",
    villageCardTitle: "Générateur de village",
    villageCardDescription:
      "Établissements, et traits du village.",
    characterCardTitle: "Gestionnaire de personnages",
    characterCardDescription:
      "Fiches jouables persistantes comprenant les ressources, l’inventaire, les sorts et les notes arbitraires.",
    characterRecentTitle: "Derniers personnages",
    characterRecentEmpty: "Aucun personnage récent.",
    open: "Ouvrir",
    generatorsTitle: "Générateurs",
    managersTitle: "Gestionnaires",
    quickToolsTitle: "Outils rapides",
    dieToolTitle: "Dé",
    dieToolEmpty: "Aucun lancer",
    dieToolAction: "Lancer 1D6",
    dieToolRolling: "Lancer en cours…",
    cardToolTitle: "Carte",
    cardToolEmpty: "Aucune carte",
    cardToolAction: "Tirer 1 carte",
    cardToolDrawing: "Tirage en cours…",
  },
  inhabitant: {
    pageTitle: "Générateur d’habitant",
    pageDescription:
      "Générez un personnage pour le jeu, puis copiez son lien unique. Vous pouvez relancer certaines caractéristiques à souhait.",
    rollAll: "Générer",
    emptySummaryBefore: "Cliquez sur « ",
    emptySummaryAfter: " » pour tirer un habitant.",
    sectionRace: "Faction",
    sectionGender: "Genre",
    sectionAge: "Âge",
    sectionPersonality: "Personnalité",
    sectionContext: "Contexte",
    sectionName: "Nom",
    raceDieLabel: "1D6",
    nameDiceLabel: "2D6",
    cardLabel: "Carte",
    contextCardNote: "Seule la hauteur de la carte compte pour le contexte ; la couleur est ignorée.",
    copyHint: "Copiez le texte de contexte depuis le livre si vous éditez les données.",
    rerollRace: "Relancer le type (D6)",
    rerollName: "Relancer le nom (2D6)",
    rerollAgeCard: "Relancer la carte d’âge",
    rerollPersonalityCard: "Relancer la carte de personnalité",
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
    rollAll: "Générer",
    emptySummaryBefore: "Cliquez sur « ",
    emptySummaryAfter: " » pour générer un village.",
    sectionTraits: "Traits du village",
    sectionEstablishments: "Établissements",
    ownerLabel: "Propriétaire",
    coOwnersLabel: "Copropriétaires",
    openInInhabitantBuilder: "Ouvrir dans le générateur d’habitant",
    rerollOwner: "Regénérer cette habitant·e",
    duplicateRuleHint:
      "Si vous tirez deux fois le même établissement : soit **deux** lieux du même type, soit **un seul** plus grand et imposant — à trancher à la table.",
    groupedToggle: "Regrouper les doublons",
    groupedToggleTooltip:
      "petite + petite → grande, grande + grande → immense, mixte → grande",
    mergedEstablishmentLabel: "Immense",
    rerollCard: "Relancer cette carte",
    copyOneLiner: "Copier le résumé",
    copyOneLinerSuccess: "Résumé copié dans le presse-papiers.",
    copyOneLinerError: "Impossible de copier (autorisez le presse-papiers).",
    rulebookPageAria: "Référence livre",
  },
  characters: {
    pageTitle: "Gestionnaire de personnages",
    pageDescription:
      "Créez et gérez vos personnages jouables. Les fiches sont enregistrées localement dans ce navigateur.",
    sheetTitle: "Fiche personnage",
    sheetDescription:
      "Modifiez les valeurs pendant la partie. Les changements sont sauvegardés localement.",
    create: "Créer un personnage",
    import: "Importer JSON",
    export: "Copier export JSON",
    exportAll: "Copier export JSON",
    exportOne: "Copier export JSON",
    open: "Ouvrir",
    save: "Sauvegarder",
    saveSuccess: "Fiche sauvegardée.",
    delete: "Jeter",
    cancel: "Annuler",
    unsavedChangesTitle: "Modifications non sauvegardées",
    unsavedChangesDescription:
      "Vous avez des changements qui ne sont pas sauvegardés. Si vous quittez maintenant, ils seront perdus.",
    unsavedChangesLeave: "Quitter sans sauvegarder",
    unsavedChangesStay: "Annuler",
    deleteConfirmTitle: "Supprimer ce personnage ?",
    deleteConfirmDescription: "Cette action est locale et irréversible.",
    deleteSuccess: "Personnage supprimé.",
    exportCopied: "Export JSON copié dans le presse-papiers.",
    exportCopyError: "Impossible de copier l’export JSON.",
    importError: "Import impossible. Vérifiez le fichier JSON.",
    importSuccess(total: number, created: number, updated: number): string {
      return `Import terminé (${total} lus, ${created} créés, ${updated} mis à jour).`;
    },
    empty: "Aucun personnage pour le moment. Créez-en un pour commencer.",
    unnamed: "Sans nom",
    updatedLabel: "Mis à jour",
    backToLibrary: "← Retour à la bibliothèque",
    notFoundTitle: "Personnage introuvable",
    notFoundDescription:
      "Cette fiche n’existe pas (ou plus) dans ce navigateur.",
    identitySection: "Identité",
    characteristicsSection: "Caractéristiques",
    resourcesSection: "Ressources",
    poolsSection: "Jauges",
    inventorySection: "Inventaire",
    spellbookSection: "Grimoire",
    notesSection: "Notes",
    mapSection: "Carte",
    nameLabel: "Nom",
    archetypeLabel: "Archétype",
    archetypes: {
      warrior: "Guerrier·e",
      pilgrim: "Pèlerin·e",
      bard: "Troubadour·esse",
    },
    archetypePowerLabel: "Pouvoir d’archétype",
    archetypePowers: {
      warrior:
        "Le pouvoir de l’épée : quand vous le souhaitez, vous pouvez fuir une bataille sans avoir à lancer de dés ni risquer de subir des dégâts.",
      pilgrim:
        "Le pouvoir du bâton : vous n’avez besoin de vous nourrir qu’une fois par jour, à la fin de chaque nuit.",
      bard:
        "Le pouvoir de la mandoline : lorsque vous arrivez dans un village pour la première fois, vous pouvez jouer une chanson et gagner 1D6 × 10 pièces.",
    },
    genderLabel: "Genre",
    honorLabel: "Honneur",
    inspirationLabel: "Inspiration",
    moneyLabel: "Pièces",
    honorTooltip:
      "L’air, les cours d’eau, les créatures et les ombres perçoivent l’Honneur autour de vous. Plus votre Honneur est grand, plus vous êtes respecté.\nEn aidant les autres, en protégeant vos souvenirs et en accomplissant votre mission, vous gagnerez de l’Honneur. Mais attention, céder à la violence ou nuire à une créature vous fera perdre de l’Honneur. Les points d’Honneur peuvent être négatifs et, si c’est le cas, votre liberté d’acheter des objets ou d’entrer dans certains endroits sera limitée.",
    inspirationTooltip:
      "C’est votre lien avec le monde qui vous entoure.\nÀ chaque fois que vous faites preuve de créativité, que vous aidez quelqu’un ou que vous êtes heureux de la découverte que vous venez de faire, vous pouvez vous récompenser en gagnant un point d’Inspiration. Soyez bienveillant avec vous-même à chaque fois que vous contribuez à façonner le monde qui vous entoure.",
    moneyTooltip:
      "Elles permettent de faire du commerce, en achetant ou vendant des objets.",
    healthLabel: "Points d’Âme",
    courageLabel: "Points de Courage",
    staminaLabel: "Points d’Endurance",
    healthTooltip:
      "Ils représentent votre force vitale.\nChaque fois que vous vous retrouvez dans un environnement hostile ou face à une créature dangereuse, vos points d’Âme seront menacés. S’ils atteignent zéro, votre Protecteur meurt.",
    courageTooltip:
      "Ils représentent votre capacité à réaliser ce que vous voulez.\nÀ chaque fois que vous avez besoin de faire quelque chose qui pourrait mal tourner — courir, sauter, vous cacher, distraire, fuir, attaquer, etc. —, vous devez utiliser votre Courage.",
    staminaTooltip:
      "Ils représentent votre capacité à continuer d’avancer.\nVos points d’Endurance déterminent la quantité d’objets que vous pouvez porter ou le temps que l’Horloge met à avancer.",
    courageRollAria: "Lancer un test de Courage",
    courageRollTooltip: "Lancer 1D6 pour un test de Courage",
    courageRollSuccessTitle: "Test de Courage réussi",
    courageRollFailureTitle: "Test de Courage échoué",
    courageRollResult(roll: number, target: number): string {
      return `Résultat du dé : ${roll}. Courage actuel : ${target}. ${roll <= target ? "Réussite (≤)." : "Échec (>)."}`;
    },
    currentLabel: "Actuel",
    maxLabel: "Max",
    addItem: "Ajouter un objet",
    addSpell: "Ajouter un sort",
    itemNamePlaceholder: "Nom d’objet",
    itemNotePlaceholder: "Note",
    spellNamePlaceholder: "Nom du sort",
    spellNotePlaceholder: "Note",
    inventoryStatus(count: number, cap: number): string {
      return `Objets : ${count} / ${cap}`;
    },
    spellbookStatus(count: number): string {
      return `Sorts : ${count} / 6`;
    },
    inventoryFootnote: "Livre de règles — Les autres valeurs du jeu → L’inventaire : p. 8.",
    spellbookFootnote: "Livre de règles — La Magie : p. 14.",
    characteristicsFootnote: "Livre de règles — Les Attributs de votre Protecteur : p. 7–8.",
    clockSection: "Horloge",
    clockHelp:
      "L’Horloge suit le temps et l’appétit. Elle est divisée selon votre Endurance actuelle.",
    clockTooltip:
      "L’Horloge est divisée en deux moitiés : Jour et Nuit.\nChaque moitié contient autant de tranches que votre Endurance actuelle.\nÀ chaque entrée dans un hexagone, avancez d’une tranche. Si votre Endurance change, l’Horloge doit être réorganisée.",
    clockFootnote:
      "Livre de règles — L’Horloge (exploration, Jour/Nuit, Endurance) : p. 10–11.",
    clockDay: "Jour",
    clockNight: "Nuit",
    clockAdvance: "Avancer d’une tranche",
    clockBack: "Revenir d’une tranche",
    clockPhaseShiftTitle(nextPhase: string) {
      if (nextPhase === 'Jour') return `Levée du jour`
       else return `Tombée de la nuit`
    },
    clockPhaseShiftDescription(slice: string): string {
        return `N’oubliez pas de consommer de la nourriture pour ne pas avoir faim.\n${slice}`
    },
    clockSlice(position: number, total: number): string {
      return `Tranche : ${position} / ${total}`;
    },
    mapSheet(sheetQ: number, sheetR: number): string {
      return `Feuille (${sheetQ}, ${sheetR})`;
    },
    mapCenterOnCurrent: "Centrer sur ma position",
    mapCharacterPosition: "Position du personnage",
    mapSelectedCell: "Case sélectionnée",
    mapCell: "Hexagone",
    mapCore: "Le Noyau",
    mapUnexplored: "Inexploré",
    mapMoveHere: "Se déplacer ici",
    mapClearCell: "Effacer la case",
    mapBiomeLabel: "Biome",
    mapIconLabel: "Icône",
    mapPickEmoji: "Choisir une icône…",
    mapClearIcon: "Retirer l’icône",
    mapEmojiSearchPlaceholder: "Rechercher une emoji…",
    mapIconPlaceholder: "Emoji ou symbole",
    mapBiomes: {
      shadowForest: "Forêt des ombres",
      floodedPlains: "Plaines inondées",
      mushroomJungle: "Jungle de champignons",
      fieldSea: "Mer champêtre",
      silentDesert: "Désert silencieux",
      giganticGardens: "Jardins gigantesques",
    },
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
    backToVillage: "← Retour au village",
    navMid: " | ",
    homeLink: "Accueil",
  },
  a11y: {
    generatorBreadcrumb: "Navigation",
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
      "Livre de règles — Les villages : p. 42. Table « Établissement » : p. 43.",
    inhabitantFootnote:
      "Livre de règles — Les habitants : p. 56–58. Table des noms : p. 60.",
  },
  game: {
    inhabitantContextByRank: {
      A: "**Cette habitant·e pleure une perte récente.** Iel a peut-être perdu un animal de compagnie ou un·e ami·e proche. Peut-être qu’une discussion serait la bienvenue ? À moins qu’iel ait besoin d’écoute pour se sentir mieux ?",
      "2": "**Cette habitant·e est à la recherche de quelque chose.** Peut-être quelque chose qui n’est pas vendu dans ce village, ou quelque chose que l’on ne peut trouver que loin d’ici ? Mais au-delà de ça, iel semble avoir peur de l’inconnu. Il y a peut-être une histoire derrière tout ça.",
      "3": "**Cette habitant·e rêve de voyager dans un autre village.** Peut-être pourriez-vous l’accompagner et en savoir plus sur ses motivations et ses envies !",
      "4": "**Cette habitant·e est très malade et n’a plus que peu de temps à vivre.** Iel est seul·e et personne pour l’épauler dans ces instants difficiles. Peut-être qu’une conversation lui donnerait un peu de baume au cœur ? *Si vous avez rencontré cette habitant·e dans un village, la prochaine fois que vous visiterez cet endroit, vous devrez réussir un test de Courage pour le·a retrouver.*",
      "5": "**Cette habitant·e cherche l’amitié — ou peut-être l’amour ?** Vous n’en êtes pas sûr·e, mais iel semble se sentir seul·e. Vous pouvez l’aider à trouver quelqu’un·e qui cherche quelque chose de similaire.",
      "6": "**Cette habitant·e se languit d’un être cher.** Peut-être est-ce quelqu’un·e qui vit ailleurs ou qui vient juste de partir. Mais iel est aussi à la recherche d’un objet très spécial qui lui rappelle cette personne. Quel est cet objet ?",
      "7": "Cette habitant·e est **cartographe**. Vous le·a croisez alors qu’iel va quitter le village et iel reconnaît en vous un voyageur. Iel vous offre une de ses cartes. Lancez un D6 : *Carte de localisation (1-3)* ou *Carte de biome (4-6)* (voir p. 49).",
      "8": "Cette habitant·e est **en train de peindre un tableau**. Se rendant compte que vous êtes un voyageur, iel vous demande si vous avez un croquis représentant un endroit qui lui est inconnu, ou si vous pouvez décrire un panorama que vous avez vu au cours de votre voyage ! Iel ne s’est jamais aventuré dans des endroits éloignés de son village et recherche l’inspiration !",
      "9": "Il existe des rumeurs sur de mystérieuses Ruines parsemées à travers le monde et **cette habitant·e est curieux·se d’en savoir plus sur le sujet**. Voyant que vous êtes un·e voyageur·se, iel s’approche de vous pour voir si vous avez des informations à partager !",
      "10": "**Cette habitant·e prononce un nom en errant dans le village.** De qui s’agit-il ? Pourquoi cette habitant·e prononce-t-il ce nom ? Que s’est-il passé ? *Si vous devez créer un nom, consultez la table page 60.*",
      J: "**Cette habitant·e achète des objets provenant d’autres endroits du monde et offre 100 pièces pour chaque objet digne de son intérêt.** Parlez-lui ! Peut-être que vous avez sur vous un objet qu’iel pourrait acquérir.",
      Q: "**Cette habitant·e ressemble à quelqu’un que vous avez déjà rencontré.** S’agit-il d’une impression ? Vous pouvez toujours lui demander pour en avoir le cœur net. Iel a peut-être déjà croisé votre chemin, à moins que ce ne soit un·e inconnu·e avec de nouvelles histoires à raconter !",
      K: "**Cette habitant·e est bâtisseur·se.** Iel vous dit qu’avec 3 bois et 3 fers ou avec 1,000 pièces, iel peut construire l’établissement de votre choix dans le village.",
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

/** Context hook by card rank (suit ignored); alias of `copy.game.inhabitantContextByRank`. */
export const contextByRank: Record<Rank, string> =
  copy.game.inhabitantContextByRank as Record<Rank, string>;

/** Screen reader label: « {rang} de {couleur} » (wording lives in `copy.ranks` / `copy.suits`). */
export function playingCardAriaLabel(suit: Suit, rank: Rank): string {
  return `${copy.ranks[rank]} de ${copy.suits[suit]}`;
}
