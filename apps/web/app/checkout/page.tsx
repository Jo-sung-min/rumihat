"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { getCartItems, getCartTotal, type CartItem } from "../../lib/cart-store";
import { getSessionProfile } from "../../lib/admin-store";
import { createLocalOrder } from "../../lib/order-store";
import { formatWon } from "../../lib/products";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setItems(getCartItems());
    setBuyerEmail(getSessionProfile()?.email ?? "");
  }, []);

  const subtotal = useMemo(() => getCartTotal(items), [items]);
  const shippingFee = subtotal >= 80000 ? 0 : 3000;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createLocalOrder({ buyerName, buyerEmail, receiverPhone, shippingAddress: address });
    router.push("/mypage");
  }

  return (
    <>
      <Header />
      <main className="checkout-page">
        <section className="cart-heading">
          <h1>Checkout</h1>
          <p>{items.length} items</p>
        </section>
        {items.length === 0 ? (
          <section className="empty-state">
            <h2>No items to checkout</h2>
            <Link href="/store">STORE</Link>
          </section>
        ) : (
          <form className="checkout-layout" onSubmit={handleSubmit}>
            <section className="checkout-form">
              <label>
                Buyer name
                <input required value={buyerName} onChange={(event) => setBuyerName(event.target.value)} />
              </label>
              <label>
                Email
                <input required type="email" value={buyerEmail} onChange={(event) => setBuyerEmail(event.target.value)} />
              </label>
              <label>
                Phone
                <input required value={receiverPhone} onChange={(event) => setReceiverPhone(event.target.value)} />
              </label>
              <label>
                Shipping address
                <textarea required value={address} onChange={(event) => setAddress(event.target.value)} />
              </label>
            </section>
            <aside className="cart-summary">
              <h2>Order</h2>
              <dl>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatWon(subtotal)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd>{shippingFee === 0 ? "Free" : formatWon(shippingFee)}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatWon(subtotal + shippingFee)}</dd>
                </div>
              </dl>
              <button type="submit">CREATE ORDER</button>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
