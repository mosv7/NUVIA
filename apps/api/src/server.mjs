import { loadConfig } from './config/env.mjs';
import { connectDatabase, ensureSchema } from './shared/database/connection.mjs';
import { createApp } from './app.mjs';

let connection;
try {
  const config = loadConfig();
  connection = await connectDatabase(config);
  await ensureSchema(connection.models);
  const deps = { ...connection, config, now: () => new Date() };
  const server = createApp(deps).listen(config.port, config.host, () =>
    console.log(`NUVIA API listening on ${config.host}:${config.port}`),
  );
  server.on('error', async () => {
    console.error('API listener failed.');
    await connection.close();
    process.exitCode = 1;
  });
  let closing = false;
  const close = () => {
    if (closing) return;
    closing = true;
    server.close(async () => {
      await connection.close();
    });
    server.closeIdleConnections();
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
} catch {
  await connection?.close();
  console.error('API startup failed. Check private configuration and database availability.');
  process.exitCode = 1;
}
