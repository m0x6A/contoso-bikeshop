import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

export default function Cart({ onCartUpdate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(() => {
    fetch('/api/cart')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
        if (onCartUpdate) onCartUpdate(data);
      })
      .catch(() => setLoading(false));
  }, [onCartUpdate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  function handleRemove(itemId) {
    fetch(`/api/cart/${itemId}`, { method: 'DELETE' }).then(() => {
      fetchCart();
    });
  }

  function handleUpdateQuantity(itemId, quantity) {
    fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    }).then(() => {
      fetchCart();
    });
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="cart__empty">
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn--primary">Browse Bikes</Link>
        </div>
      ) : (
        <>
          <div className="cart__items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
          <div className="cart__summary">
            <div className="cart__total">
              <span>Total:</span>
              <span className="cart__total-amount">{formattedTotal}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
