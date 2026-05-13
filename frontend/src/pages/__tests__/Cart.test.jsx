import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../../test/mocks/server';
import { resetMockCart, mockCartItems } from '../../test/mocks/handlers';
import Cart from '../Cart';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetMockCart();
});
afterAll(() => server.close());

function renderCart(props = {}) {
  return render(
    <MemoryRouter>
      <Cart onCartUpdate={() => {}} {...props} />
    </MemoryRouter>
  );
}

function seedCart() {
  mockCartItems.push(
    {
      id: 1,
      product_id: 1,
      name: 'Contoso Trail Blazer',
      price: 1299.99,
      quantity: 2,
      image_url: '/images/mountain.svg',
    },
    {
      id: 2,
      product_id: 2,
      name: 'Contoso Speedster Pro',
      price: 1899.99,
      quantity: 1,
      image_url: '/images/road.svg',
    }
  );
}

describe('Cart page', () => {
  it('shows empty cart message when no items', async () => {
    renderCart();
    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('renders cart items', async () => {
    seedCart();
    renderCart();
    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });
    expect(screen.getByText('Contoso Speedster Pro')).toBeInTheDocument();
  });

  it('shows correct total', async () => {
    seedCart();
    renderCart();
    // Total: 1299.99 * 2 + 1899.99 * 1 = 4499.97
    await waitFor(() => {
      expect(screen.getByText('$4,499.97')).toBeInTheDocument();
    });
  });

  it('remove button removes item from cart', async () => {
    seedCart();
    const user = userEvent.setup();
    const onCartUpdate = vi.fn();
    renderCart({ onCartUpdate });

    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Contoso Trail Blazer')).not.toBeInTheDocument();
    });
  });
});
