/** Unicode die faces U+2680–U+2685 (⚀ … ⚅), one-based D6 values. */
const D6_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"] as const;

/** Returns the die-face glyph for `value` in 1..6, otherwise the numeric string. */
export function diceFaceGlyph(value: number): string {
  if (value >= 1 && value <= 6) {
    return D6_FACES[value - 1]!;
  }
  return String(value);
}
