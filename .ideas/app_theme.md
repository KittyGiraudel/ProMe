## Goal

We currently have the character sheet in dark mode during in-game night time if the adaptive option is selected. We should have a proper dark mode so I can play at night without being flash-banged by the app.

We need a new setting for the theme: light, dark or auto. I think probably can be separate from the adaptive setting for the character sheet which — when enabled — should just take precedence over any theme.

## Requirements

I want to leverage Ant Design’s built in theme system and abundance of CSS Custom Properties for this. I really don’t want to maintain two themes on every single component I use, so let’s rely heavily on Ant Design here.
