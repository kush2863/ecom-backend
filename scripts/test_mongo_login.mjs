import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.MONGO_URL || process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGO_URL or MONGODB_URI set in environment');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to Mongo');
    const dbName = client.options?.dbName || process.env.MONGO_DB_NAME || 'ecom';
    const db = client.db(dbName);
    const users = db.collection('users');

    const email = 'test@example.com';
    const plain = 'Password123!';

    // ensure index
    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email });
    if (!existing) {
      const hashed = await bcrypt.hash(plain, 10);
      const res = await users.insertOne({ email, password: hashed, createdAt: new Date() });
      console.log('Inserted test user', res.insertedId.toString());
    } else {
      console.log('Test user already exists');
    }

    const found = await users.findOne({ email });
    const ok = await bcrypt.compare(plain, found.password);
    console.log('Password verify result:', ok);
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
