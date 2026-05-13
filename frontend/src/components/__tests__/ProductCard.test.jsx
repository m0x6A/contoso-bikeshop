import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  name: 'Contoso Trail Blazer',
  description: 'A rugged mountain bike.',
  price: 1299.99,
  image_url: '/images/mountain.svg',
  category: 'Mountain',
};

function renderCard(props = {}) {
  return render(
    <BrowserRouter>
      <ProductCard product={mockProduct} onAddToCart={() => {}} {...props} />
    </BrowserRouter>
  );
}

describe('ProductCard', () => {
  it('renders bike name', () => {
    renderCard();
    expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
  });

  it('renders price formatted as currency', () => {
    renderCard();
    expect(screen.getByText('$1,299.99')).toBeInTheDocument();
  });

  it('renders product image', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/mountain.svg');
    expect(img).toHaveAttribute('alt', 'Contoso Trail Blazer');
  });

  it('renders category badge', () => {
    renderCard();
    expect(screen.getByText('Mountain')).toBeInTheDocument();
  });

  it('"Add to Cart" button calls onAddToCart with product', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    renderCard({ onAddToCart });

    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('links to the product detail page', () => {
    renderCard();
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/products/1');
    }
  });
});
