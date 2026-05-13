import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Products API', () => {
  let app;

  beforeAll(() => {
    app = createApp(':memory:');
  });

  describe('GET /api/products', () => {
    it('returns 200 with an array of products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 6 seeded products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.body).toHaveLength(6);
    });

    it('each product has expected fields', async () => {
      const res = await request(app).get('/api/products');
      for (const product of res.body) {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('image_url');
        expect(product).toHaveProperty('category');
      }
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns a single product by id', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(res.body.name).toBeTruthy();
    });

    it('returns 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for invalid id', async () => {
      const res = await request(app).get('/api/products/abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
