import { expect, test } from '@playwright/test';

test('catalogue filtering, search, sort and empty-state recovery', async ({ page }) => {
  await page.goto('/catalog');
  const cards = page.locator('.product-grid .product-card');
  await expect(cards).toHaveCount(7);
  await page.getByRole('button', { name: 'Quiet luxury', exact: true }).click();
  await expect(cards).toHaveCount(3);
  await page.getByRole('button', { name: 'All sarees', exact: true }).click();
  await page.getByLabel('Search sarees', { exact: true }).fill('teal');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('Mayura');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByLabel('Sort by').selectOption('price-low');
  await expect(cards.first()).toContainText('Gulabi');
  await expect(cards.last()).toContainText('Mayura');
  await page.getByLabel('Sort by').selectOption('price-high');
  await expect(cards.first()).toContainText('Mayura');
  await page.getByLabel('Search sarees', { exact: true }).fill('nonexistent-colour');
  await expect(page.getByRole('heading', { name: 'No sarees found.' })).toBeVisible();
  await page.getByRole('button', { name: 'View all sarees' }).click();
  await expect(cards).toHaveCount(7);
  await cards.first().getByRole('link').click();
  await expect(page).toHaveURL(/\/product\/rose$/);
  await expect(page.getByRole('heading', { name: 'Gulabi', exact: true })).toBeVisible();
});

test('product imagery, add to bag, quantity, persistence and removal', async ({ page }) => {
  await page.goto('/product/wine');
  await expect(page.getByRole('heading', { name: 'Raaga', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'View fabric & fall', exact: true }).click();
  await expect(page.locator('.product-gallery-main img')).toHaveAttribute('src', /wine-drape/);
  await page.getByRole('button', { name: 'View border study', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View border study', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Shopping bag, 1 item', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'View bag', exact: true }).click();
  await expect(page.getByLabel('Raaga quantity', { exact: true })).toHaveText('1');
  await page.getByRole('button', { name: 'Increase Raaga quantity' }).click();
  await expect(page.getByLabel('Raaga quantity', { exact: true })).toHaveText('2');
  await expect(page.locator('.cart-total')).toContainText('53,000');
  await page.reload();
  await expect(page.getByLabel('Raaga quantity', { exact: true })).toHaveText('2');
  await page.getByRole('button', { name: 'Decrease Raaga quantity' }).click();
  await expect(page.getByLabel('Raaga quantity', { exact: true })).toHaveText('1');
  await expect(page.getByRole('button', { name: 'Decrease Raaga quantity' })).toBeDisabled();
  await expect(page.locator('.cart-summary-note')).toContainText('payments and shipping are not configured');
  await page.getByRole('button', { name: 'Remove Raaga from bag' }).click();
  await expect(page.getByText('Your bag is empty.', { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.locator('.cart-line')).toHaveCount(0);
});

test('contact validates fields and saves an honest downloadable draft', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Save enquiry draft' }).click();
  await expect(page.getByLabel('Your name', { exact: false })).toBeFocused();
  await expect(page.locator('.field-error')).toHaveCount(3);
  await page.getByLabel('Your name', { exact: false }).fill('Sample Visitor');
  await page.getByLabel('Email address', { exact: false }).fill('sample@example.com');
  await page.getByLabel('Your message', { exact: false }).fill('I would like styling advice for the deep wine saree for an evening celebration.');
  await page.getByRole('button', { name: 'Save enquiry draft' }).click();
  await expect(page.getByRole('heading', { name: 'Your enquiry is saved.' })).toBeVisible();
  await expect(page.locator('.contact-receipt')).toContainText('No message has been sent');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download your enquiry' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('nr-studios-enquiry.txt');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  if (!stream) throw new Error('Enquiry download did not produce a readable file');
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const content = Buffer.concat(chunks).toString('utf8');
  expect(content).toContain('Sample Visitor');
  expect(content).toContain('this enquiry has not been sent');
  await page.getByRole('button', { name: 'Edit your draft' }).click();
  await expect(page.getByLabel('Your name', { exact: false })).toHaveValue('Sample Visitor');
});

test('an order enquiry carries the actual cart selection into the draft', async ({ page }) => {
  await page.goto('/product/teal');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('link', { name: 'View bag', exact: true }).click();
  await page.getByRole('link', { name: 'Prepare an order enquiry' }).click();
  await expect(page.getByLabel('A conversation about')).toHaveValue('Order enquiry');
  await page.getByRole('button', { name: 'Include my bag in the message' }).click();
  await expect(page.getByLabel('Your message', { exact: false })).toHaveValue(/Mayura.*Peacock teal/);
});

test('all pages fit 360, 390, 430, tablet and desktop without runtime errors', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Run the full viewport matrix once.');
  test.setTimeout(120_000);
  const errors: string[] = [];
  const failed: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:3000')) failed.push(`${response.status()} ${response.url()}`); });
  for (const route of ['/', '/catalog', '/product/wine', '/story', '/contact', '/cart']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    for (const width of [360, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), { message: `${route} must not overflow at ${width}px` }).toBe(true);
    }
  }
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('mobile navigation traps focus and closes after route selection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation only.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Main navigation', exact: true });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  }
  await dialog.getByRole('link', { name: 'Our story' }).click();
  await expect(page).toHaveURL(/\/story$/);
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});
