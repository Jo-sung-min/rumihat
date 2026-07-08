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
  const [paymentMethod, setPaymentMethod] = useState("MANUAL");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
    setBuyerEmail(getSessionProfile()?.email ?? "");
    const params = new URLSearchParams(window.location.search);
    setPaymentMethod(params.get("payment") === "kakao_pay" ? "KAKAO_PAY" : "MANUAL");
  }, []);

  const subtotal = useMemo(() => getCartTotal(items), [items]);
  const shippingFee = subtotal >= 80000 ? 0 : 3000;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createLocalOrder({ buyerName, buyerEmail, receiverPhone, shippingAddress: address, paymentMethod });
      router.push("/mypage");
    } catch {
      setErrorMessage("주문 저장에 실패했습니다. API 서버와 DB 연결을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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
              <label>
                Payment
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                  <option value="MANUAL">Manual payment request</option>
                  <option value="KAKAO_PAY">KakaoPay request</option>
                </select>
              </label>
              <p className="payment-note">외부 결제 승인은 아직 연결 전입니다. 지금은 관리자 확인용 결제 요청으로 저장됩니다.</p>
              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
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
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "CREATING..." : "CREATE ORDER"}
              </button>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
