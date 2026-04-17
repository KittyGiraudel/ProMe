import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

function flattenKeys(value, prefix = '') {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key
    return flattenKeys(child, next)
  })
}

async function parseJsonFile(filePath) {
  let raw
  try {
    raw = await readFile(filePath, 'utf8')
  } catch (error) {
    return {
      ok: false,
      error: `Cannot read file ${filePath}: ${error.message}`,
    }
  }

  try {
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

async function fileExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

function compareLocaleKeys(sourceData, targetData) {
  const sourceKeys = flattenKeys(sourceData)
  const targetKeys = flattenKeys(targetData)
  const sourceSet = new Set(sourceKeys)
  const targetSet = new Set(targetKeys)

  const missingInTarget = sourceKeys.filter(key => !targetSet.has(key))
  const extraInTarget = targetKeys.filter(key => !sourceSet.has(key))
  const emptyValuesInTarget = targetKeys.filter(key => {
    const segments = key.split('.')
    let current = targetData
    for (const segment of segments) {
      current = current?.[segment]
    }
    return typeof current === 'string' && current.trim() === ''
  })

  return { missingInTarget, extraInTarget, emptyValuesInTarget }
}

export async function runLocaleParityCheck({
  sourcePath,
  targetPath,
  faqSourcePath,
  faqTargetPath,
} = {}) {
  const cwd = process.cwd()
  const resolvedSource = sourcePath ?? path.join(cwd, 'messages/fr.json')
  const resolvedTarget = targetPath ?? path.join(cwd, 'messages/en.json')
  const resolvedFaqSource =
    faqSourcePath ?? path.join(cwd, 'messages/faq.fr.md')
  const resolvedFaqTarget =
    faqTargetPath ?? path.join(cwd, 'messages/faq.en.md')

  const sourceResult = await parseJsonFile(resolvedSource)
  if (!sourceResult.ok) {
    console.error(sourceResult.error)
    return { ok: false, code: 1 }
  }

  const targetResult = await parseJsonFile(resolvedTarget)
  if (!targetResult.ok) {
    console.error(targetResult.error)
    return { ok: false, code: 1 }
  }

  const faqSourceExists = await fileExists(resolvedFaqSource)
  const faqTargetExists = await fileExists(resolvedFaqTarget)
  if (!faqSourceExists || !faqTargetExists) {
    console.error(
      'FAQ markdown parity check failed: both faq.fr.md and faq.en.md are required.'
    )
    return { ok: false, code: 1 }
  }

  const { missingInTarget, extraInTarget, emptyValuesInTarget } =
    compareLocaleKeys(sourceResult.value, targetResult.value)

  if (missingInTarget.length > 0) {
    console.error(`Missing ${missingInTarget.length} key(s) in target locale:`)
    missingInTarget.forEach(key => console.error(`- ${key}`))
    return { ok: false, code: 1 }
  }

  if (extraInTarget.length > 0) {
    console.warn(`Extra ${extraInTarget.length} key(s) in target locale:`)
    extraInTarget.forEach(key => console.warn(`- ${key}`))
  }

  if (emptyValuesInTarget.length > 0) {
    console.warn(
      `Empty ${emptyValuesInTarget.length} value(s) in target locale:`
    )
    emptyValuesInTarget.forEach(key => console.warn(`- ${key}`))
  }

  console.log('Locale parity check passed.')
  return { ok: true, code: 0 }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runLocaleParityCheck().then(result => {
    process.exit(result.code)
  })
}

export { compareLocaleKeys, flattenKeys, parseJsonFile }
