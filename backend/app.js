import express from 'express';
import cors from 'cors';
import { createDb } from './db.js';
import { createProductsRouter } from './routes/products.js';
import { createCartRouter } from './routes/cart.js';

export function createApp(dbPath) {
  const db = createDb(dbPath);
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/products', createProductsRouter(db));
  app.use('/api/cart', createCartRouter(db));

  return app;
}
