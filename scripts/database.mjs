import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const requireBackend = createRequire(new URL('../backend/package.json', import.meta.url));
const dotenv = requireBackend('dotenv');
const mongoose = requireBackend('mongoose');
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
}

export async function withDatabase(operation) {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGODB_DATABASE || process.env.MONGODB_DB_NAME;
  if (!uri || !dbName)
    throw new Error(
      'Set private MONGODB_URI and explicit MONGODB_DATABASE in the root configuration.',
    );
  try {
    await mongoose.connect(uri, { dbName, autoIndex: false, serverSelectionTimeoutMS: 10000 });
    const hello = await mongoose.connection.db.admin().command({ hello: 1 });
    if (!hello.setName && hello.msg !== 'isdbgrid')
      throw new Error('A MongoDB replica set or Atlas deployment is required.');
    await operation(mongoose, requireBackend);
  } finally {
    await mongoose.disconnect();
  }
}

export function reportFailure() {
  // Driver messages can contain private connection details; keep diagnostics generic.
  console.error(
    'Database operation failed. Check the intended database name, private URI, replica set and network access.',
  );
  process.exitCode = 1;
}
