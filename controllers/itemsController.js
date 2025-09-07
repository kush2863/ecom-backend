import { getDb } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

export async function listItems(req, res) {
  const db = getDb();
  const { q, minPrice, maxPrice, category, addedAfter } = req.query || {};
  const filter = {};
  if (q) {
    const re = new RegExp(q.toString(), 'i');
    filter.$or = [{ title: re }, { description: re }];
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice && !Number.isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
    if (maxPrice && !Number.isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
    // remove empty
    if (Object.keys(filter.price).length === 0) delete filter.price;
  }
  if (category) filter.category = category.toString();
  if (addedAfter) {
    const d = new Date(addedAfter.toString());
    if (!Number.isNaN(d.getTime())) filter.createdAt = { $gte: d };
  }

  const items = await db.collection('items').find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  const out = items.map(i => ({ id: i._id.toString(), title: i.title, price: i.price, image: i.image, description: i.description, category: i.category, createdAt: i.createdAt }));
  res.json(out);
}

export async function getItem(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'invalid id' });
  const db = getDb();
  const item = await db.collection('items').findOne({ _id: new ObjectId(id) });
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json({ id: item._id.toString(), title: item.title, price: item.price, image: item.image, description: item.description, category: item.category, createdAt: item.createdAt });
}

export async function createItem(req, res) {
  const { title, price, image, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const db = getDb();
  const result = await db.collection('items').insertOne({ title, price: Number(price) || 0, image: image || null, description: description || null, createdAt: new Date() });
  res.json({ id: result.insertedId.toString() });
}
