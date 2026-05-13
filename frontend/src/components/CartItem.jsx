export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const subtotal = item.price * item.quantity;

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.price);

  function handleQuantityChange(e) {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty > 0) {
      onUpdateQuantity(item.id, newQty);
    }
  }

  return (
    <div className="cart-item">
      <img src={item.image_url} alt={item.name} className="cart-item__image" />
      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__price">{formattedPrice} each</p>
      </div>
      <div className="cart-item__quantity">
        <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</label>
        <input
          id={`qty-${item.id}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="cart-item__qty-input"
        />
      </div>
      <div className="cart-item__subtotal">{formattedSubtotal}</div>
      <button className="btn btn--danger" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </div>
  );
}
