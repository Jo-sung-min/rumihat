import { formatWon } from "./products";

export type AdminOrderItem = {
  productName: string;
  optionName: string;
  unitPrice: number;
  quantity: number;
};

export type AdminOrder = {
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  receiverPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount: number;
  createdAt: string;
  items: AdminOrderItem[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function fetchAdminOrders() {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch admin orders");
  }

  return (await response.json()) as AdminOrder[];
}

export async function updateAdminOrderStatus(orderNumber: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/${encodeURIComponent(orderNumber)}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }
}

function escapeCsv(value: string | number | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadOrdersCsv(orders: AdminOrder[]) {
  const headers = ["Order number", "Order status", "Payment method", "Payment status", "Customer", "Email", "Phone", "Address", "Amount", "Items", "Created at"];
  const rows = orders.map((order) => [
    order.orderNumber,
    order.status,
    order.paymentMethod ?? "MANUAL",
    order.paymentStatus ?? "PENDING_PAYMENT",
    order.customerName,
    order.customerEmail,
    order.receiverPhone ?? "",
    order.shippingAddress ?? "",
    formatWon(order.totalAmount),
    order.items.map((item) => `${item.productName} / ${item.optionName} x ${item.quantity}`).join(" | "),
    new Date(order.createdAt).toLocaleString("ko-KR")
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `rumihat-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
