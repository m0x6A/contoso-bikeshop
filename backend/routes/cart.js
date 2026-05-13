import { Router } from 'express';

export function createCartRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    const items = db
      .prepare(
        `SELECT cart_items.id, cart_items.product_id, cart_items.quantity,
                products.name, products.description, products.price, 
                products.image_url, products.category
         FROM cart_items
         JOIN products ON cart_items.product_id = products.id`
      )
      .all();
    res.json(items);
  });

  router.post('/', (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(400).json({ error: 'Invalid productId — product not found' });
    }

    const existing = db
      .prepare('SELECT * FROM cart_items WHERE product_id = ?')
      .get(productId);

    if (existing) {
      const newQty = existing.quantity + quantity;
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
      const updated = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(existing.id);
      return res.status(201).json(updated);
    }

    const result = db
      .prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)')
      .run(productId, quantity);
    const item = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  });

  router.put('/:id', (req, res) => {
    const { quantity } = req.body;
    const id = Number(req.params.id);

    if (quantity == null) {
      return res.status(400).json({ error: 'quantity is required' });
    }

    const existing = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, id);
    const updated = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(id);
    res.json(updated);
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    const existing = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
    res.status(204).send();
  });

  return router;
}
