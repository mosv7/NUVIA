import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function runSecurityScenario({ browser, origin, deps, output }) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  const email = 'security-browser@example.test',
    password = 'SyntheticPassword123';
  const mutate = async (url, data) => {
    const csrf = (await (await context.request.get(`${origin}/api/auth/session`)).json()).csrfToken;
    const response = await context.request.post(`${origin}/api${url}`, {
      headers: { Origin: origin, 'X-CSRF-Token': csrf },
      data,
    });
    assert.ok(response.ok(), `API ${url}: ${response.status()}`);
    return response.status() === 204 ? null : response.json();
  };
  try {
    await mutate('/auth/register', {
      name: 'Security Browser',
      email,
      password,
      passwordConfirmation: password,
    });
    const setup = (await mutate('/settings/security/2fa/setup', {})).data;
    const bits = [...setup.secret]
      .map((char) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(char).toString(2).padStart(5, '0'))
      .join('');
    const counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
    const digest = crypto
      .createHmac('sha1', Buffer.from(bits.match(/.{8}/g).map((byte) => parseInt(byte, 2))))
      .update(counter)
      .digest();
    const code = String((digest.readUInt32BE(digest[19] & 15) & 0x7fffffff) % 1000000).padStart(
      6,
      '0',
    );
    const recovery = (await mutate('/settings/security/2fa/enable', { code })).data.recoveryCodes;
    await mutate('/auth/logout', {});
    const login = async (language) => {
      await page.goto(`${origin}/?lang=${language}#/login`);
      await page.getByLabel(language === 'ar' ? 'بريد العمل' : 'Work email').fill(email);
      await page
        .getByLabel(language === 'ar' ? 'كلمة المرور' : 'Password', { exact: true })
        .fill(password);
      await page
        .getByRole('button', { name: language === 'ar' ? 'تسجيل الدخول' : 'Log in', exact: true })
        .click();
      await page
        .getByRole('heading', {
          name: language === 'ar' ? 'تأكيد تسجيل الدخول' : 'Verify your sign-in',
        })
        .waitFor();
      assert.equal(page.url().split('#')[1], '/login-2fa');
    };
    await login('en');
    await page.getByLabel('Authenticator or recovery code').fill('invalid');
    await page.getByRole('button', { name: 'Verify sign-in', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'The code is invalid' }).waitFor();
    await page.screenshot({ path: join(output, 'two-factor-en-desktop.png'), fullPage: true });
    await page.reload();
    await page.getByRole('status').filter({ hasText: 'This step has expired' }).waitFor();
    await page.setViewportSize({ width: 393, height: 800 });
    await login('ar');
    await page.screenshot({ path: join(output, 'two-factor-ar-mobile.png'), fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.getByLabel('رمز المصادقة أو الاسترداد').fill(recovery[0]);
    await page.getByRole('button', { name: 'تأكيد تسجيل الدخول', exact: true }).click();
    await page.getByRole('heading', { name: 'معلومات النشاط' }).waitFor();
    await mutate('/settings/security/email', {
      newEmail: 'confirmed-browser@example.test',
      currentPassword: password,
    });
    const messages = await Promise.all(
      (await readdir(deps.config.mailDirectory)).map(async (file) =>
        JSON.parse(await readFile(join(deps.config.mailDirectory, file), 'utf8')),
      ),
    );
    const mail = messages.find((item) => item.to === 'confirmed-browser@example.test');
    const link = mail.text
      .split('\n')
      .find((line) => line.startsWith(origin) && line.includes('/confirm-email?'));
    assert.ok(link);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(link.replace('/#/', '/?lang=en#/'));
    await page.getByRole('heading', { name: 'Confirm your new email' }).waitFor();
    assert.ok(!page.url().includes('token='), 'Token removed from the address before confirmation');
    await page.screenshot({ path: join(output, 'email-confirm-en-desktop.png'), fullPage: true });
    await page.getByRole('button', { name: 'Confirm new email', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Email changed.' }).waitFor();
    await page.setViewportSize({ width: 393, height: 800 });
    await page.goto(link.replace('/#/', '/?lang=ar#/'));
    await page.getByRole('heading', { name: 'تأكيد بريدك الجديد' }).waitFor();
    await page.getByRole('button', { name: 'تأكيد البريد الجديد', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'تعذر تأكيد الرابط' }).waitFor();
    await page.screenshot({ path: join(output, 'email-confirm-ar-mobile.png'), fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(failures, []);
    console.log(
      'Real 2FA enrollment, browser challenge/recovery, email confirmation/replay and EN/AR layouts: PASS',
    );
  } finally {
    await context.close();
  }
}
