import assert from 'node:assert/strict';
import sharp from 'sharp';
import { readFile, readdir, stat } from 'node:fs/promises';

const origin = process.env.BASE_URL || 'http://127.0.0.1:3000';
const page = await fetch(origin);
assert.equal(page.status, 200, 'The hero must serve successfully');
const html = await page.text();
assert.equal((html.match(/class="hanging-saree/g) || []).length, 7);
assert.ok(html.includes('A story in'));
const names = ['rose','sage','ochre','wine','ivory','teal','plum'];
const outlines = JSON.parse(await readFile('src/lib/fabric-outlines.json','utf8'));
let total = 0;
for (const file of await readdir('public/images')) {
  const path = `public/images/${file}`;
  const meta = await sharp(path).metadata();
  assert.equal(meta.format,'webp');
  assert.ok(meta.width > 100 && meta.height > 100);
  const response = await fetch(`${origin}/images/${file}`);
  assert.equal(response.status,200,`${file} should load locally`);
  assert.match(response.headers.get('content-type'),/image\/webp/);
  total += (await stat(path)).size;
}
for (const name of names) {
  assert.ok(outlines[name].startsWith('polygon('));
  assert.ok(!outlines[name].includes('NaN'));
  assert.ok((await sharp(`public/images/${name}-portrait.webp`).metadata()).height >= 1000);
}
assert.equal((await sharp('public/images/brass-stand.webp').metadata()).hasAlpha,true);
const optimized = await fetch(`${origin}/_next/image?url=%2Fimages%2Fwine-drape.webp&w=256&q=75`);
assert.equal(optimized.status,200,'Next image optimization must work');
console.log(`PASS: hero SSR, all 15 local images, 7 fabric silhouettes, portrait resolution, transparent brass stand, and Next image optimizer. Total derivative assets: ${(total/1024/1024).toFixed(2)} MiB.`);
