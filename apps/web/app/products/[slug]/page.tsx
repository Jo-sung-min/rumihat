"use client";

import { useEffect, useState } from "react";
import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
import { ProductVisual } from "../../../components/ProductVisual";
import { getDetailProducts } from "../../../lib/admin-store";
import { formatWon, type Product } from "../../../lib/products";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProduct(getDetailProducts().find((item) => item.slug === params.slug) ?? null);
  }, [params.slug]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="auth-page">
          <section className="auth-panel">
            <h1>Not Found</h1>
            <p>등록된 상품을 찾을 수 없습니다.</p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="detail-page">
        <section className="detail-top">
          <div className="detail-visual">
            {product.imageUrl ? (
              <img className="detail-managed-image" src={product.imageUrl} alt={product.name} />
            ) : (
              <ProductVisual
                tone={product.tone}
                accent={product.accent}
                logo={product.name.includes("small logo") ? "sebs" : "com"}
                flower={product.name.includes("FLOWER")}
              />
            )}
          </div>
          <aside className="buy-panel">
            <p className="eyebrow">Rumihat. Cotton Ball Cap</p>
            <h1>{product.name}</h1>
            <p>{formatWon(product.salePrice ?? product.price)}</p>
            <dl>
              <div>
                <dt>COLOR</dt>
                <dd>{product.color.toUpperCase()}</dd>
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
              <select defaultValue={product.slug}>
                <option value={product.slug}>{product.color.toUpperCase()} / FREE</option>
              </select>
            </label>
            <div className="quantity-row">
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
            <button className="buy-now">BUY NOW</button>
            <button className="add-cart">ADD TO CART</button>
            <button className="kakao-pay">KakaoPay</button>
          </aside>
        </section>
        <section className="detail-copy">
          <h2>COM BALL CAP COLLECTION</h2>
          <p>{product.name}은 데일리 착용에 맞춘 코튼 볼캡 라인입니다.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
