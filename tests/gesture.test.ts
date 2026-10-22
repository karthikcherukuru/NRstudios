import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rubberBand, releaseIndex } from '../src/lib/gesture.ts';

test('slow releases snap to the nearest garment at mobile and desktop spacing', () => {
  for (const step of [76, 88, 100]) {
    assert.equal(releaseIndex(-step * 3.4, 0, 0, step, 7), 3);
    assert.equal(releaseIndex(-step * 3.6, 0, 0, step, 7), 4);
  }
});
test('a fresh flick projects in its direction; a held finger discards stale momentum', () => {
  assert.equal(releaseIndex(-264, -1, 20, 88, 7), 5);
  assert.equal(releaseIndex(-264, 1, 20, 88, 7), 1);
  assert.equal(releaseIndex(-264, -5, 91, 88, 7), 3);
});
test('arbitrarily strong swipes never select outside the seven-saree edit', () => {
  assert.equal(releaseIndex(-4000, -99, 0, 88, 7), 6);
  assert.equal(releaseIndex(4000, 99, 0, 88, 7), 0);
});
test('rubber-banding preserves interior positions and damps both edges symmetrically', () => {
  assert.equal(rubberBand(-264, 88, 7), -264);
  assert.equal(rubberBand(100, 88, 7), 25);
  assert.equal(rubberBand(-628, 88, 7), -553);
});
