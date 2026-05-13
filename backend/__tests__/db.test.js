import { describe, it, expect, beforeEach } from 'vitest';
import { createDb } from '../db.js';

describe('Database layer', () => {
  let db;

  beforeEach(() => {
    db = createDb(':memory:');
  });

  describe('initialization', () => {
    it('creates products table', () => {
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
        .all();
      expect(tables).toHaveLength(1);
    });

    it('creates cart_items table', () => {
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='cart_items'")
        .all();
      expect(tables).toHaveLength(1);
    });
  });

  describe('seed data', () => {
    it('inserts 6 products', () => {
      const products = db.prepare('SELECT * FROM products').all();
      expect(products).toHaveLength(6);
    });

    it('each product has required fields', () => {
      const products = db.prepare('SELECT * FROM products').all();
      for (const product of products) {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('image_url');
        expect(product).toHaveProperty('category');
        expect(product.name).toBeTruthy();
        expect(product.price).toBeGreaterThan(0);
      }
    });

    it('has products in different categories', () => {
      const categories = db
        .prepare('SELECT DISTINCT category FROM products')
        .all()
        .map((r) => r.category);
      expect(categories.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('queries', () => {
    it('can query all products', () => {
      const products = db.prepare('SELECT * FROM products').all();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(6);
    });

    it('can query a single product by id', () => {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(1);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
    });

    it('returns undefined for non-existent product', () => {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(999);
      expect(product).toBeUndefined();
    });
  });

  describe('cart_items table', () => {
    it('starts empty', () => {
      const items = db.prepare('SELECT * FROM cart_items').all();
      expect(items).toHaveLength(0);
    });

    it('can insert a cart item', () => {
      db.prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)').run(1, 2);
      const items = db.prepare('SELECT * FROM cart_items').all();
      expect(items).toHaveLength(1);
      expect(items[0].product_id).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it('enforces foreign key on product_id', () => {
      expect(() => {
        db.prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)').run(999, 1);
      }).toThrow();
    });
  });
});
