import { describe, expect, it } from "vitest";
import { isFaceRank } from "./types";
import {
  randomInt,
  randomNumberedCard,
  roll2D6,
  rollD6,
} from "./rng";

describe("rng", () => {
  it("randomInt is inclusive on both ends", () => {
    const alwaysLow = () => 0;
    const alwaysHigh = () => 0.999999;
    expect(randomInt(alwaysLow, 1, 6)).toBe(1);
    expect(randomInt(alwaysHigh, 1, 6)).toBe(6);
    expect(randomInt(alwaysLow, 0, 3)).toBe(0);
    expect(randomInt(alwaysHigh, 0, 3)).toBe(3);
  });

  it("rollD6 returns 1–6", () => {
    let x = 0;
    const step = () => {
      x += 1 / 12;
      return Math.min(x, 0.999);
    };
    for (let i = 0; i < 20; i++) {
      const v = rollD6(step);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it("roll2D6 returns two independent values", () => {
    const seq = [0, 0.99, 0, 0.99];
    let i = 0;
    const rng = () => seq[i++]!;
    expect(roll2D6(rng)).toEqual([1, 6]);
  });

  it("randomNumberedCard never returns a face rank", () => {
    const seq: number[] = [];
    for (let n = 0; n < 500; n++) seq.push((n % 997) / 997);
    let i = 0;
    const rng = () => seq[i++] ?? 0.5;
    for (let k = 0; k < 100; k++) {
      const c = randomNumberedCard(rng);
      expect(isFaceRank(c.rank)).toBe(false);
    }
  });
});
