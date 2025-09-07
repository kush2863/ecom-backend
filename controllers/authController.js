import bcrypt from 'bcrypt';
import { getDb } from '../config/mongo.js';
import { signToken } from '../middleware/auth.js';
import { ObjectId } from 'mongodb';

export async function signup(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const db = getDb();
  const existing = await db.collection('users').findOne({ email });
  if (existing) return res.status(409).json({ error: 'user exists' });
  const hash = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({ email, password: hash, name: name || null, createdAt: new Date() });
  const user = { id: result.insertedId.toString(), email };
  const token = signToken({ sub: user.id, email });
  res.json({ user, token });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const db = getDb();
  const user = await db.collection('users').findOne({ email });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = signToken({ sub: user._id.toString(), email });
  res.json({ user: { id: user._id.toString(), email: user.email, name: user.name }, token });
}
