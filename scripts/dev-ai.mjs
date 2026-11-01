// Prefer an explicitly configured local inference interpreter; otherwise use uv.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const privateEnv = resolve(root, '.env');
const local =
  process.env.NODE_ENV !== 'production' && existsSync(privateEnv)
    ? parseEnv(readFileSync(privateEnv, 'utf8'))
    : {};
const values = { ...local, ...process.env };
const python = values.AI_PYTHON_EXECUTABLE;
const server = ['uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'];
const args = python
  ? ['-m', ...server]
  : ['run', '--directory', resolve(root, 'apps/ai-service'), ...server];
args.push(...process.argv.slice(2).filter((arg) => arg !== '--'));
const aiEnvironment = Object.fromEntries(
  Object.entries(values).filter(([key]) => key.startsWith('AI_')),
);
const child = spawn(python || 'uv', args, {
  cwd: python ? resolve(root, 'apps/ai-service') : root,
  env: { ...process.env, ...aiEnvironment },
  stdio: 'inherit',
  windowsHide: true,
});
child.on('error', () => {
  console.error('Unable to start AI runtime; check its private configuration.');
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
