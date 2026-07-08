"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { getSessionProfile, isLoggedIn, logoutAdmin } from "../../lib/admin-store";
import { fetchOrdersByEmail, type OrderRecord } from "../../lib/order-store";
import { formatWon } from "../../lib/products";

export default function MyPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{ provider?: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const nextLoggedIn = isLoggedIn();
    const nextProfile = getSessionProfile();
    setLoggedIn(nextLoggedIn);
    setProfile(nextProfile);

    if (!nextLoggedIn || !nextProfile?.email) {
      setReady(true);
      return;
    }

    fetchOrdersByEmail(nextProfile.email)
      .then(setOrders)
      .finally(() => setReady(true));
  }, []);

  function openProduct(slug: string) {
    if (!slug) {
      window.alert("Product details are unavailable. Please contact customer support.");
      return;
    }

    router.push(`/products/${slug}`);
  }

  if (!ready) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="mypage">
        <section className="cart-heading">
          <h1>My Page</h1>
          <p>{loggedIn ? "Logged in" : "Guest"}</p>
        </section>
        {!loggedIn ? (
          <section className="login-required-panel">
            <h2>Login required</h2>
            <p>My Page and order history are available only after login.</p>
            <Link className="checkout-link" href="/login">
              LOGIN
            </Link>
          </section>
        ) : (
          <section className="mypage-grid">
            <article className="mypage-panel">
              <h2>Account</h2>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>{profile?.email || "No email"}</dd>
                </div>
                <div>
                  <dt>Provider</dt>
                  <dd>{profile?.provider || "password"}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  setLoggedIn(false);
                  setProfile(null);
                  setOrders([]);
                }}
              >
                LOGOUT
              </button>
            </article>
            <article className="mypage-panel">
              <h2>Orders</h2>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <section className="order-row" key={order.orderNumber}>
                      <div className="order-row-summary">
                        <strong>{order.orderNumber}</strong>
                        <span>{order.status}</span>
                        <span>{formatWon(order.totalAmount)}</span>
                        <small>{new Date(order.createdAt).toLocaleDateString("ko-KR")}</small>
                      </div>
                      <div className="order-item-list">
                        {order.items.length === 0 ? (
                          <button className="order-item-card missing" type="button" onClick={() => openProduct("")}>
                            <span className="order-item-thumb" />
                            <span>Product details unavailable</span>
                          </button>
                        ) : (
                          order.items.map((item) => (
                            <button className="order-item-card" type="button" key={item.id} onClick={() => openProduct(item.slug)}>
                              <span className="order-item-thumb">{item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : null}</span>
                              <span>
                                <strong>{item.name}</strong>
                                <small>
                                  {item.optionLabel} / {item.quantity} pcs
                                </small>
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
