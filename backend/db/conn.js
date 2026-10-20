const mongoose = require('mongoose');

const DB =
  process.env.DATABASE ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/codecraft';

const connectDB = async () => {
  try {
    await mongoose.connect(DB, { serverSelectionTimeoutMS: 2000 });
    console.log('Database connected successfully to CodeCraft DB');
  } catch (err) {
    try {
      // Automatic embedded fallback if local MongoDB service is not active
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'codecraft' },
      });
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Database connected successfully to CodeCraft DB');
    } catch (fallbackErr) {
      console.error('Error connecting to CodeCraft DB:', err.message);
    }
  }
};

connectDB();

module.exports = mongoose.connection;
