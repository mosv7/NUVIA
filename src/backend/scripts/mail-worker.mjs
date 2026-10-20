import { loadConfig } from '../config.mjs';
import { connectDatabase, ensureSchema } from '../database.mjs';
import { deliverPendingMail } from '../mail/worker.mjs';
let connection;
try {
  const config = loadConfig();
  connection = await connectDatabase(config);
  await ensureSchema(connection.db);
  const deps = { ...connection, config, now: () => new Date() };
  let stop = false;
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, () => {
      stop = true;
    });
  console.log('Mail worker ready; messages and credentials are private.');
  do {
    await deliverPendingMail(deps);
    if (process.argv.includes('--once')) break;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } while (!stop);
} catch {
  console.error('Mail worker failed. Check private configuration and database availability.');
  process.exitCode = 1;
} finally {
  await connection?.close();
}
