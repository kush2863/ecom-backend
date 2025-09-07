import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URL || process.env.MONGODB_URI;
let client = null;
let db = null;

export async function connectMongo() {
   
  if (db) return db;
  if (!uri) throw new Error('MONGO_URL or MONGODB_URI not set in environment');
  client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  // if a database name is supplied in the connection string it'll be used by client.db(); otherwise default to 'ecom'
  const dbName = client.options?.dbName || process.env.MONGO_DB_NAME || 'ecom';
  db = client.db(dbName);
  // create indexes commonly used
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('items').createIndex({ title: 'text' });
  await db.collection('carts').createIndex({ userId: 1 }, { unique: true });
  return db;
}

export function getDb() {
  if (!db) throw new Error('Mongo not connected - call connectMongo() first');
  return db;
}

export async function closeMongo() {
  if (client) await client.close();
  client = null; db = null;
}
