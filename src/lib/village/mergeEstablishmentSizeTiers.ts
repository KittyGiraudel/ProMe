/** Base draw: tier 1 or 2 from card color; merged outcome can reach 3. */
type BasicTier = 1 | 2
type MergedTier = 1 | 2 | 3

function mergeTwo(a: MergedTier, b: MergedTier): MergedTier {
  const hi = Math.max(a, b)
  const lo = Math.min(a, b)
  if (hi === 3 || lo === 3) return 3
  if (hi === 2 && lo === 2) return 3
  if (hi === 2 && lo === 1) return 2
  return 2
}

/**
 * Merge several base tiers for the same establishment rank (book rule:
 * smallest+smallest → middle, middle+middle → largest, mixed → middle).
 * Repeatedly merges the two smallest values until one tier remains.
 */
export function mergeEstablishmentSizeTiers(tiers: BasicTier[]): MergedTier {
  if (tiers.length === 0) return 2
  const list: MergedTier[] = [...tiers].sort((a, b) => a - b)
  while (list.length > 1) {
    const a = list.shift()!
    const b = list.shift()!
    list.push(mergeTwo(a, b))
    list.sort((x, y) => x - y)
  }
  return list[0]!
}
