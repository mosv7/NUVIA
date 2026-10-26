import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const path = fileURLToPath(new URL('../.env', import.meta.url));
if (existsSync(path)) {
  console.log(
    'Existing root .env preserved. Check JWT_SECRET, MONGODB_URI and MONGODB_DATABASE before starting.',
  );
} else {
  writeFileSync(
    path,
    [
      '# Private development configuration. Supply an explicit replica-set/Atlas URI.',
      'MONGODB_URI=',
      'MONGODB_DATABASE=nuvia',
      `JWT_SECRET=${randomBytes(48).toString('hex')}`,
      'APP_ORIGIN=http://127.0.0.1:5173',
      'HOST=127.0.0.1',
      'PORT=3001',
      'MAIL_MODE=file',
      '',
    ].join('\n'),
    { flag: 'wx', mode: 0o600 },
  );
  console.log(
    'Created private root .env. Configure the intended database before running db:check.',
  );
}
