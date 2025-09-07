import { getDb } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

export async function getCart(req, res) {
  const userId = req.currentUser?._id?.toString() || req.params.userId;
  if (!userId) return res.status(400).json({ error: 'userId missing' });
  const db = getDb();
  const cart = await db.collection('carts').findOne({ userId });
  res.json({ items: (cart && Array.isArray(cart.items)) ? cart.items : [] });
}

export async function addToCart(req, res) {
  const userId = req.currentUser?._id?.toString();
  if (!userId) return res.status(401).json({ error: 'unauth' });
  const { itemId } = req.body;
  let quantity = req.body.quantity ?? req.body.qty ?? 1;
  quantity = Number(quantity) || 1;
  if (!itemId) return res.status(400).json({ error: 'itemId required' });
  const db = getDb();
  // try incrementing existing item
  const incResult = await db.collection('carts').updateOne(
    { userId, 'items.itemId': itemId },
    { $inc: { 'items.$.quantity': quantity } }
  );
  if (incResult.matchedCount === 0) {
    // push new item or create cart
    await db.collection('carts').updateOne(
      { userId },
      { $setOnInsert: { userId }, $push: { items: { itemId, quantity } } },
      { upsert: true }
    );
  }
  const cart = await db.collection('carts').findOne({ userId });
  res.json({ items: cart?.items || [] });
}

export async function removeFromCart(req, res) {
  const userId = req.currentUser?._id?.toString();
  if (!userId) return res.status(401).json({ error: 'unauth' });
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ error: 'itemId required' });
  const db = getDb();
  await db.collection('carts').updateOne({ userId }, { $pull: { items: { itemId } } });
  const cart = await db.collection('carts').findOne({ userId });
  res.json({ items: cart?.items || [] });
}
