import { chromium, defineConfig, devices } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Prefer Playwright's pinned browser. A local Chromium fallback lets this
// workspace run QA without downloading another large browser installation.
function chromiumExecutable() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (existsSync(chromium.executablePath())) return undefined;
  const cache = process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'ms-playwright');
  if (!cache || !existsSync(cache)) return undefined;
  for (const folder of readdirSync(cache).filter((name) => /^chromium-\d+$/.test(name)).sort().reverse()) {
    const executable = join(cache, folder, 'chrome-win64', 'chrome.exe');
    if (existsSync(executable)) return executable;
  }
  return undefined;
}
const launchOptions = { executablePath: chromiumExecutable(), headless: true };

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 }, launchOptions } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', launchOptions } },
    ...(process.env.TEST_WEBKIT === '1' ? [{ name: 'webkit-mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'webkit' as const } }] : []),
  ],
  webServer: { command: 'npm run dev:in-process', url: 'http://127.0.0.1:3000', reuseExistingServer: true, timeout: 90_000 },
});
