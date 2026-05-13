import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img src={product.image_url} alt={product.name} className="product-card__image" />
      </Link>
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-card__name-link">
          <h3 className="product-card__name">{product.name}</h3>
        </Link>
        <p className="product-card__price">{formattedPrice}</p>
        <button
          className="btn btn--primary"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
