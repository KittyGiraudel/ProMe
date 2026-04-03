import { Character } from '../character/types'

export function downloadJsonFile(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function buildCharacterExportFileName(character: Character): string {
  const safeName = sanitizeFileNamePart(character.name) || 'unnamed'
  const safeId = sanitizeFileNamePart(character.id) || 'id'
  const date = new Date().toISOString().slice(0, 10)
  return `${safeName}-${safeId}-${date}.json`
}

function sanitizeFileNamePart(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '')
}
