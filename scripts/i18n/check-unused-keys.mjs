import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const DEFAULT_DYNAMIC_PREFIXES = [
  'biomes.',
  'common.gathering.',
  'common.encounters.',
  'common.factions.',
  'common.ages.',
  'common.genders.',
  'common.personalities.',
  'common.ranks.',
  'common.suits.',
  'common.archetypes.',
  'inhabitant.context_by_rank.',
  'village.establishments.',
  'village.traits.',
  'settings.hints.',
  'settings.language_',
]

function flattenKeys(value, prefix = '') {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key
    return flattenKeys(child, next)
  })
}

async function getCodeFiles(rootDirectory) {
  const entries = await readdir(rootDirectory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(rootDirectory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) return []
        return getCodeFiles(fullPath)
      }
      if (/\.(ts|tsx)$/.test(entry.name)) return [fullPath]
      return []
    })
  )
  return nested.flat()
}

function collectUsedKeys(fileContent) {
  const used = new Set()
  const translatorMap = new Map()

  const translatorPattern =
    /const\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\(\s*(['"]?)([^'")]+)?\2?\s*\)/g
  let translatorMatch
  while ((translatorMatch = translatorPattern.exec(fileContent)) !== null) {
    const variableName = translatorMatch[1]
    const namespace = translatorMatch[3] ?? ''
    translatorMap.set(variableName, namespace)
  }

  const directPattern = /\bt\(\s*['"]([^'"]+)['"]\s*[),]/g
  let directMatch
  while ((directMatch = directPattern.exec(fileContent)) !== null) {
    used.add(directMatch[1])
  }

  for (const [translatorName, namespace] of translatorMap.entries()) {
    const scopedPattern = new RegExp(
      `\\b${translatorName}\\(\\s*['"]([^'"]+)['"]\\s*[),]`,
      'g'
    )
    let scopedMatch
    while ((scopedMatch = scopedPattern.exec(fileContent)) !== null) {
      const key = scopedMatch[1]
      const fullKey =
        namespace && !key.includes('.') ? `${namespace}.${key}` : key
      used.add(fullKey)
    }

    const scopedMethodPattern = new RegExp(
      `\\b${translatorName}\\.(?:rich|raw)\\(\\s*['"]([^'"]+)['"]\\s*[),]`,
      'g'
    )
    let scopedMethodMatch
    while (
      (scopedMethodMatch = scopedMethodPattern.exec(fileContent)) !== null
    ) {
      const key = scopedMethodMatch[1]
      const fullKey =
        namespace && !key.includes('.') ? `${namespace}.${key}` : key
      used.add(fullKey)
    }
  }

  const formattedMessagePattern = /<FormattedMessage[^>]*\sid=['"]([^'"]+)['"]/g
  let formattedMatch
  while (
    (formattedMatch = formattedMessagePattern.exec(fileContent)) !== null
  ) {
    used.add(formattedMatch[1])
  }

  return used
}

function collectTranslationKeyLiterals(fileContent, rootPrefixes) {
  const used = new Set()
  const literalPattern = /(['"`])([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_|-]+)+)\1/g
  let match
  while ((match = literalPattern.exec(fileContent)) !== null) {
    const key = match[2]
    if (key.includes('${')) {
      continue
    }
    const root = key.split('.')[0]
    if (rootPrefixes.has(root)) {
      used.add(key)
    }
  }
  return used
}

function collectDynamicFamilyHits(fileContent, translatorNames = ['t']) {
  const families = new Set()
  const interpolatedCallRegex = /\b([a-zA-Z_$]\w*)\(\s*`([^`]*\$\{[^`]+)`/g
  let match
  while ((match = interpolatedCallRegex.exec(fileContent)) !== null) {
    const translatorName = match[1]
    if (!translatorNames.includes(translatorName)) {
      continue
    }
    const template = match[2]
    const prefix = template.split('${')[0]
    if (prefix.includes('.')) {
      families.add(prefix)
    }
  }
  return families
}

function classifyUnusedKeys(unusedKeys, dynamicFamilies, dynamicPrefixes) {
  const coveredByDynamicFamily = []
  const unknownDynamicPatterns = []
  const unusedLikely = []

  for (const key of unusedKeys) {
    if (dynamicPrefixes.some(prefix => key.startsWith(prefix))) {
      coveredByDynamicFamily.push(key)
      continue
    }

    if (dynamicFamilies.some(family => key.startsWith(family))) {
      unknownDynamicPatterns.push(key)
      continue
    }

    unusedLikely.push(key)
  }

  return { coveredByDynamicFamily, unknownDynamicPatterns, unusedLikely }
}

async function parseJson(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8')
    return { ok: true, value: JSON.parse(raw) }
  } catch (error) {
    return {
      ok: false,
      error: `Invalid JSON in ${filePath}: ${error.message}`,
    }
  }
}

export async function runUnusedKeysCheck({
  catalogPath,
  codeRoot,
  ignoreList = [],
  failOnUnused = false,
  dynamicPrefixes = DEFAULT_DYNAMIC_PREFIXES,
} = {}) {
  const cwd = process.cwd()
  const catalogFile = catalogPath ?? path.join(cwd, 'messages/fr.json')
  const codeDirectory = codeRoot ?? path.join(cwd, 'src')

  const parsedCatalog = await parseJson(catalogFile)
  if (!parsedCatalog.ok) {
    console.error(parsedCatalog.error)
    return {
      ok: false,
      code: 1,
      coveredByDynamicFamily: [],
      unknownDynamicPatterns: [],
      unusedLikely: [],
      unused: [],
    }
  }

  const catalogKeys = flattenKeys(parsedCatalog.value)
  const catalogRootPrefixes = new Set(catalogKeys.map(key => key.split('.')[0]))
  const codeFiles = await getCodeFiles(codeDirectory)
  const usedKeys = new Set()
  const dynamicFamilies = new Set()

  for (const file of codeFiles) {
    const content = await readFile(file, 'utf8')
    for (const key of collectUsedKeys(content)) {
      usedKeys.add(key)
    }
    for (const key of collectTranslationKeyLiterals(
      content,
      catalogRootPrefixes
    )) {
      usedKeys.add(key)
    }
    for (const family of collectDynamicFamilyHits(content)) {
      dynamicFamilies.add(family)
    }
  }

  const ignored = new Set(ignoreList)
  const unused = catalogKeys.filter(
    key => !usedKeys.has(key) && !ignored.has(key)
  )
  const classification = classifyUnusedKeys(
    unused,
    Array.from(dynamicFamilies),
    dynamicPrefixes
  )

  if (classification.unusedLikely.length > 0) {
    console.warn(
      `Likely unused translation keys (${classification.unusedLikely.length}):`
    )
    classification.unusedLikely
      .slice(0, 200)
      .forEach(key => console.warn(`- ${key}`))
    if (classification.unusedLikely.length > 200) {
      console.warn(`... and ${classification.unusedLikely.length - 200} more`)
    }
  } else {
    console.log('No likely unused translation keys detected.')
  }

  if (classification.coveredByDynamicFamily.length > 0) {
    console.log(
      `Dynamic-family covered keys (${classification.coveredByDynamicFamily.length}) under known prefixes.`
    )
  }

  if (classification.unknownDynamicPatterns.length > 0) {
    console.warn(
      `Keys matching detected dynamic templates but unknown families (${classification.unknownDynamicPatterns.length}):`
    )
    classification.unknownDynamicPatterns
      .slice(0, 100)
      .forEach(key => console.warn(`- ${key}`))
  }

  if (failOnUnused && classification.unusedLikely.length > 0) {
    return { ok: false, code: 1, ...classification }
  }

  return {
    ok: true,
    code: 0,
    ...classification,
    unused: classification.unusedLikely,
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failOnUnused = process.argv.includes('--fail-on-unused')
  runUnusedKeysCheck({ failOnUnused }).then(result => {
    process.exit(result.code)
  })
}

export {
  classifyUnusedKeys,
  collectDynamicFamilyHits,
  collectTranslationKeyLiterals,
  collectUsedKeys,
  flattenKeys,
  getCodeFiles,
}
