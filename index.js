import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectMongo } from './config/mongo.js';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/health', (req, res) => res.json({ status: 'healthy', uptime: process.uptime() }));

async function start() {
  try {
    await connectMongo();
    app.listen(PORT, () => console.log(`Backend server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();









