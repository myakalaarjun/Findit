import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reloop';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Standard connection to ${uri} failed: ${err.message}`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback for local development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to in-memory fallback instance at: ${memUri}`);
      return conn;
    } catch (fallbackErr) {
      console.error('[MongoDB] Critical connection error:', fallbackErr);
      process.exit(1);
    }
  }
};
