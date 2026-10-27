import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { startConnectedFixture } from './backend-fixture.mjs';
import { runAccountScenario } from './accounts.spec.mjs';
import { runSecurityScenario } from './security.spec.mjs';
const fixture = await startConnectedFixture();
let browser;
try {
  const executable =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
    [
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    ].find(existsSync);
  browser = await chromium.launch({
    headless: true,
    ...(executable ? { executablePath: executable } : {}),
  });
  const output = resolve('test-results/accounts');
  await mkdir(output, { recursive: true });
  await runAccountScenario({ browser, ...fixture, output });
  await runSecurityScenario({ browser, ...fixture, output });
} finally {
  await browser?.close();
  await fixture.close();
}
