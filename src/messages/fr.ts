import { BiomeId } from "@/lib/character/types";
import type { Gender, Faction, Rank, Suit } from "@/lib/types";

/**
 * User-facing copy: UI chrome, rulebook citations, and localized game tables
 * (établissements, traits de village, contexte habitant). Inhabitant **names** live
 * in `inhabitant/data/namesByFaction.ts` (rulebook proper nouns, not localized).
 */
export const copy = {
  appName: "LSDP — Companion de jeu",
  metadata: {
    title: "LSDP — Companion de jeu",
    description:
      "Companion de jeu pour Les Souvenirs du Protecteur : gestionnaires, générateurs de personnages, villages et plus.",
    tabBrand: "LSDP",
  },
  common: {
    loading: "Chargement…",
    checkSuccessWord: "succès",
    checkFailureWord: "échec",
    apply: 'Effectuer',
    rerollCard: "Relancer cette carte",
    rerollDie: "Relancer ce dé",
    rulebookPageLine: "Référence livre : {pages}",
    card: "{value} de {suit}",
    die: 'Dé {value}',
    collection(commaJoinedRest: string, last: number): string {
      return `${commaJoinedRest} et ${last}`;
    },
  },
  archetypes: {
    warrior: "Guerrier·e",
    pilgrim: "Pèlerin·e",
    bard: "Troubadour·esse",
  },
  biomes: {
    unexplored: "Inexploré",
    shadowForest: "Forêt des ombres",
    floodedPlains: "Plaines inondées",
    mushroomJungle: "Jungle de champignons",
    fieldSea: "Mer champêtre",
    silentDesert: "Désert silencieux",
    giganticGardens: "Jardins titanesques",
  } satisfies Record<BiomeId | 'unexplored', string>,
  genders: {
    man: "Homme",
    woman: "Femme",
    nonBinary: "Non-binaire",
    indeterminate: "Indéterminé",
  } satisfies Record<Gender, string>,
  factions: {
    bruja: "Bruja",
    cucurbitus: "Cucurbitus",
    kiore: "Kiore",
    mousseron: "Mousseron",
  } satisfies Record<Faction, string>,
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
  footer: {
    copyright: '© Les Souvenirs du Protecteur par Enzo Salviato — Application par Kitty'
  },
  hub: {
    title: "Accueil",
    inhabitantCardTitle: "Générateur d’habitant",
    inhabitantCardDescription:
      "Nom, faction, âge, personnalité, contexte, genre.",
    villageCardTitle: "Générateur de village",
    villageCardDescription:
      "Établissements, et traits du village.",
    characterCardTitle: "Gestionnaire de personnages",
    characterCardDescription:
      "Fiches jouables persistantes comprenant les ressources, l’inventaire, les sorts et les notes arbitraires.",
    settingsCardTitle: "Paramètres",
    settingsCardDescription:
      "Préférences locales de l’application, indépendantes des fiches de personnage.",
    characterRecentTitle: "Derniers personnages",
    characterRecentEmpty: "Aucun personnage récent.",
    open: "Ouvrir",
    generatorsTitle: "Générateurs",
    managersTitle: "Gestionnaires",
  },
  tools: {
    title: "Outils rapides",
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
    generate: "Générer",
    emptySummary: "Cliquez sur « {button} » pour générer un habitant.",
    sectionFaction: "Faction",
    sectionGender: "Genre",
    sectionAge: "Âge",
    sectionPersonality: "Personnalité",
    sectionContext: "Contexte",
    sectionName: "Nom",
    factionDieMeta: "1D6 : {dice}",
    nameDiceMeta: "2D6 : {dice}",
    cardMeta: "Carte : {card}",
    contextCardNote: "Seule la hauteur de la carte compte pour le contexte ; la couleur est ignorée.",
    rerollFaction: "Relancer la faction (D6)",
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
    contextSpokenNameLine: "Nom prononcé (2D6, p. 60) : {name}",
    rollContextSpokenNameDice: "Lancer les 2D6 (nom prononcé)",
    rerollContextSpokenNameDice: "Relancer le nom prononcé (2D6)",
    copyOneLiner: "Copier le résumé",
    copyOneLinerSuccess: "Résumé copié dans le presse-papiers.",
    copyOneLinerError: "Impossible de copier (autorisez le presse-papiers).",
    oneLiner: "{gender} {name} ({faction}) — {age}, {personality}"
  },
  village: {
    pageTitle: "Générateur de village",
    pageDescription:
      "Tirez 5 cartes comme au livre : chaque carte indique un établissement ou un trait. Un habitant est généré par établissement (copropriété si fusion). Partagez via l’URL.",
    villageFactionLabel: "Faction du village",
    generate: "Générer",
    emptySummary: "Cliquez sur « {button} » pour générer un village.",
    sectionTraits: "Traits du village",
    sectionEstablishments: "Établissements",
    ownerLabel: "Propriétaire :",
    coOwnersLabel: "Copropriétaires :",
    rerollOwner: "Regénérer cette habitant·e",
    mergedEstablishmentLabelTwo: "Immense {name}",
    mergedEstablishmentLabelMore: "Immense {name} (×{count})",
    copyOneLiner: "Copier le résumé",
    copyOneLinerSuccess: "Résumé copié dans le presse-papiers.",
    copyOneLinerError: "Impossible de copier (autorisez le presse-papiers).",
    linkSummary(factionLabel: string | null, establishmentCount: number): string {
      const noun = `établissement${establishmentCount > 1 ? 's' : ''}`
      if (factionLabel) return `Village (${factionLabel}), ${establishmentCount} ${noun}`
      return `Village, ${establishmentCount} ${noun}`
    },
  },
  characters: {
    pageTitle: "Personnages",
    pageDescription:
      "Créez et gérez vos personnages jouables. Les fiches sont enregistrées localement dans ce navigateur.",
    createPageTitle: "Nouveau personnage",
    createPageDescription:
      "Renseignez l’identité de base de votre personnage. Vous pourrez compléter la fiche ensuite.",
    sheetTitle: "Fiche personnage",
    sheetDescription:
      "Modifiez les valeurs pendant la partie. Les changements sont sauvegardés localement.",
    create: "Créer un personnage",
    import: "Importer un personnage",
    export: "Exporter JSON",
    exportHelp: "Télécharge un export JSON de la fiche.",
    open: "Ouvrir",
    save: "Sauvegarder",
    deadStatusLabel: "Mort·e",
    deadListSymbol: "✝",
    deadReadonlyTitle: "Protecteur décédé",
    deadReadonlyDescription:
      "Ce Protecteur est décédé. Par conséquent, cette fiche est figée et entièrement en lecture seule.",
    markDeadAction: "Marquer comme mort·e",
    markDeadConfirmTitle: "Marquer ce Protecteur comme mort ?",
    markDeadConfirmDescription:
      "Cette action fige définitivement la fiche en lecture seule.",
    markDeadSuccess: "Le Protecteur est désormais marqué comme mort.",
    deathSuggestionTitle: "Points d’Âme à 0",
    deathSuggestionDescription:
      "Votre Protecteur n’a plus de Points d’Âme. Vous pouvez le marquer comme mort.",
    reviveAction: "Réanimer",
    reviveConfirmTitle: "Réanimer ce Protecteur ?",
    reviveConfirmDescription:
      "Le Protecteur deviendra jouable et sa fiche sera modifiable à nouveau.",
    reviveSuccess: "Le Protecteur est de nouveau vivant.",
    createSuccess: "Personnage créé.",
    saveSuccess: "Fiche sauvegardée.",
    delete: "Supprimer",
    cancel: "Annuler",
    unsavedChangesTitle: "Modifications non sauvegardées",
    unsavedChangesDescription:
      "Vous avez des changements qui ne sont pas sauvegardés. Si vous quittez maintenant, ils seront perdus.",
    unsavedChangesLeave: "Quitter sans sauvegarder",
    unsavedChangesStay: "Annuler",
    deleteConfirmTitle: "Supprimer ce personnage ?",
    deleteConfirmDescription: "Cette action est irréversible — la fiche de personnage sera définitive supprimée.",
    deleteSuccess: "Personnage supprimé.",
    exportCopied: "Export JSON copié dans le presse-papiers.",
    exportCopyError: "Impossible de copier l’export JSON.",
    exportDownloaded: "Fichier JSON exporté.",
    exportDownloadError: "Impossible de télécharger le fichier JSON.",
    importError: "Import impossible. Vérifiez le fichier JSON.",
    importFormatError:
      "Format invalide. Le fichier doit contenir exactement un personnage exporté.",
    importDataError:
      "Le personnage importé est invalide et ne peut pas être sauvegardé.",
    importSuccess: 'Import terminé ({total} lus, {created} créés, {updated} mis à jour).',
    empty: "Aucun personnage pour le moment. Créez-en un pour commencer.",
    unnamed: "Sans nom",
    updatedLabel: "Mis à jour",
    updatedLine: "Mis à jour : {value}",
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
    notesSection: "Journal",
    tabIdentity: "Identité & Stats",
    tabMap: "Cartographie",
    tabInventory: "Inventaire & Grimoire",
    tabJournal: "Journal",
    tabTools: "Outils",
    tabActions: "Actions",
    dangerSectionTitle: "Zone de danger",
    dangerSectionDescription:
      "Actions sensibles de cycle de vie du Protecteur. À utiliser avec prudence.",
    dangerMarkDeadHelp:
      "Cette action fige la fiche en lecture seule tant que le Protecteur n’est pas réanimé.",
    inheritanceSection: "Héritage des souvenirs",
    inheritanceSelectLabel: "Hériter les souvenirs de …",
    inheritanceSelectHelp:
      "Si vous choisissez un Protecteur existant, ce nouveau Protecteur héritera de ses souvenirs (i.e. sa carte et son journal).",
    inheritanceSelectPlaceholder: "Choisir un Protecteur existant",
    inheritanceEmpty: "Aucun Protecteur existant",
    addJournalEntry: "Ajouter une entrée",
    journalEmpty: "Aucune entrée pour le moment.",
    journalEditEntry: "Éditer",
    journalDoneEditing: "Écrire",
    journalEntryContentLabel: "Contenu",
    journalEntryContentPlaceholder: "Écrivez votre entrée en Markdown…",
    journalSymbols: "Symboles à copier : ",
    journalPreviewEmpty: "Ajoutez du contenu pour afficher l’aperçu.",
    journalCreatedAtLabel: "Créé",
    journalUpdatedAtLabel: "Modifié",
    journalCreatedAtLine: "Créé : {value}",
    journalUpdatedAtLine: "Modifié : {value}",
    journalPermalink: "#",
    journalDeleteConfirmTitle: "Supprimer cette entrée ?",
    journalDeleteConfirmDescription:
      "Cette entrée contient du contenu. Cette suppression est irréversible.",
    mapSection: "Carte",
    nameLabel: "Nom",
    archetypeLabel: "Archétype",
    archetypeLine: "Archétype : {value}",
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
    courageRollTooltip: "Effectuer un Test de Courage",
    courageRollSuccessTitle: "Test de Courage réussi",
    courageRollFailureTitle: "Test de Courage échoué",
    courageRollResultSuccess: 'Résultat du dé : {roll}. Courage actuel : {target}. Réussite (≤).',
    courageRollResultFailure: 'Résultat du dé : {roll}. Courage actuel : {target}. Échec (>).',
    currentLabel: "Actuel",
    maxLabel: "Max",
    addItem: "Ajouter un objet",
    addSpell: "Ajouter un sort",
    itemNamePlaceholder: "Nom d’objet",
    itemNotePlaceholder: "Note",
    spellNamePlaceholder: "Nom du sort",
    spellNotePlaceholder: "Note",
    inventoryStatus: 'Objets : {count} / {cap}',
    spellbookStatus: 'Sorts : {count} / 6',
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
    clockAdvance: "Avancer",
    clockBack: "Revenir",
    clockPhaseShiftDay: 'Levée du jour',
    clockPhaseShiftNight: 'Tombée de la nuit',
    clockPhaseShiftDescription: 'N’oubliez pas de consommer de la nourriture pour ne pas avoir faim.',
    clockSlice: 'Tranche : {position} / {total}',
    mapSheet: 'Feuille : ({sheetQ}, {sheetR})',
    mapCenterOnCurrent: "Centrer sur ma position",
    mapCharacterPosition: "Position : {position}",
    mapSelectedCell: "Case sélectionnée : {cell}",
    mapCell: "Hexagone",
    mapCore: "Le Noyau",
    mapUnexplored: "Inexploré",
    mapMoveHere: "Se déplacer ici",
    mapMoveNeighborOnly: "Uniquement vers un hexagone adjacent",
    mapClearCell: "Effacer la case",
    mapMenuMarkingGroup: "Marquage",
    mapMenuActionsGroup: "Actions",
    mapBiomeLabel: "Biome",
    mapRandomBiome: "Biome aléatoire (1D6)",
    mapIconLabel: "Icône",
    mapPickEmoji: "Choisir une icône…",
    mapClearIcon: "Retirer l’icône",
    mapEmojiSearchPlaceholder: "Rechercher une emoji…",
    mapIconPlaceholder: "Emoji ou symbole",
    mapRandomBiomeDiscoveredTitle: "Nouveau biome découvert",
    mapRandomBiomeDiscoveredDescription(
      biomeName: string,
      additionalTilesToMark: number
    ): string {
      return `Vous découvrez ${biomeName}. Marquez ${additionalTilesToMark} case${additionalTilesToMark > 1 ? 's' : ''} adjacente${additionalTilesToMark > 1 ? 's' : ''} du même biome (${biomeName}).`
    },
  },
  nav: {
    backHome: "← Accueil",
    backToVillage: "← Retour au village",
    navMid: " | ",
    homeLink: "Accueil",
    charactersLink: "Personnages",
    inhabitantGeneratorLink: "Générateur d’habitant",
    villageGeneratorLink: "Générateur de village",
    settingsLink: "Paramètres",
  },
  settings: {
    pageTitle: "Paramètres",
    pageDescription:
      "Réglez les préférences globales de l’application. Elles sont enregistrées localement dans ce navigateur.",
    sectionSheet: "Feuille de personnage",
    sectionJournal: "Journal",
    sectionVillage: "Générateur de village",
    journalTimelineReverseChronologicalLabel:
      "Afficher le journal du plus récent au plus ancien",
    journalTimelineReverseChronologicalHelp:
      "Décochez pour un ordre chronologique (du plus ancien au plus récent).",
    villageMergeDuplicateEstablishmentsLabel:
      "Regrouper les doublons d’établissements",
    villageMergeDuplicateEstablishmentsHelp:
      "Fusionne les lignes identiques dans le résumé du village (petite + petite → grande, etc.) et compte les établissements de la même façon dans les liens du journal.",
    adaptiveNightModeLabel:
      "Assombrir la feuille quand l’horloge est à la nuit",
    adaptiveNightModeHelp:
      "Ce réglage s’applique à toutes les fiches personnage et n’est pas stocké dans les données de personnage.",
    saveSuccess: "Paramètres enregistrés.",
  },
  rulebook: {
    information: 'Information dans le livre de règles',
    pageCitation: 'p. {page}',
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
