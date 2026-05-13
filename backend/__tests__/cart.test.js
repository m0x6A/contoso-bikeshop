import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Cart API', () => {
  let app;

  beforeAll(() => {
    app = createApp(':memory:');
  });

  describe('GET /api/cart', () => {
    it('returns empty array initially', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/cart', () => {
    it('adds an item to the cart and returns 201', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({ productId: 1, quantity: 2 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.product_id).toBe(1);
      expect(res.body.quantity).toBe(2);
    });

    it('upserts quantity when adding same product again', async () => {
      // Add product 2
      await request(app).post('/api/cart').send({ productId: 2, quantity: 1 });
      // Add same product again
      await request(app).post('/api/cart').send({ productId: 2, quantity: 3 });

      const res = await request(app).get('/api/cart');
      const item = res.body.find((i) => i.product_id === 2);
      expect(item.quantity).toBe(4);
    });

    it('returns 400 for missing productId', async () => {
      const res = await request(app).post('/api/cart').send({ quantity: 1 });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for invalid productId', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({ productId: 999, quantity: 1 });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('defaults quantity to 1 if not provided', async () => {
      const res = await request(app).post('/api/cart').send({ productId: 3 });
      expect(res.status).toBe(201);
      expect(res.body.quantity).toBe(1);
    });
  });

  describe('GET /api/cart (with items)', () => {
    it('returns cart items joined with product data', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);

      const item = res.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('product_id');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('image_url');
    });
  });

  describe('PUT /api/cart/:id', () => {
    it('updates item quantity', async () => {
      // Get current cart to find an item id
      const cart = await request(app).get('/api/cart');
      const itemId = cart.body[0].id;

      const res = await request(app)
        .put(`/api/cart/${itemId}`)
        .send({ quantity: 5 });
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
    });

    it('returns 404 for non-existent cart item', async () => {
      const res = await request(app)
        .put('/api/cart/999')
        .send({ quantity: 1 });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for missing quantity', async () => {
      const cart = await request(app).get('/api/cart');
      const itemId = cart.body[0].id;

      const res = await request(app).put(`/api/cart/${itemId}`).send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/cart/:id', () => {
    it('removes an item from the cart', async () => {
      const cartBefore = await request(app).get('/api/cart');
      const itemId = cartBefore.body[0].id;
      const countBefore = cartBefore.body.length;

      const res = await request(app).delete(`/api/cart/${itemId}`);
      expect(res.status).toBe(204);

      const cartAfter = await request(app).get('/api/cart');
      expect(cartAfter.body.length).toBe(countBefore - 1);
    });

    it('returns 404 for non-existent cart item', async () => {
      const res = await request(app).delete('/api/cart/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
