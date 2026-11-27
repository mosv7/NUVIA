import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

export async function runSignupVerificationScenario({ browser, origin, deps, output }) {
  const owner = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const inboxBrowser = await browser.newContext({ viewport: { width: 393, height: 852 } });
  const ownerPage = await owner.newPage();
  const inboxPage = await inboxBrowser.newPage();
  const email = 'verify-signup@example.test';
  const sessionUrl = origin + '/api/auth/session';
  const session = async (context) => (await context.request.get(sessionUrl)).json();

  async function write(path, data, method = 'post') {
    const { csrfToken } = await session(owner);
    const response = await owner.request[method](origin + '/api' + path, {
      headers: { Origin: origin, 'X-CSRF-Token': csrfToken },
      data,
    });
    assert.ok(response.ok(), path + ' returned ' + response.status());
  }

  try {
    await write('/auth/register', {
      name: 'Verification Owner',
      email,
      password: 'SyntheticEmail123',
      passwordConfirmation: 'SyntheticEmail123',
      preferredLanguage: 'en',
    });
    await write('/onboarding/business', { name: 'Verified Cafe', type: 'restaurant' }, 'put');
    await write('/onboarding/setup', { hasMultipleBranches: false }, 'put');
    await write('/onboarding/complete', {});
    assert.equal((await session(owner)).user.emailVerified, false);

    await ownerPage.goto(origin + '/#/settings-security');
    await ownerPage.getByRole('button', { name: 'Verify email address', exact: true }).click();
    await ownerPage
      .getByRole('heading', { name: 'Verify your email address', exact: true })
      .waitFor();

    let verificationUrl;
    const deadline = Date.now() + 5000;
    while (!verificationUrl && Date.now() < deadline) {
      const messages = await readdir(deps.config.mailDirectory);
      for (const file of messages) {
        try {
          const mail = JSON.parse(await readFile(join(deps.config.mailDirectory, file), 'utf8'));
          if (mail.to !== email) continue;
          verificationUrl = mail.text
            .split('\n')
            .find((line) => line.includes('#/verify-email?token='));
          if (verificationUrl) break;
        } catch (error) {
          if (!(error instanceof SyntaxError)) throw error;
        }
      }
      if (!verificationUrl) await sleep(50);
    }
    assert.ok(verificationUrl, 'Registration should provide a development verification link');
    assert.equal(new URL(verificationUrl).origin, origin);

    await inboxPage.goto(verificationUrl);
    const confirm = inboxPage.getByRole('button', { name: 'Confirm email address', exact: true });
    await confirm.waitFor();
    assert.ok(!inboxPage.url().includes('token='));
    assert.ok(await inboxPage.evaluate(() => !JSON.stringify(history.state).includes('token=')));
    assert.equal((await session(owner)).user.emailVerified, false);
    assert.equal((await session(inboxBrowser)).user, null);
    await inboxPage.screenshot({
      path: join(output, 'signup-email-confirm-en-mobile.png'),
      fullPage: true,
    });
    await confirm.click();
    await inboxPage.getByRole('heading', { name: 'Email verified', exact: true }).waitFor();
    assert.equal((await session(owner)).user.emailVerified, true);
    assert.equal((await session(inboxBrowser)).user, null);
    console.log('Signup proof, explicit confirmation and preserved account session: PASS');
  } finally {
    await Promise.all([owner.close(), inboxBrowser.close()]);
  }
}
