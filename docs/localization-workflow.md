# Localization workflow

## Scope

- Source locale: `fr`
- Required target locales: `en`
- Message files: `messages/fr.json`, `messages/en.json`
- FAQ markdown files: `messages/faq.fr.md`, `messages/faq.en.md`

## Validation rules

### JSON structure

- Locale files must be valid JSON.
- Locale file root values must be objects.

### Key parity

- Every key in `messages/fr.json` must exist in `messages/en.json`.
- Missing keys in `en` are hard failures.
- Extra keys in `en` are warnings (non-blocking by default).
- Empty string values are warnings.

### Markdown parity

- `messages/faq.fr.md` and `messages/faq.en.md` must both exist.

## CI policy

- CI fails on JSON parse errors.
- CI fails on missing translation keys.
- CI does not fail on extra keys or unused keys by default.

## Local commands

- Run all checks: `npm run i18n:check`
- Run parity only: `npm run i18n:check:parity`
- Run unused-key report: `npm run i18n:check:unused`
- Run glossary consistency: `npm run i18n:check:glossary`

## Glossary rules

- Canonical terms are defined in `messages/glossary.json`.
- Each term can define locale-specific `preferred` and `disallowed` lists.
- The glossary checker currently enforces `disallowed` terms only.

### Safe term rename flow

- Update both locale files (`messages/fr.json`, `messages/en.json`).
- Update the canonical term entry in `messages/glossary.json`.
- Run `npm run i18n:check` and ensure no glossary violations remain.

## Troubleshooting

- Missing key: add the same nested key path in `messages/en.json`.
- Parse failure: fix JSON syntax in the locale file shown by the checker.
- Dynamic key false positive: add key to ignore list used by unused-key checker.
- Glossary violation: replace disallowed term or update glossary intentionally.

## Regular maintenance

- Run `npm run i18n:check`.
- Remove newly unused keys when safe.
- Update glossary when canonical terms change.
