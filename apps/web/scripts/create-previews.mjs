import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const appRoot = fileURLToPath(new URL('../', import.meta.url));
const built = path.join(appRoot, 'dist');
const output = path.resolve(appRoot, '../../previews');
if (!fs.existsSync(path.join(built, 'index.html'))) throw new Error('Run pnpm build first');
if (fs.existsSync(path.join(built, 'review.html')))
  throw new Error('Internal review page must not be published');
fs.mkdirSync(output, { recursive: true });
fs.cpSync(built, output, { recursive: true });
fs.mkdirSync(path.join(output, 'preview'), { recursive: true });
fs.copyFileSync(path.join(built, 'index.html'), path.join(output, 'preview/index.html'));
for (const [file, route, title] of [
  ['landing.html', 'landing', 'NUVIA — Landing'],
  ['business.html', 'business', 'NUVIA — Business'],
  ['feedback.html', 'customer-feedback', 'NUVIA — Feedback'],
]) {
  fs.writeFileSync(
    path.join(output, file),
    `<!doctype html>\n<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta http-equiv="refresh" content="0;url=./preview/#/${route}"></head><body><a href="./preview/#/${route}">Open preview</a></body></html>\n`,
  );
}
console.log(
  'Created previews/. Serve this directory over HTTP; direct file:// opening is not supported.',
);
