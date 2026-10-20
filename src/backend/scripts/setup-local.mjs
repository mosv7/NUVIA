import { writeFile, access } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
try {
  await access('.env');
  console.log('Existing .env preserved.');
} catch {
  await writeFile(
    '.env',
    `MONGODB_DATABASE=nuvia\nAPP_ORIGIN=http://127.0.0.1:5173\nMAIL_MODE=file\nMAIL_ENCRYPTION_KEY=${randomBytes(32).toString('hex')}\n`,
    { flag: 'wx', mode: 0o600 },
  );
  console.log(
    'Created private development .env; Atlas settings belong in .local/config/atlas-credentials.env.',
  );
}
