import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

function renderNavbar(cartCount = 0) {
  return render(
    <MemoryRouter>
      <Navbar cartItemCount={cartCount} />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('renders "Contoso Bikes" branding', () => {
    renderNavbar();
    expect(screen.getByText('Contoso Bikes')).toBeInTheDocument();
  });

  it('has a link to home page', () => {
    renderNavbar();
    const homeLink = screen.getByRole('link', { name: /contoso bikes/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has a link to cart page', () => {
    renderNavbar();
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('shows cart item count badge when items exist', () => {
    renderNavbar(3);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show badge when cart is empty', () => {
    renderNavbar(0);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });
});
