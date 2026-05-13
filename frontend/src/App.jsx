import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import './App.css';

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleAddToCart = useCallback(async (product) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });
    const res = await fetch('/api/cart');
    const items = await res.json();
    setCartItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const handleCartUpdate = useCallback((items) => {
    setCartItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar cartItemCount={cartItemCount} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route
              path="/products/:id"
              element={<ProductDetail onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart onCartUpdate={handleCartUpdate} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
