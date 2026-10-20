import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const output = path.resolve(root, '../..', 'previews');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const jsPath = html.match(/src="\/([^\"]+\.js)"/)[1];
const cssPath = html.match(/href="\/([^\"]+\.css)"/)[1];
const mime = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const data = (file) =>
  `data:${mime[path.extname(file)] || 'application/octet-stream'};base64,${fs.readFileSync(file).toString('base64')}`;
const assetMap = {};

function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (mime[path.extname(file)]) {
      const relative = path
        .relative(path.join(root, 'public/assets'), file)
        .split(path.sep)
        .join('/');
      assetMap[`/assets/${relative}`] = data(file);
    }
  }
}

visit(path.join(root, 'public/assets'));
const css = fs
  .readFileSync(path.join(dist, cssPath), 'utf8')
  .replace(/url\(([^)]+)\)/g, (match, value) => {
    const target = value.replace(/^['"]|['"]$/g, '');
    const file = path.join(dist, target.replace(/^\//, ''));
    return fs.existsSync(file) ? `url("${data(file)}")` : match;
  });
const js = fs.readFileSync(path.join(dist, jsPath), 'utf8').replace(/<\/script/gi, '<\\/script');
fs.mkdirSync(output, { recursive: true });

for (const [file, route, title] of [
  ['landing.html', 'landing', 'NUVIA — Landing'],
  ['business.html', 'business-information', 'NUVIA — Business'],
]) {
  const content = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${css}</style></head><body><div id="root"></div><script>window.NUVIA_PREVIEW=true;window.NUVIA_ASSETS=${JSON.stringify(assetMap)};if(!location.hash)location.hash="/${route}";</script><script type="module">${js}</script></body></html>`;
  fs.writeFileSync(path.join(output, file), content);
  console.log(`Created previews/${file}`);
}
