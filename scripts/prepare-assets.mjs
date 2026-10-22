import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
const names = ['wine', 'rose', 'sage', 'ivory', 'ochre', 'teal', 'plum'];
// Lossy WebP derivatives; originals and exact prompts are retained in assets/ and docs/.
// Crops keep each product and its matching portrait from the same generated diptych.
const crops = {
  wine: [180, 98, 420, 850], rose: [211, 77, 355, 880],
  sage: [200, 76, 373, 907], ivory: [194, 77, 411, 909],
  ochre: [169, 57, 425, 891], teal: [200, 89, 381, 879],
  plum: [205, 88, 395, 878],
};
const outlines = {};
for (const name of names) {
  const src = `assets/originals/${name}.png`;
  const meta = await sharp(src).metadata();
  const [left, top, width, height] = crops[name];
  const {data, info} = await sharp(src).extract({left, top, width, height}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const edges = [];
  for (let y = 0; y < height; y += Math.ceil(height / 40)) {
    let min = width, max = 0;
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * info.channels;
      const [r,g,b] = [data[offset],data[offset+1],data[offset+2]];
      const chroma = Math.max(r,g,b)-Math.min(r,g,b);
      const textile = name === 'ivory' ? (r-b > 32 && g-b > 14) : (Math.min(r,g,b) < 145 || chroma > 48);
      if (textile) { min = Math.min(min,x); max = Math.max(max,x); }
    }
    if (max > min + width * .15) edges.push({y:y/height*100,l:Math.max(0,min-2)/width*100,r:Math.min(width,max+2)/width*100});
  }
  outlines[name] = `polygon(${[...edges.map(e=>`${e.l.toFixed(2)}% ${e.y.toFixed(2)}%`),...edges.toReversed().map(e=>`${e.r.toFixed(2)}% ${e.y.toFixed(2)}%`)].join(',')})`;
  await sharp(src).extract({left,top,width,height}).resize({height:960}).webp({quality:88}).toFile(`public/images/${name}-drape.webp`);
  await sharp(src).extract({left:Math.floor(meta.width/2),top:0,width:Math.floor(meta.width/2),height:meta.height}).resize({height:1400,withoutEnlargement:true}).webp({quality:88}).toFile(`public/images/${name}-portrait.webp`);
}
await sharp('assets/originals/stand.png').trim().resize({width:1500}).webp({quality:90}).toFile('public/images/brass-stand.webp');
await writeFile('src/lib/fabric-outlines.json',JSON.stringify(outlines,null,2));
console.log('Prepared 7 matched pairs and brass stand.');
