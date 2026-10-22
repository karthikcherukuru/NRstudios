/** Keep a dragged rail elastic at its ends without changing the snap bounds. */
export function rubberBand(x: number, step: number, count: number): number {
  const min = -(count - 1) * step;
  if (x > 0) return x * .25;
  if (x < min) return min + (x - min) * .25;
  return x;
}

/** Velocity is pixels/ms; old velocity is discarded when a finger pauses. */
export function releaseIndex(x: number, velocity: number, age: number, step: number, count: number): number {
  const projected = x + (age < 90 ? velocity : 0) * 145;
  return Math.max(0, Math.min(count - 1, Math.round(-projected / step)));
}
