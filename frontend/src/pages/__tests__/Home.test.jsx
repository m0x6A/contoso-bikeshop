import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../../test/mocks/server';
import Home from '../Home';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderHome() {
  return render(
    <MemoryRouter>
      <Home onAddToCart={() => {}} />
    </MemoryRouter>
  );
}

describe('Home page', () => {
  it('shows loading state initially', () => {
    renderHome();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('fetches and displays product grid', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
    });
    expect(screen.getByText('Contoso Speedster Pro')).toBeInTheDocument();
    expect(screen.getByText('Contoso City Cruiser')).toBeInTheDocument();
  });

  it('renders a product card for each product', async () => {
    renderHome();
    await waitFor(() => {
      const cards = screen.getAllByRole('button', { name: /add to cart/i });
      expect(cards).toHaveLength(3);
    });
  });
});
