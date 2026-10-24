import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { deliverPendingMail } from '../../apps/api/src/modules/mail/worker.mjs';
async function waitFor(callback, ms = 10000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await callback()) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('Timed out waiting for browser state');
}
export async function runAccountScenario({ browser, origin, deps, output }) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage(),
    failures = [];
  let expectedSaveFailures = 0,
    expectedLoginFailures = 0;
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:'))
      failures.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    const path = new URL(response.url()).pathname;
    if (
      response.status() === 503 &&
      path === '/api/v1/workspace' &&
      response.request().method() === 'PUT'
    )
      expectedSaveFailures++;
    else if (response.status() === 401 && path === '/api/v1/auth/login') expectedLoginFailures++;
    else failures.push(`${response.status()} ${path}`);
  });
  const mailLink = async (kind) => {
    await deliverPendingMail(deps);
    const files = await readdir(deps.config.mailDirectory);
    for (const file of files.reverse()) {
      const mail = JSON.parse(await readFile(join(deps.config.mailDirectory, file), 'utf8'));
      const link = mail.text
        .split('\n')
        .find((line) => line.startsWith(origin) && line.includes(kind));
      if (link) return link;
    }
    throw new Error('Synthetic mail missing');
  };
  try {
    await page.goto(`${origin}/#/signup`);
    await page.getByLabel('Full name').fill('Synthetic Owner');
    await page.getByLabel('Work email').fill('browser@example.test');
    await page.getByLabel('Password', { exact: true }).fill('Synthetic123');
    await page.getByLabel('Confirm password').fill('Synthetic123');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Create account', exact: true }).click();
    await page.getByRole('heading', { name: 'Check your inbox' }).waitFor();
    await page.goto(await mailLink('verify-email'));
    await page.getByText('Email verified. You can log in now.').waitFor();
    await page.screenshot({ path: join(output, 'verification-en-desktop.png'), fullPage: true });
    assert.ok(!page.url().includes('token='));
    await page.getByRole('link', { name: 'Back to log in' }).click();
    const login = async (password) => {
      await page.getByLabel('Work email').fill('browser@example.test');
      await page.getByLabel('Password', { exact: true }).fill(password);
      await page.getByRole('button', { name: 'Log in', exact: true }).click();
    };
    await login('Synthetic123');
    await page.getByRole('heading', { name: 'Business information' }).waitFor();
    let failOnce = true;
    await page.route('**/api/v1/workspace', (route) => {
      if (route.request().method() === 'PUT' && failOnce) {
        failOnce = false;
        return route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ error: { code: 'SERVICE_UNAVAILABLE' } }),
        });
      }
      return route.continue();
    });
    await page.getByLabel(/Business name/).fill('Browser Cafe');
    await page.getByLabel(/Business type/).fill('Cafe');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Could not save' }).waitFor();
    assert.equal(await page.getByLabel(/Business name/).inputValue(), 'Browser Cafe');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('heading', { name: 'Business setup' }).waitFor();
    await page.reload();
    await page.getByRole('heading', { name: 'Business setup' }).waitFor();
    await page.getByLabel(/Primary branch name/).fill('Main Branch');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('heading', { name: 'Welcome to NUVIA' }).waitFor();
    await page.getByRole('button', { name: 'Get Started', exact: true }).click();
    await page.getByRole('heading', { name: 'No responses yet' }).waitFor();
    assert.equal(await page.getByText('Bloom & Co.', { exact: true }).count(), 0);
    await page.screenshot({ path: join(output, 'overview-en-desktop.png'), fullPage: true });
    await page.reload();
    await page.getByRole('heading', { name: 'No responses yet' }).waitFor();
    await page.goto(`${origin}/#/feedbacks`);
    await page.getByRole('heading', { name: 'Your first response starts here' }).waitFor();
    assert.equal(await page.locator('.feedback-filter').count(), 6);
    assert.equal(await page.locator('.feedback-table tbody tr').count(), 0);
    for (const width of [1440, 393]) {
      await page.setViewportSize({ width, height: width === 393 ? 800 : 900 });
      assert.equal(await page.locator('.workspace-account-actions').count(), 0);
      await page.getByRole('button', { name: 'Profile', exact: true }).click();
      const logout = await page
        .getByRole('button', { name: 'Sign out', exact: true })
        .boundingBox();
      assert.ok(logout, 'Account menu must expose sign out');
      assert.ok(
        logout.x >= 0 && logout.x + logout.width <= width,
        'Sign out must fit the viewport',
      );
      assert.ok(
        logout.y >= 0 && logout.y + logout.height <= (width === 393 ? 800 : 900),
        'Sign out must remain reachable',
      );
      await page.getByRole('button', { name: 'Profile', exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${origin}/#/dashboard`);
    await page.getByRole('heading', { name: 'No responses yet' }).waitFor();
    await page.getByRole('button', { name: 'Profile', exact: true }).click();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
    await login('Synthetic123');
    await page.getByRole('heading', { name: 'No responses yet' }).waitFor();
    await page.goto(`${origin}/#/forgot`);
    await page.getByLabel('Work email').fill('browser@example.test');
    await page.getByRole('button', { name: 'Send reset link' }).click();
    await page.getByRole('status').filter({ hasText: 'Request received' }).waitFor();
    await page.goto(await mailLink('/reset'));
    await page.getByLabel('New password', { exact: true }).fill('Changed123');
    await page.getByLabel('Confirm password').fill('Changed123');
    await page.getByRole('button', { name: 'Reset password', exact: true }).click();
    await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
    await login('Synthetic123');
    await page.getByRole('status').filter({ hasText: 'incorrect' }).waitFor();
    await login('Changed123');
    await page.getByRole('heading', { name: 'No responses yet' }).waitFor();
    await page.evaluate(() => localStorage.setItem('nuvia-language', 'ar'));
    await page.setViewportSize({ width: 393, height: 800 });
    await page.reload();
    await page.getByRole('heading', { name: 'لا توجد ردود بعد' }).waitFor();
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    await page.screenshot({ path: join(output, 'overview-ar-mobile.png'), fullPage: true });
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      'Mobile page must not overflow horizontally',
    );
    await page.goto(`${origin}/#/business-information`);
    await page.getByRole('heading', { name: 'معلومات النشاط' }).waitFor();
    assert.equal(await page.getByLabel(/اسم النشاط/).inputValue(), 'Browser Cafe');
    await page.screenshot({ path: join(output, 'onboarding-ar-mobile.png'), fullPage: true });
    const local = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    assert.ok(
      !local.includes('Changed123') &&
        !local.includes('Synthetic123') &&
        !local.includes('nuvia_session'),
    );
    await page.evaluate(() => localStorage.setItem('nuvia-language', 'en'));
    await page.goto(`${origin}/preview/#/dashboard`);
    await page.getByText('Design preview · معاينة التصميم').waitFor();
    await waitFor(async () => (await page.getByText('Bloom & Co.', { exact: true }).count()) > 0);
    assert.deepEqual(failures, [], 'Browser console/page errors');
    assert.equal(expectedSaveFailures, 1);
    assert.equal(expectedLoginFailures, 1);
    console.log(
      'Browser account lifecycle, persistence, failed-save recovery, reset, EN/AR, mobile overflow and preview checks: PASS',
    );
  } finally {
    await context.close();
  }
}
