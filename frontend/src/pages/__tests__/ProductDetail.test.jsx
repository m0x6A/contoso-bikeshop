import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { server } from '../../test/mocks/server';
import ProductDetail from '../ProductDetail';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderDetail(productId = '1', onAddToCart = () => {}) {
  return render(
    <MemoryRouter initialEntries={[`/products/${productId}`]}>
      <Routes>
        <Route
          path="/products/:id"
          element={<ProductDetail onAddToCart={onAddToCart} />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProductDetail page', () => {
  it('shows loading state initially', () => {
    renderDetail();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('fetches and displays product info', async () => {
    renderDetail('1');
    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });
    expect(screen.getByText('$1,299.99')).toBeInTheDocument();
    expect(screen.getByText(/rugged mountain bike/i)).toBeInTheDocument();
  });

  it('"Add to Cart" button triggers onAddToCart', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    renderDetail('1', onAddToCart);

    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Contoso Trail Blazer' })
    );
  });

  it('shows product image', async () => {
    renderDetail('1');
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/images/mountain.svg');
    });
  });
});
