/** Petite = 1, Grande = 2 before merge; Immense = 3 after merge. */
type BasicTier = 1 | 2;
type MergedTier = 1 | 2 | 3;

function mergeTwo(a: MergedTier, b: MergedTier): MergedTier {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  if (hi === 3 || lo === 3) return 3;
  if (hi === 2 && lo === 2) return 3;
  if (hi === 2 && lo === 1) return 2;
  return 2;
}

/**
 * Combine several petites / grandes (same establishment rank) using:
 * petit + petit → grand ; grand + grand → immense ; petit + grand → grand.
 * Larger groups are reduced by repeatedly merging the two smallest tiers.
 */
export function mergePetiteGrandeTiers(tiers: BasicTier[]): MergedTier {
  if (tiers.length === 0) return 2;
  const list: MergedTier[] = [...tiers].sort((a, b) => a - b);
  while (list.length > 1) {
    const a = list.shift()!;
    const b = list.shift()!;
    list.push(mergeTwo(a, b));
    list.sort((x, y) => x - y);
  }
  return list[0]!;
}
