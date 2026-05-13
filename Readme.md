# Contoso Bikes 🚲

A webshop demo for Contoso Bikes built with React, Express, and SQLite. Features a product catalog and shopping cart.

## Project Structure

```
backend/         Express API (port 3001)
frontend/        React + Vite app (port 5173)
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

API runs at `http://localhost:3001`. Endpoints:
- `GET /api/products` — list all bikes
- `GET /api/products/:id` — single bike
- `GET /api/cart` — view cart
- `POST /api/cart` — add to cart (`{ productId, quantity }`)
- `PUT /api/cart/:id` — update quantity
- `DELETE /api/cart/:id` — remove item

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. API calls are proxied to the backend.

## Running Tests

Both projects use **Vitest**.

```bash
# Backend: 29 tests (DB unit + API integration)
cd backend && npm test

# Frontend: 32 tests (components + pages + integration)
cd frontend && npm test
```

## Tech Stack

- **Frontend**: React 19, React Router, Vite
- **Backend**: Express, better-sqlite3, CORS
- **Testing**: Vitest, Supertest (backend), React Testing Library + MSW (frontend)
