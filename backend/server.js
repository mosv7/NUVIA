if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: require('node:path').resolve(__dirname, '../.env'),
    quiet: true,
  });
}

const mongoose = require('mongoose');

const app = require('./app');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
      throw new Error('Configure JWT_SECRET with at least 32 characters');
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('Configure MONGODB_URI');
    const database = process.env.MONGODB_DATABASE || process.env.MONGODB_DB_NAME;
    if (!database) throw new Error('Configure MONGODB_DATABASE');
    await mongoose.connect(uri, {
      dbName: database,
      serverSelectionTimeoutMS: 10000,
      autoIndex: false,
    });
    const hello = await mongoose.connection.db.admin().command({ hello: 1 });
    if (!hello.setName && hello.msg !== 'isdbgrid')
      throw new Error('MongoDB must support transactions');
    await Promise.all(Object.values(require('./src/models')).map((model) => model.init()));
    await Promise.all(Object.values(require('./src/models')).map((model) => model.createIndexes()));

    console.log('MongoDB connected');

    app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch {
    console.error('Failed to start server. Check private database and JWT configuration.');
    process.exit(1);
  }
};

startServer();
