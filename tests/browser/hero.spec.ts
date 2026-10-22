import { test, expect } from '@playwright/test';

test('seven fabrics, local assets, responsive boundaries, and no runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', {name:'A story in every drape.'})).toBeVisible();
  await expect(page.locator('.hanging-saree')).toHaveCount(7);
  for (const width of [360,390,430,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect.poll(() => page.locator('.rack-stage img').evaluateAll(images => images.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
});

test('colour selection, full portrait, details, saved state, and reverse close', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Select Mayura, Peacock teal'}).click();
  await expect(page.locator('.selected-name')).toContainText('Mayura');
  await page.locator('#saree-5').click();
  await expect(page.getByRole('dialog', {name:/Mayura/})).toBeVisible();
  await expect(page.locator('.portrait-frame img')).toHaveAttribute('src', '/images/teal-portrait.webp');
  await page.getByRole('button', {name:'Explore this saree'}).click();
  await page.getByRole('button', {name:'Save to my edit'}).click();
  await expect(page.getByRole('button', {name:'Saved to your edit'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button', {name:'Close saree and return to rack'}).click();
  await expect(page.locator('.saree-dialog')).toHaveCount(0);
  await expect(page.locator('#saree-5')).toBeFocused();
  await page.locator('#saree-5').press('Enter');
  await page.getByRole('button', {name:'Explore this saree'}).click();
  await expect(page.getByRole('button', {name:'Saved to your edit'})).toBeVisible();
});

test('keyboard boundaries, modal focus containment, Escape, and reduced motion', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.locator('#saree-3').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#saree-0')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#saree-0')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('#saree-6')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', {name:/Sandhya/})).toBeVisible();
  for (let n=0;n<5;n++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('.saree-dialog')).toHaveCount(0);
  await expect(page.locator('#saree-6')).toBeFocused();
  expect(await page.locator('.fabric-sway').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

test('rapid open and close does not leave a blocked page or duplicate dialogs', async ({ page }) => {
  await page.goto('/');
  for (let n=0;n<3;n++) {
    await page.locator('#saree-3').click();
    await page.getByRole('button', {name:'Close saree and return to rack'}).click();
    await expect(page.locator('.saree-dialog')).toHaveCount(0);
  }
  expect(await page.locator('main').getAttribute('inert')).toBeNull();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('mouse drag snaps without accidentally opening a saree', async ({ page }) => {
  await page.goto('/');
  const box = await page.locator('.rack-window').boundingBox();
  if (!box) throw new Error('Rack has no layout');
  await page.mouse.move(box.x + box.width*.65,box.y+100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width*.65 - 160,box.y+102,{steps:14});
  await page.mouse.up();
  await expect(page.locator('.selected-name')).not.toContainText('Raaga');
  await expect(page.locator('.saree-dialog')).toHaveCount(0);
});

test('real touch swipe snaps and a vertical gesture does not select another saree', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium','Chromium CDP is required to dispatch native touch input.');
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
  const box = await page.locator('.rack-window').boundingBox();
  if (!box) throw new Error('Rack has no layout');
  const y = box.y+120;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:280,y}]});
  for (let i=1;i<=10;i++) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:280-i*16,y:y+1}]});
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.locator('.selected-name')).not.toContainText('Raaga');
  await expect(page.locator('.saree-dialog')).toHaveCount(0);
  const selected = await page.locator('.selected-name').textContent();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:182,y:y-90}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.locator('.selected-name')).toHaveText(selected!);
});
