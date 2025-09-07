Mongo backend

This backend now uses MongoDB. It provides auth, items and cart endpoints backed by a MongoDB database.

Run locally:

1. cd backend
2. npm install
3. Set `MONGO_URL` (or `MONGODB_URI`) in `backend/.env` (or export it in your environment)
4. npm run start

Environment variables (in `backend/.env`):
- MONGO_URL or MONGODB_URI - Mongo connection string (mongodb+srv://... or mongodb://...)
- MONGO_DB_NAME (optional) - database name, default: ecom
- JWT_SECRET (optional) - secret for signing tokens
- PORT (optional)

Endpoints:
- POST /api/auth/signup { email, password, name }
- POST /api/auth/login { email, password }
- GET /api/items
- GET /api/items/:id
- POST /api/items (protected)
- GET /api/cart/:userId (protected)
- POST /api/cart/add (protected) { itemId, qty }
- POST /api/cart/remove (protected) { itemId }
