"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { CartItem, getCartItems, getCartTotal, removeCartItem, updateCartQuantity } from "../../lib/cart-store";
import { formatWon } from "../../lib/products";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const total = useMemo(() => getCartTotal(items), [items]);

  function refresh() {
    setItems(getCartItems());
  }

  return (
    <>
      <Header />
      <main className="cart-page">
        <section className="cart-heading">
          <h1>Cart</h1>
          <p>{items.length} items</p>
        </section>

        {items.length === 0 ? (
          <section className="empty-state">
            <h2>Your cart is empty</h2>
            <Link href="/store">STORE</Link>
          </section>
        ) : (
          <section className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-row" key={item.id}>
                  <div className="mini-thumb">{item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span />}</div>
                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <strong>{item.name}</strong>
                    </Link>
                    <p>{item.optionLabel}</p>
                    <p>{formatWon(item.unitPrice)}</p>
                  </div>
                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => {
                        updateCartQuantity(item.id, item.quantity - 1);
                        refresh();
                      }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => {
                        updateCartQuantity(item.id, item.quantity + 1);
                        refresh();
                      }}
                    >
                      +
                    </button>
                  </div>
                  <strong>{formatWon(item.unitPrice * item.quantity)}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      removeCartItem(item.id);
                      refresh();
                    }}
                  >
                    REMOVE
                  </button>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Summary</h2>
              <dl>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatWon(total)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd>{total >= 80000 ? "Free" : formatWon(3000)}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatWon(total + (total >= 80000 ? 0 : 3000))}</dd>
                </div>
              </dl>
              <Link className="checkout-link" href="/checkout">
                CHECKOUT
              </Link>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
