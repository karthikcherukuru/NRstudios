export type GestureIntent = "pending" | "horizontal" | "vertical";

/** Wait for a deliberate direction before taking a gesture away from page scroll. */
export function gestureIntent(dx: number, dy: number, threshold = 9): GestureIntent {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return "pending";
  return Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical";
}

/** A bounded resistance curve; even an enormous drag cannot escape the rail. */
export function rubberBand(x: number, step: number, count: number): number {
  if (step <= 0 || count <= 1) return 0;
  const min = -(count - 1) * step;
  const resistance = (distance: number) => step * .42 * (1 - Math.exp(-distance / (step * 1.6)));
  if (x > 0) return resistance(x);
  if (x < min) return min - resistance(min - x);
  return x;
}

/** Velocity is px/ms. Pauses discard momentum; projection is capped at two garments. */
export function releaseIndex(x: number, velocity: number, age: number, step: number, count: number): number {
  if (step <= 0 || count <= 1) return 0;
  const momentum = age < 100 ? Math.max(-step * 2, Math.min(step * 2, velocity * 150)) : 0;
  return Math.max(0, Math.min(count - 1, Math.round(-(x + momentum) / step)));
}
