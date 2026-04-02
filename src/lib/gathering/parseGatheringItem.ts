export function parseGatheringItem(
  text: string,
  regex: RegExp
): { quantity: number; label: string } {
  const match = text.match(regex)
  if (!match) {
    return {
      quantity: 1,
      label: text.charAt(0).toUpperCase() + text.slice(1),
    }
  }
  return {
    quantity: parseInt(match[1].replace(/[, ]/g, ''), 10),
    label: match[2].charAt(0).toUpperCase() + match[2].slice(1),
  }
}
