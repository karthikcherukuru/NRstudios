import { expect, test, type Page } from '@playwright/test';

async function expectAttachedRack(page: Page) {
  const geometry = await page.evaluate(() => {
    const rod = document.querySelector('.rack-rod')!.getBoundingClientRect();
    const window = document.querySelector('.rack-window')!;
    const bounds = window.getBoundingClientRect();
    const selected = document.querySelector('.hanging-saree.is-selected')!.getBoundingClientRect();
    return { left: bounds.left, right: bounds.right, rodLeft: rod.left, rodRight: rod.right, attached: Math.abs(selected.top - (rod.top + rod.height / 2)), overflow: getComputedStyle(window).overflowX };
  });
  expect(geometry.left).toBeGreaterThanOrEqual(geometry.rodLeft);
  expect(geometry.right).toBeLessThanOrEqual(geometry.rodRight);
  expect(['hidden', 'clip']).toContain(geometry.overflow);
  expect(geometry.attached).toBeLessThan(4);
}

test('seven fabrics remain attached inside the rod across responsive sizes and selections', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Run the complete geometry matrix once.');
  await page.goto('/');
  await expect(page.locator('#hero-title')).toContainText('every');
  await expect(page.locator('.hanging-saree')).toHaveCount(7);
  for (const width of [360, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of ['Select Gulabi, Dusty rose', 'Select Raaga, Deep wine', 'Select Sandhya, Twilight plum']) {
      await page.getByRole('button', { name, exact: true }).click();
      await expectAttachedRack(page);
    }
  }
  await expect.poll(() => page.locator('.rack-stage img').evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test('fabric unfolds into the matching product and Back restores the selected rack', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Select Mayura, Peacock teal' }).click();
  await expect(page.locator('.rack-stage')).toHaveAttribute('data-selected', '5');
  await page.locator('#saree-5').click();
  await expect(page.getByRole('dialog', { name: 'Unfolding Mayura' })).toBeVisible();
  await expect(page.locator('.unfold-panel')).toHaveCount(7);
  await expect(page.locator('.reveal-editorial img')).toHaveAttribute('src', /teal-portrait/);
  await expect(page).toHaveURL(/\/product\/teal$/, { timeout: 10_000 });
  await expect(page.getByRole('heading', { name: 'Mayura', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.locator('.rack-stage')).toHaveAttribute('data-selected', '5');
  await expect(page.locator('.selected-name')).toContainText('Mayura');
  await expect(page.locator('.saree-dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await expectAttachedRack(page);
});

test('keyboard boundaries and reduced motion navigate without a long animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#saree-3').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#saree-0')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#saree-0')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('#saree-6')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Next saree', exact: true })).toBeDisabled();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/product\/plum$/, { timeout: 5_000 });
  await page.goBack();
  await expect(page.locator('.rack-stage')).toHaveAttribute('data-selected', '6');
});

test('Escape and rapid cancellation restore focus, fabric and scrolling', async ({ page }) => {
  await page.goto('/');
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.locator('#saree-3').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Unfolding Raaga' })).toBeVisible();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('.saree-dialog')))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('.saree-dialog')).toHaveCount(0);
    await expect(page.locator('#saree-3')).toBeFocused();
    await expect(page.locator('#saree-3 .fabric-body')).toBeVisible();
    expect(await page.locator('.atelier').getAttribute('inert')).toBeNull();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    await page.waitForTimeout(520);
  }
});

test('desktop hover preserves attachment and mouse drag snaps without opening', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Fine-pointer interaction only.');
  await page.goto('/');
  await page.locator('#saree-3').hover();
  await expectAttachedRack(page);
  const box = await page.locator('.rack-window').boundingBox();
  if (!box) throw new Error('Rack has no layout');
  await page.mouse.move(box.x + box.width * .65, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .65 - 170, box.y + 102, { steps: 14 });
  await page.mouse.up();
  await expect(page.locator('.rack-stage')).not.toHaveAttribute('data-selected', '3');
  await expect(page.locator('.saree-dialog')).toHaveCount(0);
  await expectAttachedRack(page);
});

test('native touch swipes at phone widths snap, reject vertical intent and cancel safely', async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'mobile', 'Native touch is exercised using Chromium CDP.');
  await page.goto('/');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.getByRole('button', { name: 'Select Raaga, Deep wine' }).click();
    await page.locator('.rack-window').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const box = await page.locator('.rack-window').boundingBox();
    if (!box) throw new Error('Rack has no layout');
    const start = { x: box.x + box.width * .72, y: box.y + 110 };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
    for (let step = 1; step <= 10; step++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x - step * 14, y: start.y + 1 }] });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator('.rack-stage')).not.toHaveAttribute('data-selected', '3');
    await expect(page.locator('.saree-dialog')).toHaveCount(0);
    const selected = await page.locator('.rack-stage').getAttribute('data-selected');
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + 2, y: start.y - 90 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator('.rack-stage')).toHaveAttribute('data-selected', selected!);
    await page.locator('.rack-window').scrollIntoViewIfNeeded();
    const refreshed = await page.locator('.rack-window').boundingBox();
    if (!refreshed) throw new Error('Rack disappeared');
    const cancelStart = { x: refreshed.x + refreshed.width / 2, y: refreshed.y + 110 };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [cancelStart] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cancelStart.x + 70, y: cancelStart.y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await expect(page.locator('.rack-stage')).toHaveAttribute('data-selected', selected!);
    await expect(page.locator('.rack-stage')).not.toHaveClass(/is-dragging/);
    await expectAttachedRack(page);
  }
});
