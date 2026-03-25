import type { ReactNode } from 'react'
import type { Locale, Messages } from '@/messages/locales'

export function resolveByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.').filter(Boolean)
  let cur = obj as unknown
  for (const part of parts) {
    if (cur == null) return undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cur = (cur as any)[part]
  }
  return cur
}

function interpolateString(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = values[key]
    return v === undefined ? `{${key}}` : String(v)
  })
}

function interpolateReactNode(
  template: string,
  values: Record<string, ReactNode>,
): ReactNode {
  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of template.matchAll(/\{(\w+)\}/g)) {
    const index = match.index ?? 0
    const key = String(match[1])

    if (index > lastIndex) {
      parts.push(template.slice(lastIndex, index))
    }

    parts.push(values[key] ?? `{${key}}`)
    lastIndex = index + match[0].length
  }

  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : parts
}

export type Localize = {
  locale: Locale
  /**
   * Translate a key to a string.
   * - If the translation at `key` is a function, it will be invoked with the provided args.
   * - If the translation is a string containing `{placeholders}`, pass an object as the
   *   first arg to interpolate placeholders.
   */
  string: (key: string, ...args: unknown[]) => string
  /** Same as `string`, but allows ReactNode placeholders. */
  template: (key: string, ...args: unknown[]) => ReactNode
  /**
   * Resolve a copy value by key without enforcing it is a string.
   * Useful for tables / lookup arrays that are not authored as translations.
   */
  resolve: (key: string) => unknown
  /** Locale-aware date formatter wrapper. */
  date: (
    value: string | Date | number | undefined | null,
    options?: Intl.DateTimeFormatOptions,
  ) => string | null
}

export function createLocalize({
  locale,
  copy,
}: {
  locale: Locale
  copy: Messages
}): Localize {
  return {
    locale,
    resolve: (key: string) => resolveByPath(copy, key),
    string: (key: string, ...args: unknown[]) => {
      const resolved = resolveByPath(copy, key)
      if (typeof resolved === 'function') {
        // Parameterized copy is authored as functions in `messages/fr.ts`.
        return String(resolved(...args))
      }
      if (typeof resolved !== 'string') {
        throw new Error(`localize.string: key "${key}" did not resolve to a string`)
      }
      if (args.length === 0) return resolved

      const first = args[0]
      if (
        args.length === 1 &&
        first != null &&
        typeof first === 'object' &&
        !Array.isArray(first)
      ) {
        return interpolateString(resolved, first as Record<string, string | number>)
      }

      return resolved
    },
    template: (key: string, ...args: unknown[]) => {
      const resolved = resolveByPath(copy, key)
      if (typeof resolved === 'function') {
        return String(resolved(...args))
      }
      if (typeof resolved !== 'string') {
        throw new Error(
          `localize.template: key "${key}" did not resolve to a string`,
        )
      }
      if (args.length === 0) return resolved

      const first = args[0]
      if (
        args.length === 1 &&
        first != null &&
        typeof first === 'object' &&
        !Array.isArray(first)
      ) {
        return interpolateReactNode(resolved, first as Record<string, ReactNode>)
      }

      return resolved
    },
    date: (value, options) => {
      if (value == null) return null
      const date = typeof value === 'string' ? new Date(value) : new Date(value)
      if (Number.isNaN(date.getTime())) return null
      const base: Intl.DateTimeFormatOptions = {
        dateStyle: 'medium',
      }

      // If `options` is omitted, default to date + time.
      // If `options` is provided, respect exactly what the caller asks for
      // (e.g. date-only by passing `{ dateStyle: ... }`).
      const merged =
        options === undefined
          ? ({ ...base, timeStyle: 'short' } satisfies Intl.DateTimeFormatOptions)
          : { ...base, ...options }

      return new Intl.DateTimeFormat(locale, merged).format(date)
    },
  }
}