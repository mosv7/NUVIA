// Use the configured inference interpreter so Qwen comparison reuses local CUDA.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const envFile = resolve(root, '.env');
const local =
  process.env.NODE_ENV !== 'production' && existsSync(envFile)
    ? parseEnv(readFileSync(envFile, 'utf8'))
    : {};
const values = { ...local, ...process.env };
const python = values.AI_PYTHON_EXECUTABLE;
const cli = process.argv.slice(2).filter((arg) => arg !== '--');
if (!['compare', 'promote'].includes(cli[0])) cli.unshift('compare');
const task = ['-m', 'scripts.compare_summaries', ...cli];
const aiEnvironment = Object.fromEntries(
  Object.entries(values).filter(([key]) => key.startsWith('AI_')),
);
const child = spawn(
  python || 'uv',
  python ? task : ['run', '--directory', resolve(root, 'apps/ai-service'), 'python', ...task],
  {
    cwd: python ? resolve(root, 'apps/ai-service') : root,
    env: { ...process.env, ...aiEnvironment },
    stdio: 'inherit',
    windowsHide: true,
  },
);
child.on('error', () => {
  console.error('Unable to start summary comparison; check private Python configuration.');
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
