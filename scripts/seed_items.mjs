import dotenv from 'dotenv';
dotenv.config();

import { connectMongo, getDb, closeMongo } from '../config/mongo.js';

const items = [
  {
    title: 'Classic Leather Sneakers',
    description: 'Comfortable everyday leather sneakers with rubber sole.',
  price: 59.99,
    image: 'https://images.unsplash.com/photo-1528701800489-476e6a3b4f74?q=80&w=1200&auto=format&fit=crop&crop=faces',
  category: 'Footwear',
  },
  {
    title: 'Minimalist Watch',
    description: 'Slim stainless steel watch with leather strap.',
  price: 129.0,
    image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=1200&auto=format&fit=crop&crop=faces',
  category: 'Accessories',
  },
  {
    title: 'Canvas Weekend Bag',
    description: 'Durable canvas bag for short trips and daily use.',
  price: 79.5,
    image: 'https://images.unsplash.com/photo-1520975910896-5f3b0c1a0b3d?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Bags',
  },
  {
    title: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear wireless headphones.',
  price: 199.99,
    image: 'https://images.unsplash.com/photo-1518444020734-6c1a0b1f3b6b?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Electronics',
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Soft organic cotton tee, regular fit.',
  price: 24.0,
    image: 'https://images.unsplash.com/photo-1520975922149-848b6f9c2a1c?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Apparel',
  },
  {
    title: 'Ceramic Coffee Mug',
    description: 'Handmade ceramic mug, 350ml capacity.',
  price: 18.75,
    image: 'https://images.unsplash.com/photo-1509401935578-9b1b5f6f9b1a?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Home',
  },
  {
    title: 'Indoor Plant - Ficus',
    description: 'Low-maintenance indoor ficus plant in a ceramic pot.',
  price: 34.0,
    image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Plants',
  },
  {
    title: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 12h battery life.',
  price: 49.99,
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Electronics',
  },
  {
    title: 'Yoga Mat',
    description: 'Non-slip yoga mat, 6mm thickness.',
  price: 29.99,
    image: 'https://images.unsplash.com/photo-1584467735867-3be7a3b1f4c1?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Fitness',
  },
  {
    title: 'Scented Candle',
    description: 'Soy wax candle - lavender scent, 200g.',
  price: 14.99,
    image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Home',
  },
  {
    title: 'Travel Water Bottle',
    description: 'Insulated stainless steel bottle, 750ml.',
  price: 22.5,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Outdoors',
  },
  {
    title: 'Desk Notebook',
    description: 'Hardcover A5 notebook with dotted pages.',
  price: 9.99,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  category: 'Stationery',
  }
];

async function seed() {
  try {
    const db = await connectMongo();
    const col = db.collection('items');

    let created = 0;
    let updated = 0;

    for (const it of items) {
      const filter = { title: it.title };
  const update = { $set: { ...it, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } };
      const res = await col.updateOne(filter, update, { upsert: true });
      if (res.upsertedCount && res.upsertedCount > 0) created += 1;
      else if (res.matchedCount && res.modifiedCount >= 0) updated += 1;
    }

    console.log(`Seeding complete. created=${created}, updated=${updated}`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await closeMongo();
  }
}

seed();
