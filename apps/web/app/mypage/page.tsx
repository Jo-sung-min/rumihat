"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { getSessionProfile, isAdminLoggedIn, logoutAdmin } from "../../lib/admin-store";
import { fetchOrdersByEmail, getOrders, type OrderRecord } from "../../lib/order-store";
import { formatWon } from "../../lib/products";

export default function MyPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{ provider?: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const nextLoggedIn = isAdminLoggedIn();
    const nextProfile = getSessionProfile();
    setLoggedIn(nextLoggedIn);
    setProfile(nextProfile);
    setOrders(getOrders());

    if (nextProfile?.email) {
      fetchOrdersByEmail(nextProfile.email).then(setOrders);
    }
  }, []);

  return (
    <>
      <Header />
      <main className="mypage">
        <section className="cart-heading">
          <h1>My Page</h1>
          <p>{loggedIn ? "Logged in" : "Guest"}</p>
        </section>
        <section className="mypage-grid">
          <article className="mypage-panel">
            <h2>Account</h2>
            {loggedIn ? (
              <>
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
                  }}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link className="checkout-link" href="/login">
                LOGIN
              </Link>
            )}
          </article>
          <article className="mypage-panel">
            <h2>Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <section className="order-row" key={order.orderNumber}>
                    <strong>{order.orderNumber}</strong>
                    <span>{order.status}</span>
                    <span>{formatWon(order.totalAmount)}</span>
                    <small>{new Date(order.createdAt).toLocaleDateString("ko-KR")}</small>
                  </section>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
