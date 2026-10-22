import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gestureIntent, rubberBand, releaseIndex } from '../src/lib/gesture.ts';

test('tiny movement remains a tap and vertical gestures remain native scroll', () => {
  assert.equal(gestureIntent(8, 2), 'pending');
  assert.equal(gestureIntent(-18, 4), 'horizontal');
  assert.equal(gestureIntent(4, -18), 'vertical');
  assert.equal(gestureIntent(12, 12), 'vertical');
});

test('slow releases snap precisely at mobile and desktop spacing', () => {
  for (const step of [82, 88, 95, 108]) {
    assert.equal(releaseIndex(-step * 3.4, 0, 0, step, 7), 3);
    assert.equal(releaseIndex(-step * 3.6, 0, 0, step, 7), 4);
  }
});

test('a flick projects in its direction and a pause discards stale momentum', () => {
  assert.equal(releaseIndex(-264, -1, 20, 88, 7), 5);
  assert.equal(releaseIndex(-264, 1, 20, 88, 7), 1);
  assert.equal(releaseIndex(-264, -5, 101, 88, 7), 3);
});

test('strong flick projection is bounded to two garments without crossing rail ends', () => {
  assert.equal(releaseIndex(-264, -99, 0, 88, 7), 5);
  assert.equal(releaseIndex(-264, 99, 0, 88, 7), 1);
  assert.equal(releaseIndex(-4000, -99, 0, 88, 7), 6);
  assert.equal(releaseIndex(4000, 99, 0, 88, 7), 0);
});

test('resistance is symmetric, preserves the interior, and bounds arbitrary overscroll', () => {
  assert.equal(rubberBand(-264, 88, 7), -264);
  assert.ok(Math.abs(rubberBand(100, 88, 7) + rubberBand(-628, 88, 7) + 528) < .0001);
  assert.ok(rubberBand(100000, 88, 7) <= 88 * .42);
  assert.ok(rubberBand(-100000, 88, 7) >= -528 - 88 * .42);
  assert.equal(rubberBand(99, 0, 7), 0);
  assert.equal(releaseIndex(99, 1, 0, 0, 7), 0);
});
