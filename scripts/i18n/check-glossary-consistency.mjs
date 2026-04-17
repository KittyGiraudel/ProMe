import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

function collectStringValues(value, prefix = '') {
  if (typeof value === 'string') {
    return [{ key: prefix, value }]
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key
    return collectStringValues(child, next)
  })
}

async function parseJson(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return {
        ok: false,
        error: `Invalid JSON root in ${filePath}: expected object`,
      }
    }
    return { ok: true, value: parsed }
  } catch (error) {
    return { ok: false, error: `Invalid JSON in ${filePath}: ${error.message}` }
  }
}

function checkDisallowedTerms(entries, glossaryByLocale) {
  const violations = []
  for (const [termName, config] of Object.entries(glossaryByLocale)) {
    const disallowed = config?.disallowed ?? []
    for (const token of disallowed) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const matcher = new RegExp(`\\b${escaped}\\b`, 'i')
      for (const entry of entries) {
        if (matcher.test(entry.value)) {
          violations.push({
            term: termName,
            token,
            key: entry.key,
            value: entry.value,
          })
        }
      }
    }
  }
  return violations
}

export async function runGlossaryCheck({ glossaryPath, frPath, enPath } = {}) {
  const cwd = process.cwd()
  const resolvedGlossary =
    glossaryPath ?? path.join(cwd, 'messages/glossary.json')
  const resolvedFr = frPath ?? path.join(cwd, 'messages/fr.json')
  const resolvedEn = enPath ?? path.join(cwd, 'messages/en.json')

  const glossaryResult = await parseJson(resolvedGlossary)
  if (!glossaryResult.ok) {
    console.error(glossaryResult.error)
    return { ok: false, code: 1, violations: [] }
  }

  const frResult = await parseJson(resolvedFr)
  if (!frResult.ok) {
    console.error(frResult.error)
    return { ok: false, code: 1, violations: [] }
  }

  const enResult = await parseJson(resolvedEn)
  if (!enResult.ok) {
    console.error(enResult.error)
    return { ok: false, code: 1, violations: [] }
  }

  const glossary = glossaryResult.value
  const fr = frResult.value
  const en = enResult.value

  const frEntries = collectStringValues(fr)
  const enEntries = collectStringValues(en)

  const frLocaleGlossary = Object.fromEntries(
    Object.entries(glossary).map(([term, data]) => [term, data.fr ?? {}])
  )
  const enLocaleGlossary = Object.fromEntries(
    Object.entries(glossary).map(([term, data]) => [term, data.en ?? {}])
  )

  const violations = [
    ...checkDisallowedTerms(frEntries, frLocaleGlossary).map(item => ({
      ...item,
      locale: 'fr',
    })),
    ...checkDisallowedTerms(enEntries, enLocaleGlossary).map(item => ({
      ...item,
      locale: 'en',
    })),
  ]

  if (violations.length > 0) {
    console.error(
      `Glossary consistency failed with ${violations.length} violation(s):`
    )
    violations.forEach(item => {
      console.error(
        `[${item.locale}] ${item.key}: disallowed "${item.token}" for term "${item.term}"`
      )
    })
    return { ok: false, code: 1, violations }
  }

  console.log('Glossary consistency check passed.')
  return { ok: true, code: 0, violations: [] }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGlossaryCheck().then(result => {
    process.exit(result.code)
  })
}

export { checkDisallowedTerms, collectStringValues }
