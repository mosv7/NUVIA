// Executed by mongosh inside the local-only mongo-init container.
try {
  rs.status();
} catch (error) {
  if (error.code !== 94) throw error;
  rs.initiate({ _id: 'nuvia', members: [{ _id: 0, host: 'mongo:27017' }] });
}
let primary = false;
for (let attempt = 0; attempt < 80; attempt++) {
  if (db.hello().isWritablePrimary) {
    primary = true;
    break;
  }
  sleep(250);
}
if (!primary) throw new Error('Local replica set did not elect a primary.');
