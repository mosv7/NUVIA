import { loadConfig } from '../config.mjs';
import { connectDatabase } from '../database.mjs';
try {
  const connection = await connectDatabase(loadConfig());
  await connection.close();
  console.log('MongoDB authenticated ping succeeded. No data written.');
} catch {
  console.error('MongoDB check failed. Check network access, DNS/TLS and private credentials.');
  process.exitCode = 1;
}
