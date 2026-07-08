import type { Product, ProductOption } from "./products";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  optionLabel: string;
  unitPrice: number;
  quantity: number;
};

const CART_STORAGE_KEY = "rumihat.cart";
const CART_EVENT = "rumihat.cart.changed";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCart(): CartItem[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function getCartItems() {
  return readCart();
}

export function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

export function subscribeCart(listener: () => void) {
  window.addEventListener(CART_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(CART_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function addCartItem(product: Product, option: ProductOption | undefined, quantity: number) {
  const optionColor = option?.colorName ?? product.color;
  const optionSize = option?.sizeName ?? "FREE";
  const optionLabel = `${optionColor.toUpperCase()} / ${optionSize}`;
  const id = `${product.slug}:${optionLabel}`;
  const unitPrice = (product.salePrice ?? product.price) + (option?.extraPrice ?? 0);
  const nextQuantity = Math.max(1, quantity);
  const items = readCart();
  const existing = items.find((item) => item.id === id);

  if (existing) {
    writeCart(items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + nextQuantity } : item)));
    return;
  }

  writeCart([
    ...items,
    {
      id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      optionLabel,
      unitPrice,
      quantity: nextQuantity
    }
  ]);
}

export function updateCartQuantity(id: string, quantity: number) {
  const nextQuantity = Math.max(1, quantity);
  writeCart(readCart().map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item)));
}

export function removeCartItem(id: string) {
  writeCart(readCart().filter((item) => item.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export function getCartTotal(items = readCart()) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}
