import { withDatabase, reportFailure } from './database.mjs';

await withDatabase(async (_mongoose, requireBackend) => {
  const models = requireBackend('./src/models/index.js');
  for (const model of Object.values(models)) await model.createIndexes();
  console.log(
    'Backend declared indexes created additively. No records, IDs or existing indexes migrated or removed.',
  );
}).catch(reportFailure);
