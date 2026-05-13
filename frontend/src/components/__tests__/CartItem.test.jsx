import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItem from '../CartItem';

const mockItem = {
  id: 1,
  product_id: 1,
  name: 'Contoso Trail Blazer',
  price: 1299.99,
  quantity: 2,
  image_url: '/images/mountain.svg',
};

function renderItem(props = {}) {
  return render(
    <CartItem item={mockItem} onRemove={() => {}} onUpdateQuantity={() => {}} {...props} />
  );
}

describe('CartItem', () => {
  it('renders item name', () => {
    renderItem();
    expect(screen.getByText('Contoso Trail Blazer')).toBeInTheDocument();
  });

  it('renders item quantity', () => {
    renderItem();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('renders subtotal (price x quantity)', () => {
    renderItem();
    expect(screen.getByText('$2,599.98')).toBeInTheDocument();
  });

  it('renders unit price', () => {
    renderItem();
    expect(screen.getByText('$1,299.99 each')).toBeInTheDocument();
  });

  it('remove button calls onRemove with item id', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderItem({ onRemove });

    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('changing quantity calls onUpdateQuantity', () => {
    const onUpdateQuantity = vi.fn();
    renderItem({ onUpdateQuantity });

    const input = screen.getByDisplayValue('2');
    fireEvent.change(input, { target: { value: '5' } });
    expect(onUpdateQuantity).toHaveBeenCalledWith(1, 5);
  });
});
