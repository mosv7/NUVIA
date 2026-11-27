import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export async function runSurveyScenario({ browser, origin, output }) {
  const owner = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const customer = await browser.newContext({ viewport: { width: 393, height: 852 } });
  const ownerPage = await owner.newPage();
  const publicPage = await customer.newPage();
  const errors = [];
  for (const page of [ownerPage, publicPage]) {
    page.on('pageerror', (error) => errors.push(error.message));
  }

  async function ownerMutation(path, data, method = 'post') {
    const session = await (await owner.request.get(origin + '/api/auth/session')).json();
    const response = await owner.request[method](origin + '/api' + path, {
      headers: { Origin: origin, 'X-CSRF-Token': session.csrfToken },
      data,
    });
    assert.ok(response.ok(), path + ' returned ' + response.status());
    return response.json();
  }

  try {
    await ownerMutation('/auth/register', {
      name: 'Survey Owner',
      email: 'survey-owner@example.test',
      password: 'SyntheticSurvey123',
      passwordConfirmation: 'SyntheticSurvey123',
      preferredLanguage: 'en',
    });
    await ownerMutation('/onboarding/business', { name: 'Survey Cafe', type: 'restaurant' }, 'put');
    await ownerMutation('/onboarding/setup', { hasMultipleBranches: false }, 'put');
    await ownerMutation('/onboarding/complete', {});

    await ownerPage.goto(origin + '/#/surveys');
    await ownerPage.getByRole('button', { name: 'Create survey', exact: true }).click();
    await ownerPage.getByLabel('Name', { exact: true }).fill('Service survey');
    await ownerPage.getByRole('checkbox', { name: 'العربية', exact: true }).check();
    await ownerPage.getByRole('button', { name: 'Create', exact: true }).click();
    await ownerPage.waitForURL(/#\/survey-edit\?id=/u);
    const surveyId = new URLSearchParams(new URL(ownerPage.url()).hash.split('?')[1]).get('id');
    assert.ok(surveyId);
    await ownerPage.getByLabel('Question (English)', { exact: true }).fill('How was the service?');
    await ownerPage.getByLabel('Question (Arabic)', { exact: true }).fill('كيف كانت الخدمة؟');
    await ownerPage.getByRole('checkbox', { name: 'Required' }).check();
    await ownerPage.getByRole('button', { name: 'Add question', exact: true }).click();
    await ownerPage.getByText('Question added.', { exact: true }).waitFor();
    await ownerPage.getByRole('button', { name: 'Publish', exact: true }).click();
    await ownerPage.getByText('Survey published.', { exact: true }).waitFor();
    await ownerPage.getByRole('button', { name: 'Back', exact: true }).click();
    const surveyRow = ownerPage.getByRole('row', { name: /Service survey/u });
    await surveyRow.getByRole('link', { name: 'Share survey', exact: true }).click();
    const publicLink = ownerPage.getByRole('link', { name: 'Open public link', exact: true });
    await publicLink.waitFor();
    const qrDownload = ownerPage.getByRole('button', { name: 'Download QR as PNG', exact: true });
    await qrDownload.waitFor();
    const [download] = await Promise.all([ownerPage.waitForEvent('download'), qrDownload.click()]);
    assert.match(download.suggestedFilename(), /-qr\.png$/u);
    const bytes = await readFile(await download.path());
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), bytes.readUInt32BE(20));
    assert.ok(bytes.readUInt32BE(16) >= 256);
    const publicUrl = await publicLink.getAttribute('href');
    assert.equal(new URL(publicUrl).origin, origin);

    await publicPage.goto(publicUrl);
    await publicPage.getByRole('combobox', { name: /^Survey language/u }).selectOption('ar');
    const answer = publicPage.getByRole('textbox', { name: /كيف كانت الخدمة/u });
    await answer.fill('الخدمة كانت ممتازة');
    assert.ok(await publicPage.locator('main[dir="rtl"][lang="ar"]').isVisible());
    assert.ok(
      await publicPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    );
    await publicPage.screenshot({
      path: join(output, 'public-survey-ar-mobile.png'),
      fullPage: true,
    });
    await publicPage.getByRole('button', { name: 'إرسال الملاحظات', exact: true }).click();
    await publicPage.getByRole('heading', { name: 'شكرًا على ملاحظاتك!', exact: true }).waitFor();

    await ownerPage.goto(origin + '/#/feedbacks');
    const row = ownerPage.getByRole('row', { name: /الخدمة كانت ممتازة/u });
    await row.waitFor();
    const feedbackNavigation = ownerPage
      .locator('.product-navigation')
      .getByRole('button', { name: 'Feedbacks', exact: true });
    assert.equal(await feedbackNavigation.getAttribute('aria-current'), 'page');
    const iconVisible = await feedbackNavigation
      .locator('.workspace-navigation-icon')
      .evaluate((icon) => {
        const style = getComputedStyle(icon);
        return (
          icon.clientWidth >= 16 &&
          style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          style.maskImage !== 'none'
        );
      });
    assert.ok(iconVisible, 'Connected feedback must render its sidebar icon');
    await ownerPage.screenshot({
      path: join(output, 'connected-feedback-en-desktop.png'),
      fullPage: true,
    });
    await row.getByRole('button', { name: 'Details', exact: true }).click();
    await ownerPage.getByText('الخدمة كانت ممتازة', { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log(
      'Survey builder, PNG sharing, public bilingual form, stored response and owned detail: PASS',
    );
  } finally {
    await Promise.all([owner.close(), customer.close()]);
  }
}
