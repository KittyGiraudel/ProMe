# LSDP

This application is a companion app for the game “Les Souvenirs du Protecteur”, a solo TTRPG. It is meant to have open while playing the game, as a reference, a helper and a way to keep game progress.

Here are the features:

- A NPC generator, following the rules from the rulebook.
- A village generator, following the rules from the rulebook.
- A Protector manager, to create, update and delete playable characters.
- A character sheet manager for each protector, divided into sections:
  - An identity & stats section for the main values (health, stamina…)
  - A map module to explore and annotate the game map
  - An inventory and spell book manager
  - A live journal for the role playing part
  - Some tools (like rolling a die or drawing a playing card)
  - An administrative section to perform actions (export, kill, delete…)
- A settings page for application wide settings.

## Usage

Clone the repository locally, install the dependencies, start the server and open the local URL in Chrome.

```sh
git clone git@github.com:KittyGiraudel/lsdp
npm install
npm run dev # http://localhost:3000
```

## Requirements

This application should largely work on any browser, including on mobile, but the map module is limited to Chrome. It makes use of modern CSS features that are currently not available outside of Chrome.

## Data storage

This application does not have authentication, or a database: it stores your data, such as settings or your character sheets, in the local storage of your browser. You can always export your data as JSON to synchronize to with another browser.

## Localization

This application is primarily developed in French because my copy of the game is in French. The English version was translated from French using AI without support from the rulebook, therefore certain terms may vary from the original wording.

Adding a new language should be trivial:

- Add a new JSON file in the `messages/` directory named after the new locale.
- Add all the keys and their translations, using the `fr.json` file as a template.
- Add the new locale to `src/i18n/routing.ts`.

## Acknowledgements

The game itself was created and designed by Enzo Salviato — all credits go to him. This application is nothing more than a gaming companion, mostly to allow playing the game digitally (although not in full — owning and using the rulebook remains required).
