import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));

function composeConfig(overrides = [], createHostPathOverride) {
  const temporary = mkdtempSync(resolve(tmpdir(), 'nuvia-ai-compose-'));
  const envFile = resolve(temporary, 'empty.env');
  writeFileSync(envFile, '');
  try {
    const args = [
      'compose',
      '--project-directory',
      temporary,
      '--env-file',
      envFile,
      '-f',
      resolve(root, 'compose.yaml'),
    ];
    for (const file of overrides) args.push('-f', resolve(root, file));
    if (createHostPathOverride !== undefined) {
      const control = resolve(temporary, 'controlled-model-mount.json');
      writeFileSync(
        control,
        JSON.stringify({
          services: {
            ai: {
              volumes: [
                {
                  type: 'bind',
                  source: resolve(temporary, 'models-not-created'),
                  target: '/models',
                  read_only: true,
                  bind: { create_host_path: createHostPathOverride },
                },
              ],
            },
          },
        }),
      );
      args.push('-f', control);
    }
    args.push('--profile', 'ai', 'config', '--format', 'json');
    const result = spawnSync('docker', args, {
      cwd: temporary,
      encoding: 'utf8',
      windowsHide: true,
      env: {
        ...process.env,
        JWT_SECRET: 'synthetic-only-compose-test-secret-at-least-thirty-two-characters',
        AI_SERVICE_TOKEN: '',
        AI_BASELINE_MODE: 'false',
        AI_INFERENCE: 'false',
        AI_MODELS_DIRECTORY: resolve(temporary, 'models-not-created'),
      },
    });
    assert.equal(result.status, 0, 'Compose must resolve synthetic configuration without a daemon');
    return JSON.parse(result.stdout);
  } finally {
    // This directory is created by this test under the OS temporary directory only.
    rmSync(temporary, { recursive: true, force: true });
  }
}

test('default AI profile has no dependency on private model bind paths', () => {
  const config = composeConfig();
  assert.ok(config.services.ai);
  assert.equal(
    (config.services.ai.volumes || []).some((v) => v.target === '/models'),
    false,
  );
});

test('explicit model override remains read-only and does not create a missing host path', () => {
  const config = composeConfig(['compose.ai-models.yaml']);
  const mount = config.services.ai.volumes.find((v) => v.target === '/models');
  assert.equal(mount.type, 'bind');
  assert.equal(mount.read_only, true);
  // Older compose-go JSON serializers omit false booleans; both represent disabled.
  assert.equal(mount.bind?.create_host_path ?? false, false);
  assert.equal(config.services.ai.environment.AI_MODEL_ROOT, '/models');
});

test('configuration checks distinguish enabled host creation from an omitted false value', () => {
  const config = composeConfig(['compose.ai-models.yaml'], true);
  const mount = config.services.ai.volumes.find((v) => v.target === '/models');
  assert.equal(mount.bind.create_host_path, true);
});
