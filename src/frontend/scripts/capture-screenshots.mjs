import { chromium } from 'playwright';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../../docs/ui/frontend/', import.meta.url));
const routes = [
  'landing',
  'login',
  'signup',
  'forgot',
  'reset',
  'business-information',
  'business-setup',
  'get-started',
];
const server = await createServer({
  root: appRoot,
  configFile: path.join(appRoot, 'vite.config.js'),
  server: {
    host: '127.0.0.1',
    port: Number(process.env.SCREENSHOT_PORT || 5191),
    strictPort: true,
  },
});
await server.listen();
const address = server.httpServer.address();
const url = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const captured = new Set();
const errors = [];
try {
  await fs.mkdir(output, { recursive: true });
  const page = await browser.newPage({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
  page.on('pageerror', (error) => errors.push(error.message));
  const capture = async (name, fullPage = true) => {
    await page.screenshot({ path: path.join(output, name), fullPage, animations: 'disabled' });
    captured.add(name);
  };
  for (const language of ['en', 'ar']) {
    for (const mobile of [false, true]) {
      const width = mobile ? 393 : 1440;
      await page.setViewportSize({ width, height: mobile ? 800 : 960 });
      await page.goto(url);
      await page.evaluate((value) => localStorage.setItem('nuvia-language', value), language);
      for (const route of routes) {
        await page.goto(`${url}/#/${route}`);
        await page.reload();
        await page.waitForSelector(
          route === 'landing'
            ? '.hero-copy'
            : ['login', 'signup', 'forgot', 'reset'].includes(route)
              ? '.auth-content'
              : '.setup-card',
        );
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          await Promise.all([...document.images].map((img) => img.decode()));
        });
        if (route === 'landing')
          await page.waitForFunction(() =>
            document.querySelector('.hero-dashboard').style.getPropertyValue('--dashboard-scale'),
          );
        const checks = await page.evaluate(
          ({ mobile, route }) => {
            if (document.documentElement.scrollWidth > innerWidth) return 'Horizontal overflow';
            if (!mobile) return '';
            if (route === 'landing') {
              const link = document.querySelector('.landing-signin');
              if (
                getComputedStyle(link).fontSize !== '14px' ||
                link.getBoundingClientRect().height < 44
              )
                return 'Outdated landing button';
              return '';
            }
            const setup = !!document.querySelector('.business-onboarding');
            const header = document.querySelector(setup ? '.setup-header' : '.auth-panel > header');
            const footer = document.querySelector(setup ? '.setup-footer' : '.auth-panel > footer');
            const icon = footer.querySelector('.language-icon');
            if (getComputedStyle(header.querySelector('.brand')).display !== 'none')
              return 'Outdated header logo';
            if (
              !icon ||
              !icon.getBoundingClientRect().width ||
              getComputedStyle(icon).color !== 'rgb(30, 104, 239)'
            )
              return 'Outdated language icon';
            if (
              setup &&
              (getComputedStyle(header.querySelector('.setup-help')).display !== 'none' ||
                footer.querySelector('.setup-mobile-help').getBoundingClientRect().height < 44)
            )
              return 'Outdated help placement';
            if (route === 'signup' && document.documentElement.scrollHeight > innerHeight + 1)
              return 'Signup exceeds review viewport';
            return '';
          },
          { mobile, route },
        );
        if (checks) throw new Error(`${language} ${width} ${route}: ${checks}`);
        const name = mobile
          ? route === 'landing'
            ? `${language}-mobile.png`
            : `${language}-mobile-${route}.png`
          : `${language}-${route}.png`;
        await capture(name);
        if (mobile && route === 'landing') {
          if (language === 'ar') await capture('active-ar-mobile-hero.png', false);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await capture(`active-${language}-mobile-footer.png`, false);
        }
        console.log(`${language} ${width} ${route}: captured and checked`);
      }
    }
  }
  const stale = (await fs.readdir(output)).filter(
    (name) => name.endsWith('.png') && !captured.has(name),
  );
  if (stale.length) throw new Error(`Unrefreshed screenshots: ${stale.join(', ')}`);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Updated all ${captured.size} screenshots, including every existing PNG.`);
} finally {
  await browser.close();
  await server.close();
}
