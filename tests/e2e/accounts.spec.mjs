import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
async function waitFor(callback, ms = 10000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await callback()) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('Timed out waiting for browser state');
}
async function assertDashboardSidebar(page) {
  const sidebar = page.locator('.product-navigation');
  assert.ok(await sidebar.isVisible(), 'Authenticated dashboard must render workspace navigation');
  for (const label of ['Overview', 'Feedbacks', 'Surveys', 'Settings']) {
    assert.ok(
      await sidebar.getByRole('button', { name: label }).first().isVisible(),
      `Workspace navigation must expose ${label} on the connected dashboard`,
    );
  }
}
async function assertHelpCenterFlow(page, { mobile = false, arabic = false, output }) {
  if (mobile) await page.getByRole('button', { name: 'Navigation menu' }).click();
  const label = arabic ? 'مركز المساعدة' : 'Help center';
  const helpButton = page.locator('.product-navigation').getByRole('button', { name: label });
  assert.ok(await helpButton.first().isVisible(), `${label} must be reachable from the workspace`);
  await helpButton.first().click();
  await waitFor(() => page.url().endsWith('#/help-center'));
  const heading = arabic ? 'مركز المساعدة' : 'Help center';
  await page.getByRole('heading', { name: heading, exact: true, level: 1 }).waitFor();
  assert.ok(
    await page.getByText(arabic ? 'مساعدة ذاتية فقط' : 'Self-service help only').isVisible(),
  );
  assert.ok(
    await page.getByText(arabic ? /الدردشة المباشرة/ : /Live chat, email support/).isVisible(),
    'Help center must state that live support is unavailable',
  );
  assert.equal(
    await page
      .locator(
        '[data-preview-page="help-center"] input, [data-preview-page="help-center"] textarea',
      )
      .count(),
    0,
    'Help center must not present a fake support form',
  );
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    'Help center must not overflow horizontally',
  );
  const question = arabic
    ? 'هل يمكنني التواصل مع الدعم من هذه الصفحة؟'
    : 'Can I contact support from this page?';
  const summary = page.locator('summary', { hasText: question });
  assert.equal(await summary.evaluate((element) => element.parentElement.open), false);
  await summary.click();
  assert.equal(await summary.evaluate((element) => element.parentElement.open), true);
  if (output)
    await page.screenshot({
      path: join(output, arabic ? 'help-center-ar-mobile.png' : 'help-center-en-desktop.png'),
      fullPage: true,
      animations: 'disabled',
    });
  const back = arabic ? 'العودة إلى النظرة العامة' : 'Back to Overview';
  const backLink = page.getByRole('link', { name: back }).first();
  assert.ok(await backLink.isVisible(), 'Help center must link back to the dashboard');
  await backLink.click();
  await waitFor(() => page.url().endsWith('#/dashboard'));
  await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
  if (!mobile) await assertDashboardSidebar(page);
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
      path === '/api/onboarding/business' &&
      response.request().method() === 'PUT'
    )
      expectedSaveFailures++;
    else if (response.status() === 401 && path === '/api/auth/login') expectedLoginFailures++;
    else failures.push(`${response.status()} ${path}`);
  });
  const mailLink = async (kind) => {
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
    await page.getByRole('heading', { name: 'Business information' }).waitFor();
    const login = async (password) => {
      await page.getByLabel('Work email').fill('browser@example.test');
      await page.getByLabel('Password', { exact: true }).fill(password);
      await page.getByRole('button', { name: 'Log in', exact: true }).click();
    };
    let failOnce = true;
    await page.route('**/api/onboarding/business', (route) => {
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
    await page.getByRole('radio', { name: /Multiple branches/ }).check();
    await page.getByLabel(/Primary branch name/).fill('Main Branch');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('heading', { name: 'Welcome to NUVIA' }).waitFor();
    await page.getByRole('button', { name: 'Get Started', exact: true }).click();
    await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
    assert.ok(page.url().endsWith('#/dashboard'), 'Onboarding must land on the dashboard');
    await assertDashboardSidebar(page);
    assert.equal(await page.getByText('Bloom & Co.', { exact: true }).count(), 0);
    await page.screenshot({ path: join(output, 'overview-en-desktop.png'), fullPage: true });
    await assertHelpCenterFlow(page, { output });
    await page.reload();
    await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
    await assertDashboardSidebar(page);
    await page.goto(`${origin}/#/feedbacks`);
    await page.getByRole('heading', { name: 'Feedbacks', exact: true }).waitFor();
    await page.getByText('No responses yet.', { exact: true }).waitFor();
    assert.ok(await page.getByPlaceholder('Search feedback').isVisible());
    assert.equal(await page.locator('tbody tr').count(), 0);
    for (const width of [1440, 393]) {
      await page.setViewportSize({ width, height: width === 393 ? 800 : 900 });
      assert.equal(await page.locator('.workspace-account-actions').count(), 0);
      // Capture the first exposed layout, before a later effect can hide a positioning race.
      const firstLayout = page.evaluate(
        () =>
          new Promise((resolve) => {
            const observer = new MutationObserver(() => {
              const button = document.querySelector('#workspace-profile .workspace-signout');
              if (!button) return;
              observer.disconnect();
              const { x, y, width, height } = button.getBoundingClientRect();
              resolve({ x, y, width, height });
            });
            observer.observe(document.body, { childList: true, subtree: true });
          }),
      );
      await page.getByRole('button', { name: 'Profile', exact: true }).click();
      const initialLogout = await firstLayout;
      assert.ok(
        initialLogout.y >= 0 &&
          initialLogout.y + initialLogout.height <= (width === 393 ? 800 : 900),
        `Sign out must be reachable on first layout: ${JSON.stringify(initialLogout)}`,
      );
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
      await page.keyboard.press('Escape');
      assert.ok(
        await page
          .getByRole('button', { name: 'Profile', exact: true })
          .evaluate((element) => element === document.activeElement),
        'Escape returns focus to the account trigger',
      );
      await page.getByRole('button', { name: 'Profile', exact: true }).click();
      await page.getByRole('button', { name: 'View profile', exact: true }).click();
      await waitFor(() => page.url().endsWith('#/settings'));
      if (width === 393) {
        await page.getByRole('button', { name: /^Personal information/ }).click();
        await page
          .getByRole('heading', { name: 'Personal information', exact: true, level: 2 })
          .waitFor();
      } else await page.getByRole('heading', { name: 'Account settings', exact: true }).waitFor();
      assert.ok((await page.getByText('Browser Cafe', { exact: true }).count()) > 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.goto(`${origin}/#/feedbacks`);
      await page.getByRole('heading', { name: 'Feedbacks', exact: true }).waitFor();
      await page.getByText('No responses yet.', { exact: true }).waitFor();
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${origin}/#/branches`);
    await page.getByRole('button', { name: 'Add branch', exact: true }).click();
    await page.getByLabel(/Branch name/).fill('Browser Second');
    await page.getByLabel(/Country/).fill('Egypt');
    await page.getByLabel(/City/).fill('Cairo');
    await page.getByLabel(/Street address/).fill('Synthetic browser street');
    await page.getByRole('button', { name: 'Save branch', exact: true }).click();
    await page.getByRole('button', { name: 'Actions Browser Second', exact: true }).click();
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await waitFor(() => page.url().includes('#/branch-edit?id='));
    await page.reload();
    await waitFor(
      async () => (await page.getByLabel(/Branch name/).inputValue()) === 'Browser Second',
    );
    assert.equal(await page.getByLabel(/City/).inputValue(), 'Cairo');
    await page.screenshot({ path: join(output, 'branch-edit-en-desktop.png'), fullPage: true });
    await page.getByLabel(/Branch name/).fill('Browser Renamed');
    await page.getByRole('button', { name: 'Save branch', exact: true }).click();
    await page.getByRole('button', { name: 'Actions Browser Renamed', exact: true }).click();
    await page.getByRole('button', { name: 'Archive branch', exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Archive branch', exact: true })
      .click();
    await page.getByRole('button', { name: 'Actions Browser Renamed', exact: true }).waitFor();
    await waitFor(() => page.getByRole('button', { name: 'Add branch', exact: true }).isEnabled());
    assert.equal(
      await page
        .locator('.branch-row')
        .filter({ hasText: 'Browser Renamed' })
        .locator('.badge')
        .textContent(),
      'Archived',
    );
    await page.goto(`${origin}/#/assistant`);
    await page.getByRole('button', { name: 'Branch', exact: true }).click();
    assert.ok(await page.getByRole('option', { name: 'Main Branch', exact: true }).isVisible());
    assert.equal(await page.getByRole('option', { name: 'Cairo', exact: true }).count(), 0);
    await page.keyboard.press('Escape');
    await page.goto(`${origin}/#/surveys`);
    await page.getByRole('heading', { name: 'Surveys', exact: true }).first().waitFor();
    await page.goto(`${origin}/#/feedbacks`);
    await page.getByRole('button', { name: 'Open Ask NUVIA' }).click();
    assert.equal(await page.getByRole('link', { name: 'View supporting feedback' }).count(), 0);
    await page.goto(`${origin}/preview/#/feedbacks`);
    await page.getByText('Design preview · معاينة التصميم').waitFor();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${origin}/#/dashboard`);
    await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Profile', exact: true }).click();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
    await login('Synthetic123');
    await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
    assert.ok(page.url().endsWith('#/dashboard'), 'Login must land on the dashboard');
    await assertDashboardSidebar(page);
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
    await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
    await assertDashboardSidebar(page);
    await page.goto(`${origin}/?lang=ar#/dashboard`);
    await page.setViewportSize({ width: 393, height: 800 });
    await page.reload();
    await page.getByRole('heading', { name: 'Overview', exact: true }).waitFor();
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    await waitFor(async () =>
      page.locator('.product-navigation').evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= innerWidth || rect.right <= 0;
      }),
    );
    await page.screenshot({
      path: join(output, 'overview-ar-mobile.png'),
      fullPage: true,
      animations: 'disabled',
    });
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      'Mobile page must not overflow horizontally',
    );
    await assertHelpCenterFlow(page, { mobile: true, arabic: true, output });
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
