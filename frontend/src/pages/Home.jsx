import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading bikes...</div>;
  }

  return (
    <div className="home">
      <div className="home__header">
        <h1>Our Bikes</h1>
        <p>Find your perfect ride from the Contoso collection</p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
