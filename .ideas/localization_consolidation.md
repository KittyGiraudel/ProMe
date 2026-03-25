## Context

Right now we just import the French file in every place we want to render content. It’s okay because we only support French, and it’s not terrible because we centralize all keys into a single file, but it’s not quite well done.

## Goal

Provide a context + localization hook, that exposes the current locale, and a function taking a translation key, and returns the translation.

Adjust all interfaces to use that system, so that adding a new language is nothing more than allowing the new locale + providing the translation file for the new language.

## Considerations

It would be nice to have an elegant way to inject values into a translation — including React. Something like:

```tsx
// my.translation.key: Hello {name}!
localize.string('my.translation.key', { name: 'Kitty' })
localize.string('my.translation.key', { name: <strong>Kitty</strong> })
```

It should also expose a wrapper around the date formatter, using the right locale.

```ts
localize.date(character.updatedAt)
```

There are quite a few places where we do not place the colon (`:`) in the translation but put it in the React component itself. It’s not ideal because French uses a space, and English doesn’t. Also some languages use a different character than the colon. So it would be good to make sure we don’t hard-code punctuation in the view.
