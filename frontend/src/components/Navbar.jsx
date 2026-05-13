import { Link } from 'react-router-dom';

export default function Navbar({ cartItemCount = 0 }) {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">🚲</span>
          <span>Contoso Bikes</span>
        </Link>
        <div className="navbar__links">
          <Link to="/" className="navbar__link">Shop</Link>
          <Link to="/cart" className="navbar__link navbar__cart-link">
            Cart
            {cartItemCount > 0 && (
              <span className="navbar__badge" data-testid="cart-badge">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
