import { CartItem, clearCart, getCartItems, getCartTotal } from "./cart-store";

export type OrderRecord = {
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  totalAmount: number;
  status: string;
  items: CartItem[];
  createdAt: string;
};

const ORDER_STORAGE_KEY = "rumihat.orders";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getOrders() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(ORDER_STORAGE_KEY) ?? "[]") as OrderRecord[];
  } catch {
    return [];
  }
}

export async function createLocalOrder(input: { buyerName: string; buyerEmail: string; receiverPhone?: string; shippingAddress?: string }) {
  const items = getCartItems();
  const totalAmount = getCartTotal(items);
  let orderNumber = `RUM-${Date.now()}`;
  let serverTotalAmount = totalAmount;

  if (items.length === 0) {
    throw new Error("No items to order");
  }

  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      receiverPhone: input.receiverPhone,
      shippingAddress: input.shippingAddress,
      items: items.map((item) => ({
        productSlug: item.slug,
        productName: item.name,
        optionLabel: item.optionLabel,
        unitPrice: item.unitPrice,
        quantity: item.quantity
      }))
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const result = (await response.json()) as { orderNumber?: string; totalAmount?: number };
  orderNumber = result.orderNumber ?? orderNumber;
  serverTotalAmount = result.totalAmount ?? serverTotalAmount;

  const order: OrderRecord = {
    orderNumber,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    totalAmount: serverTotalAmount,
    status: "PENDING",
    items,
    createdAt: new Date().toISOString()
  };

  if (canUseStorage()) {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order, ...getOrders()]));
  }

  clearCart();
  return order;
}

export async function fetchOrdersByEmail(email: string) {
  if (!email) {
    return getOrders();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/me`, {
      cache: "no-store",
      headers: {
        "X-Customer-Email": email
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const serverOrders = (await response.json()) as Array<{
      orderNumber: string;
      status: string;
      totalAmount: number;
      createdAt: string;
    }>;

    return serverOrders.map((order) => ({
      ...order,
      buyerName: "",
      buyerEmail: email,
      items: []
    }));
  } catch {
    return getOrders();
  }
}
