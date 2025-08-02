export type CartItem = {
  id: number;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  quantity: number;
};

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(items));
  window.dispatchEvent(new Event('cartchange'));
}
