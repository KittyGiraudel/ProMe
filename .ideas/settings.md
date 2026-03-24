## Goal

I assume we will keep adding settings to this app, so I’d like to tackle it upfront and create a dedicated settings page. It will live at /settings, and feed these settings to a top-level React context that can then be consumed in components and hooks.

Our first setting could be the adaptive character sheet based on in-game day/night time. It can be a checkbox with an explanation there, and settings can be saved locally separately from the player sheet.

## Notes

- This means moving the adaptive character sheet setting out of the character save state. We do not need to keep backward compatibility for this.

## Open questions

- I think we may want to have proper theming eventually, like light/dark/auto mode. This is for later.
