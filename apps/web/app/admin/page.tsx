"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import {
  createSlug,
  getAdminProducts,
  isAdminLoggedIn,
  saveManagedProducts
} from "../../lib/admin-store";
import type { Product } from "../../lib/products";

const emptyProduct: Product = {
  slug: "",
  name: "",
  price: 74000,
  color: "black",
  tone: "#111111",
  accent: "#fbf4df",
  visible: true
};

function readImage(event: ChangeEvent<HTMLInputElement>, onLoad: (value: string) => void) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      onLoad(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
      return;
    }

    setProducts(getAdminProducts());
    setReady(true);
  }, [router]);

  function persistProducts(nextProducts: Product[]) {
    setProducts(nextProducts);
    saveManagedProducts(nextProducts);
  }

  function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = draft.slug || createSlug(draft.name);
    const nextProduct = { ...draft, slug, visible: draft.visible !== false };
    const exists = products.some((product) => product.slug === slug);
    const nextProducts = exists
      ? products.map((product) => (product.slug === slug ? nextProduct : product))
      : [nextProduct, ...products];

    persistProducts(nextProducts);
    setDraft(emptyProduct);
  }

  if (!ready) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="admin-page">
        <section className="admin-heading">
          <h1>Admin</h1>
          <p>스토어 상품을 등록하고 관리합니다.</p>
        </section>

        <section className="admin-section">
          <h2>Product Register</h2>
          <form className="product-form" onSubmit={handleProductSubmit}>
            <label>
              Product name
              <input value={draft.name} required onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <label>
              Slug
              <input value={draft.slug} placeholder="자동 생성 가능" onChange={(event) => setDraft({ ...draft, slug: createSlug(event.target.value) })} />
            </label>
            <label>
              Price
              <input type="number" value={draft.price} min={0} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} />
            </label>
            <label>
              Sale price
              <input
                type="number"
                value={draft.salePrice ?? ""}
                min={0}
                onChange={(event) => setDraft({ ...draft, salePrice: event.target.value ? Number(event.target.value) : undefined })}
              />
            </label>
            <label>
              Badge
              <select value={draft.badge ?? ""} onChange={(event) => setDraft({ ...draft, badge: (event.target.value || undefined) as Product["badge"] })}>
                <option value="">없음</option>
                <option value="추천">추천</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
              </select>
            </label>
            <label>
              Color
              <input value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} />
            </label>
            <label>
              Cap color
              <input type="color" value={draft.tone} onChange={(event) => setDraft({ ...draft, tone: event.target.value })} />
            </label>
            <label>
              Product image
              <input type="file" accept="image/*" onChange={(event) => readImage(event, (imageUrl) => setDraft({ ...draft, imageUrl }))} />
            </label>
            <label className="check-label">
              <input type="checkbox" checked={draft.visible !== false} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} />
              스토어 노출
            </label>
            <button type="submit">SAVE PRODUCT</button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Product List</h2>
          <div className="admin-product-list">
            {products.map((product) => (
              <article className="admin-product-row" key={product.slug}>
                <div className="mini-thumb">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span style={{ background: product.tone }} />}</div>
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.slug}</p>
                </div>
                <button type="button" onClick={() => setDraft(product)}>
                  EDIT
                </button>
                <button
                  type="button"
                  onClick={() =>
                    persistProducts(products.map((item) => (item.slug === product.slug ? { ...item, visible: item.visible === false } : item)))
                  }
                >
                  {product.visible === false ? "SHOW" : "HIDE"}
                </button>
                <button type="button" onClick={() => persistProducts(products.filter((item) => item.slug !== product.slug))}>
                  DELETE
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
