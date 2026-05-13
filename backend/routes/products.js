import { Router } from 'express';

export function createProductsRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  });

  return router;
}
