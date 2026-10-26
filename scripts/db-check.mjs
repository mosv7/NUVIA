import { withDatabase, reportFailure } from './database.mjs';

await withDatabase(async (mongoose) => {
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log(
    'Database connection and replica-set capability verified; no application data changed.',
  );
}).catch(reportFailure);
