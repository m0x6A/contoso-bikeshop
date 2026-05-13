import { http, HttpResponse } from 'msw';

export const mockProducts = [
  {
    id: 1,
    name: 'Contoso Trail Blazer',
    description: 'A rugged mountain bike built for the toughest trails.',
    price: 1299.99,
    image_url: '/images/mountain.svg',
    category: 'Mountain',
  },
  {
    id: 2,
    name: 'Contoso Speedster Pro',
    description: 'Lightweight carbon frame road bike designed for speed.',
    price: 1899.99,
    image_url: '/images/road.svg',
    category: 'Road',
  },
  {
    id: 3,
    name: 'Contoso City Cruiser',
    description: 'Comfortable city bike with an upright riding position.',
    price: 699.99,
    image_url: '/images/city.svg',
    category: 'City',
  },
];

export let mockCartItems = [];

export function resetMockCart() {
  mockCartItems = [];
}

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find((p) => p.id === Number(params.id));
    if (!product) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.get('/api/cart', () => {
    return HttpResponse.json(mockCartItems);
  }),

  http.post('/api/cart', async ({ request }) => {
    const body = await request.json();
    const product = mockProducts.find((p) => p.id === body.productId);
    if (!product) {
      return HttpResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }
    const existing = mockCartItems.find((i) => i.product_id === body.productId);
    if (existing) {
      existing.quantity += body.quantity || 1;
      return HttpResponse.json(existing, { status: 201 });
    }
    const item = {
      id: mockCartItems.length + 1,
      product_id: body.productId,
      quantity: body.quantity || 1,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    };
    mockCartItems.push(item);
    return HttpResponse.json(item, { status: 201 });
  }),

  http.put('/api/cart/:id', async ({ params, request }) => {
    const body = await request.json();
    const item = mockCartItems.find((i) => i.id === Number(params.id));
    if (!item) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    item.quantity = body.quantity;
    return HttpResponse.json(item);
  }),

  http.delete('/api/cart/:id', ({ params }) => {
    const index = mockCartItems.findIndex((i) => i.id === Number(params.id));
    if (index === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    mockCartItems.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
