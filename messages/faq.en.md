- [How do I use the site?](#how-do-i-use-the-site)
- [Is it usable on mobile?](#is-it-usable-on-mobile)
- [What is the user account for?](#what-is-the-user-account-for)
- [How do I play offline?](#how-do-i-play-offline)
- [What are the biome pages for?](#what-are-the-biome-pages-for)
- [What’s missing from the site?](#whats-missing-from-the-site)
- [What’s the “inheritance” thing?](#whats-the-inheritance-thing)
- [Why isn’t the map hexagonal?](#why-isnt-the-map-hexagonal)
- [Why is there a gender system?](#why-is-there-a-gender-system)

**→ To discover ProMe, please visit the [About](/en/about) page.**

## How do I use the site?

More or less the same way as the paper version of the game. It’s recommended to have the app open on your screen while playing, as a reference and to track your progress. Each “turn”:

1. Move on the map. Depending on your settings, the Clock advances automatically, and a new entry is added to the journal; otherwise, do this manually.
2. Roll a die and refer to the encounter table to see what event occurs; you’ll need the rulebook for this step.
3. If you can and want to collect or mine resources, refer to the gathering table and roll a die to determine what you find.
4. Record your day’s adventure in the journal to make your journey canonical.
5. Save your progress at any time.

## Is it usable on mobile?

Usable? Absolutely. The site is fully responsive and can be installed on the home screen like a native app.

Enjoyable? That’s less certain. Just as the physical game provides an A4-sized map and character sheet, the site is designed for use on a computer screen that offers ample space and visibility. The site is responsive, but I don't know if the gaming experience will be as enjoyable on mobile.

## What is the user account for?

It’s just for syncing your data across multiple devices or browsers.

By default, the site saves your characters locally in your browser. This means that changing browsers, devices, or clearing your cache will result in data loss.

By [logging in](/en/login) with your Google account, your characters are saved in the cloud, allowing you to access them from any device without risking data loss.

Alternatively, you can export your characters in JSON format from their profile to reimport them later. This can be useful if you want to keep a save point before a particular gaming session: export your character so you can restore it if needed.

## How do I play offline?

When you load the site for the first time, your browser caches all the pages. From that point on, no requests are made from the site, and an internet connection is no longer necessary. You can play entirely offline, and data is saved locally.

If you’re logged into the site with your Google account, data synchronization cannot occur without an internet connection. However, as soon as your connection is restored, your local and cloud data will sync.

## What are the biome pages for?

Mostly for exposition. They’re not necessary for gameplay and are there to gather content about each biome. They were also an opportunity to create visually rich pages that highlight the images and themes of each biome.

## What’s missing from the site?

Encounters are not fully implemented. Each biome’s encounter table is available near the map and on the biome pages, but you’ll need to refer to the rulebook for most encounters. This likely won’t change, as I’m not authorized (and do not want) to make the game fully playable without owning the rulebook.

Additionally, shop inventories are not implemented. This means that when creating a village, you need to manually define the offers and then note them in the journal to revisit later.

## What’s the “inheritance” thing?

Inheritance is just the name I gave to the process of creating a new character after a Protector dies. It enables inheriting from the map and journal of the former Protector. It is implemented according to the official rules.

## Why isn’t the map hexagonal?

To render hexagons, the mapping module uses modern styling features (CSS) that aren’t yet widely supported by browsers. In some browsers, the map tiles are circular to maintain the same layout as the official map.

It’s best to use the Chrome browser, as that’s what I use for development.

## Why is there a gender system?

Like it or not, the official game has no concept of gender, so all characters — playable or not — are genderless. I found it interesting and more immersive to be able to define characters’ genders. It’s completely optional, and I’ve made it permissive with multiple options.
