import { chromium } from 'playwright';
import { preview } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const appRoot = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../../docs/ui/frontend/', import.meta.url));
const matrix = JSON.parse(
  await fs.readFile(new URL('./screenshot-matrix.json', import.meta.url), 'utf8'),
);
const server = await preview({
  root: appRoot,
  configLoader: 'runner',
  configFile: path.join(appRoot, 'vite.config.js'),
  preview: {
    host: '127.0.0.1',
    port: Number(process.env.SCREENSHOT_PORT || 5191),
    strictPort: true,
  },
});
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
const manifest = [];
try {
  for (const language of matrix.languages)
    for (const view of matrix.views) {
      const context = await browser.newContext({
        viewport: { width: view.width, height: view.height },
        reducedMotion: 'reduce',
      });
      await context.addInitScript(
        (locale) => localStorage.setItem('nuvia-language', locale),
        language,
      );
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const route of matrix.routes) {
        await page.goto(base + '/preview/?capture=gallery#/' + route, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
        });
        const file = `screens/${view.name}/${language}/${route.replace('?id=', '-')}.png`;
        const destination = path.join(output, file);
        await fs.mkdir(path.dirname(destination), { recursive: true });
        const data = await page.screenshot({
          path: destination,
          fullPage: true,
          animations: 'disabled',
        });
        assert.equal(errors.length, 0, `${route}: ${errors.join('; ')}`);
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          true,
          `${route}: horizontal document overflow`,
        );
        manifest.push({
          file,
          route: '#/' + route,
          language,
          viewport: { width: view.width, height: view.height },
          image: { width: data.readUInt32BE(16), height: data.readUInt32BE(20) },
          sha256: crypto.createHash('sha256').update(data).digest('hex'),
        });
      }
      await context.close();
    }
  await fs.writeFile(
    path.join(output, 'capture-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(`Captured ${manifest.length} frontend screenshots.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
