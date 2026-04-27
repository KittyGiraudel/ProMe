- [Comment utiliser le site ?](#comment-utiliser-le-site)
- [Est-ce utilisable sur mobile ?](#est-ce-utilisable-sur-mobile)
- [À quoi sert le compte utilisateur ?](#à-quoi-sert-le-compte-utilisateur-)
- [Comment jouer hors-ligne ?](#comment-jouer-hors-ligne-)
- [À quoi servent les pages de biomes ?](#à-quoi-servent-les-pages-de-biomes-)
- [Que manque-t-il dans le site ?](#que-manque-t-il-dans-le-site)
- [Qu’est-ce que « l’héritage » ?](#quest-ce-que-lhéritage--)
- [Pourquoi la carte n’est-elle pas hexagonale ?](#pourquoi-la-carte-nest-elle-pas-hexagonale)
- [Pourquoi y a-t-il un système de genre ?](#pourquoi-y-a-t-il-un-système-de-genre)

**→ Pour découvrir ProMe, veuillez visiter la page [À Propos](/fr/about).**

## Comment utiliser le site ?

Plus ou moins de la même manière que la version papier du jeu. Il est suggéré d’avoir l’application ouverte à l’écran en jouant au jeu, comme référence et pour pouvoir marquer sa progression. À chaque « tour » :

1. Déplacez-vous sur la carte. Selon vos paramètres, l’Horloge avance automatiquement, et une nouvelle entrée est ajoutée au journal ; sinon, faites cela manuellement.
2. Tirez un dé et référez-vous à la table des rencontres pour savoir quel événement se produit ; il vous faut le livre de règles pour cette étape.
3. Si vous pouvez et voulez collecter ou miner des ressources, référez-vous à la table de collecte et lancez un dé pour déterminer ce que vous pouvez trouver.
4. Renseignez votre aventure du jour dans le journal pour rendre votre voyage canonique.
5. Sauvegardez votre progression à tout moment.

## Est-ce utilisable sur mobile ?

Utilisable ? Absolument ; le site est entièrement responsive, et peut être installé à l’écran d’accueil comme une application native.

Agréable ? C’est moins certain. De la même manière que le jeu papier donne une carte et fiche de personnage au format A4, le site est fait pour être utilisé sur un écran d’ordinateur qui offre de la place et visibilité. Le site est responsive, mais je ne sais pas si l’expérience de jeu sera aussi agréable sur mobile.

## À quoi sert le compte utilisateur ?

Juste à synchroniser vos données entre plusieurs appareils ou navigateurs.

Par défaut, le site sauvegarde vos personnages localement dans votre navigateur. Cela signifie que changer de navigateur, d’appareil, ou vider le cache entraîne la perte des données.

En vous [connectant au site](/fr/login) avec votre compte Google, vos personnages sont sauvegardés dans le cloud pour pouvoir y accéder depuis n’importe quel appareil, sans risque de perdre vos données.

Sinon, vous pouvez exporter vos personnages au format JSON depuis leur fiche, pour pouvoir les réimporter. Cela peut être utile si vous voulez garder un point de sauvegarde avant une session de jeu particulière : exportez votre personnage pour pouvoir le restaurer si besoin.

## Comment jouer hors-ligne ?

Lorsque vous chargez le site la première fois, votre navigateur met toutes les pages en cache. À partir de là, aucune requête n’est faite depuis le site et une connexion internet n’est plus nécessaire. Vous pouvez jouer intégralement hors-ligne, et la sauvegarde des données est faite localement.

Si vous êtes connecté·e au site avec votre compte Google, la synchronisation des données ne peut pas avoir lieu sans connexion internet. Mais dès que votre connexion est rétablie, vos données locales et dans le cloud sont synchronisées.

## À quoi servent les pages de biomes ?

À faire de l’exposition, principalement. Elles ne sont pas nécessaires pour jouer, et sont là pour rassembler du contenu sur chaque biome. C’était aussi l’occasion de faire des pages créatives qui mettent en avant les images et le thème de chaque biome.

## Que manque-t-il dans le site ?

Les rencontres ne sont pas vraiment implémentées. La table de rencontres de chaque biome est disponible près de la carte ainsi que dans les pages de biomes, mais il est nécessaire de se référer au livre de règles pour effectuer la majorité des rencontres. Ceci ne changera probablement pas car je ne suis pas autorisée et ne souhaite pas rendre le jeu intégralement jouable sans posséder le livre de règles.

De plus, le stock des boutiques n’est pas implémenté non plus. Cela signifie qu’à la création d’un village, il est nécessaire de définir les offres manuellement, puis de les noter dans le journal pour y revenir plus tard.

## Qu’est-ce que « l’héritage » ?

L’héritage est simplement le nom que j’ai donné au concept de création d’un personnage après la mort d’un Protecteur. Cela permet d’hériter de la carte ainsi que du journal du Protecteur précédent. L’héritage est implémenté selon les règles officielles du jeu.

## Pourquoi la carte n’est-elle pas hexagonale ?

Pour rendre des hexagones, le module de cartographie utilise des fonctionnalités de styles (CSS) modernes qui ne sont pas encore bien supportées par les navigateurs. Dans certains navigateurs, les cases de la carte sont circulaires, afin de garder la même mise en page que la carte officielle.

Il est préférable d’utiliser le navigateur Chrome, car c’est celui que j’utilise pour le développement.

## Pourquoi y a-t-il un système de genre ?

Que l’on soit d’accord ou non, le jeu officiel n’a pas de concept de genre donc tous les personnages — jouables ou non — sont sans genre. J’ai trouvé intéressant et plus immersif de pouvoir définir le genre des personnages. C’est complètement optionnel, et j’ai rendu les choses permissives avec plusieurs options.
