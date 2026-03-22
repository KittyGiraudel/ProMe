import type { Gender } from "../types";

/** Single-symbol markers for compact plaintext (aligned with `copy.genders` prefixes). */
export function genderCompactSymbol(gender: Gender): string {
  switch (gender) {
    case "man":
      return "♂";
    case "woman":
      return "♀";
    case "nonBinary":
      return "⚥";
    case "indeterminate":
      return "☿";
  }
}
