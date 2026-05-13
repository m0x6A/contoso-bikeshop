import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  function handleAddToCart() {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="product-detail">
      <Link to="/" className="product-detail__back">&larr; Back to Shop</Link>
      <div className="product-detail__content">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-detail__image"
        />
        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">{formattedPrice}</p>
          <p className="product-detail__description">{product.description}</p>
          <button className="btn btn--primary btn--large" onClick={handleAddToCart}>
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
