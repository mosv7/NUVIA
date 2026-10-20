import { loadConfig } from '../config.mjs';
import { connectDatabase, ensureSchema } from '../database.mjs';
try {
  const connection = await connectDatabase(loadConfig());
  try {
    await ensureSchema(connection.db);
    console.log('Database indexes/schema ready.');
  } finally {
    await connection.close();
  }
} catch {
  console.error('Database setup failed; no incompatible schema was dropped.');
  process.exitCode = 1;
}
