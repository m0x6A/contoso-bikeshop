import { describe, it, expect, beforeAll, afterEach, afterAll, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../test/mocks/server';
import { resetMockCart } from '../test/mocks/handlers';
import App from '../App';

beforeAll(() => server.listen());
beforeEach(() => {
  window.history.pushState({}, '', '/');
});
afterEach(() => {
  server.resetHandlers();
  resetMockCart();
});
afterAll(() => server.close());

describe('App integration', () => {
  it('renders navbar and home page by default', async () => {
    render(<App />);
    expect(screen.getByText('Contoso Bikes')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });
  });

  it('navigates to product detail when clicking a product', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Contoso Trail Blazer'));

    await waitFor(() => {
      expect(screen.getByText(/rugged mountain bike/i)).toBeInTheDocument();
    });
  });

  it('navigates to cart page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('link', { name: /cart/i }));

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('can add item to cart and see badge update', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
    });
  });
});
