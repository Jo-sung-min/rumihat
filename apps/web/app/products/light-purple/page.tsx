"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
import { ProductVisual } from "../../../components/ProductVisual";
import { addCartItem, clearCart } from "../../../lib/cart-store";
import { featuredProduct, formatWon } from "../../../lib/products";

const people = [
  "JENI / ASPA",
  "SEAH / GIRLS GENERATION",
  "MINJI / NWZ",
  "HANNI / SINGER",
  "CHAE WON / ACTOR",
  "HAE RUM / ACTOR",
  "JUNG HWA / SINGER",
  "HYUN KYUNG / ACTOR",
  "KIM BO RA / ACTOR"
];

export default function ProductDetailPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const option = { colorName: featuredProduct.color, sizeName: "FREE", stockQuantity: 0, extraPrice: 0 };

  function startCheckout(paymentMethod = "manual") {
    clearCart();
    addCartItem(featuredProduct, option, quantity);
    router.push(`/checkout?payment=${paymentMethod}`);
  }

  return (
    <>
      <Header />
      <main className="detail-page">
        <section className="detail-top">
          <div className="detail-visual">
            <ProductVisual tone={featuredProduct.tone} accent="#fff7e7" />
          </div>
          <aside className="buy-panel">
            <p className="eyebrow">Rumihat. Cotton Ball Cap</p>
            <h1>{featuredProduct.name}</h1>
            <p>{formatWon(featuredProduct.price)}</p>
            <dl>
              <div>
                <dt>COLOR</dt>
                <dd>LIGHT PURPLE</dd>
              </div>
              <div>
                <dt>SIZE</dt>
                <dd>FREE</dd>
              </div>
              <div>
                <dt>MATERIAL</dt>
                <dd>COTTON 100%</dd>
              </div>
            </dl>
            <label>
              OPTION
              <select defaultValue="light-purple">
                <option value="light-purple">LIGHT PURPLE / FREE</option>
              </select>
            </label>
            <div className="quantity-row">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)}>
                +
              </button>
            </div>
            <button className="buy-now" type="button" onClick={() => startCheckout()}>
              BUY NOW
            </button>
            <button
              className="add-cart"
              type="button"
              onClick={() => {
                addCartItem(featuredProduct, option, quantity);
                setCartMessage("Added to cart.");
              }}
            >
              ADD TO CART
            </button>
            <button className="kakao-pay" type="button" onClick={() => startCheckout("kakao_pay")}>
              KakaoPay
            </button>
            {cartMessage ? <p className="cart-message">{cartMessage}</p> : null}
          </aside>
        </section>
        <section className="people-grid">
          {people.map((name) => (
            <article key={name}>
              <Image src="/reference/product-detail.png" alt={`${name} wearing cap`} width={320} height={320} />
              <strong>{name.split(" / ")[0]}</strong>
              <span>{name.split(" / ")[1]}</span>
            </article>
          ))}
        </section>
        <section className="detail-campaign">
          <Image src="/reference/product-detail.png" alt="Light purple cap campaign detail" fill sizes="50vw" />
        </section>
        <section className="detail-copy">
          <h2>COM BALL CAP NEW COLOR</h2>
          <p>단정한 라이트 퍼플 컬러와 부드러운 입체 자수 로고를 중심으로 한 데일리 볼캡입니다.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
