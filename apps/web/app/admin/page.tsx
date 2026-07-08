"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { downloadOrdersCsv, fetchAdminOrders, updateAdminOrderStatus, type AdminOrder } from "../../lib/admin-orders";
import {
  createSlug,
  deleteProduct,
  fetchAdminProducts,
  isAdminLoggedIn,
  saveProduct,
  saveManagedProducts
} from "../../lib/admin-store";
import type { Product, ProductCategory, ProductStatus } from "../../lib/products";

const categories: ProductCategory[] = ["CAP", "HAT", "BEANIE", "TOP", "BOTTOM", "OUTER", "BAG", "ACCESSORY"];
const statuses: ProductStatus[] = ["DRAFT", "ACTIVE", "HIDDEN", "SOLD_OUT"];
const orderStatuses = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const emptyProduct: Product = {
  slug: "",
  name: "",
  category: "CAP",
  price: 74000,
  color: "black",
  tone: "#111111",
  accent: "#fbf4df",
  visible: true,
  status: "ACTIVE",
  displayOrder: 0,
  options: [{ colorName: "black", sizeName: "FREE", stockQuantity: 0, extraPrice: 0 }]
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

function readImages(event: ChangeEvent<HTMLInputElement>, onLoad: (values: string[]) => void) {
  const files = Array.from(event.target.files ?? []);

  if (files.length === 0) {
    return;
  }

  Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
          reader.readAsDataURL(file);
        })
    )
  ).then((values) => onLoad(values.filter(Boolean)));
}

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
      return;
    }

    Promise.all([fetchAdminProducts(), fetchAdminOrders().catch(() => [])]).then(([items, orderItems]) => {
      setProducts(items);
      setOrders(orderItems);
      setReady(true);
    });
  }, [router]);

  function persistProducts(nextProducts: Product[]) {
    setProducts(nextProducts);
    saveManagedProducts(nextProducts);
  }

  function editProduct(product: Product) {
    setDraft({
      ...emptyProduct,
      ...product,
      category: product.category ?? "CAP",
      status: product.status ?? (product.visible === false ? "HIDDEN" : "ACTIVE"),
      displayOrder: product.displayOrder ?? 0,
      options:
        product.options && product.options.length > 0
          ? product.options
          : [{ colorName: product.color, sizeName: "FREE", stockQuantity: 0, extraPrice: 0 }]
    });
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = draft.slug || createSlug(draft.name);
    const nextProduct = { ...draft, slug, visible: draft.visible !== false };
    const savedProduct = await saveProduct(nextProduct);
    const exists = products.some((product) => product.slug === savedProduct.slug);
    const nextProducts = exists
      ? products.map((product) => (product.slug === savedProduct.slug ? savedProduct : product))
      : [savedProduct, ...products];

    persistProducts(nextProducts);
    setDraft(emptyProduct);
  }

  async function handleOrderStatusChange(orderNumber: string, status: string) {
    await updateAdminOrderStatus(orderNumber, status);
    setOrders((items) => items.map((order) => (order.orderNumber === orderNumber ? { ...order, status } : order)));
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
              Category
              <select value={draft.category ?? "CAP"} onChange={(event) => setDraft({ ...draft, category: event.target.value as ProductCategory })}>
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={draft.status ?? "ACTIVE"}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    status: event.target.value as ProductStatus,
                    visible: event.target.value === "ACTIVE"
                  })
                }
              >
                {statuses.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
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
            <label>
              Display order
              <input
                type="number"
                value={draft.displayOrder ?? 0}
                onChange={(event) => setDraft({ ...draft, displayOrder: Number(event.target.value) })}
              />
            </label>
            <label>
              Material
              <input value={draft.material ?? ""} onChange={(event) => setDraft({ ...draft, material: event.target.value })} />
            </label>
            <label className="form-wide">
              Care
              <input value={draft.care ?? ""} onChange={(event) => setDraft({ ...draft, care: event.target.value })} />
            </label>
            <label className="form-wide">
              Detail title
              <input
                value={draft.detailTitle ?? ""}
                placeholder="상세페이지 제목"
                onChange={(event) => setDraft({ ...draft, detailTitle: event.target.value })}
              />
            </label>
            <label className="form-wide">
              Detail description
              <textarea
                value={draft.detailDescription ?? ""}
                placeholder="상세페이지 설명을 입력하세요."
                onChange={(event) => setDraft({ ...draft, detailDescription: event.target.value })}
              />
            </label>
            <label className="form-wide">
              Detail images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>
                  readImages(event, (detailImages) =>
                    setDraft({
                      ...draft,
                      detailImages: [...(draft.detailImages ?? []), ...detailImages]
                    })
                  )
                }
              />
            </label>
            {draft.detailImages?.length ? (
              <div className="detail-image-admin-list form-wide">
                {draft.detailImages.map((imageUrl, index) => (
                  <figure key={`${imageUrl.slice(0, 32)}-${index}`}>
                    <img src={imageUrl} alt={`상세 이미지 ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          detailImages: draft.detailImages?.filter((_, imageIndex) => imageIndex !== index)
                        })
                      }
                    >
                      REMOVE
                    </button>
                  </figure>
                ))}
              </div>
            ) : null}
            <div className="option-admin-list form-wide">
              <div className="section-title-row compact">
                <strong>Options</strong>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      options: [...(draft.options ?? []), { colorName: draft.color, sizeName: "FREE", stockQuantity: 0, extraPrice: 0 }]
                    })
                  }
                >
                  ADD OPTION
                </button>
              </div>
              {(draft.options ?? [{ colorName: draft.color, sizeName: "FREE", stockQuantity: 0, extraPrice: 0 }]).map((option, index) => (
                <div className="option-admin-row" key={`${option.colorName ?? "option"}-${option.sizeName ?? "size"}-${index}`}>
                  <label>
                    Option color
                    <input
                      value={option.colorName ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          options: (draft.options ?? []).map((item, optionIndex) =>
                            optionIndex === index ? { ...item, colorName: event.target.value } : item
                          )
                        })
                      }
                    />
                  </label>
                  <label>
                    Size
                    <input
                      value={option.sizeName ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          options: (draft.options ?? []).map((item, optionIndex) =>
                            optionIndex === index ? { ...item, sizeName: event.target.value } : item
                          )
                        })
                      }
                    />
                  </label>
                  <label>
                    Stock
                    <input
                      type="number"
                      value={option.stockQuantity ?? 0}
                      min={0}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          options: (draft.options ?? []).map((item, optionIndex) =>
                            optionIndex === index ? { ...item, stockQuantity: Number(event.target.value) } : item
                          )
                        })
                      }
                    />
                  </label>
                  <label>
                    Extra price
                    <input
                      type="number"
                      value={option.extraPrice ?? 0}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          options: (draft.options ?? []).map((item, optionIndex) =>
                            optionIndex === index ? { ...item, extraPrice: Number(event.target.value) } : item
                          )
                        })
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        options: (draft.options ?? []).filter((_, optionIndex) => optionIndex !== index)
                      })
                    }
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                checked={draft.visible !== false}
                onChange={(event) => setDraft({ ...draft, visible: event.target.checked, status: event.target.checked ? "ACTIVE" : "HIDDEN" })}
              />
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
                  <p>
                    {product.slug} · {product.category ?? "CAP"} · {product.status ?? (product.visible === false ? "HIDDEN" : "ACTIVE")}
                  </p>
                </div>
                <button type="button" onClick={() => editProduct(product)}>
                  EDIT
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const nextProduct = {
                      ...product,
                      visible: product.visible === false,
                      status: product.visible === false ? ("ACTIVE" as const) : ("HIDDEN" as const)
                    };
                    const savedProduct = await saveProduct(nextProduct);
                    persistProducts(products.map((item) => (item.slug === product.slug ? savedProduct : item)));
                  }}
                >
                  {product.visible === false ? "SHOW" : "HIDE"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteProduct(product.slug);
                    persistProducts(products.filter((item) => item.slug !== product.slug));
                  }}
                >
                  DELETE
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="section-title-row">
            <h2>Payment Requests</h2>
            <button type="button" onClick={() => downloadOrdersCsv(orders)} disabled={orders.length === 0}>
              DOWNLOAD EXCEL
            </button>
          </div>
          <div className="admin-order-list">
            {orders.length === 0 ? (
              <p className="admin-empty">아직 결제 요청이 없습니다.</p>
            ) : (
              orders.map((order) => (
                <article className="admin-order-row" key={order.orderNumber}>
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <p>
                      {order.customerName || "Guest"} · {order.customerEmail}
                    </p>
                    <p>{order.items.map((item) => `${item.productName} / ${item.optionName} x ${item.quantity}`).join(" | ")}</p>
                  </div>
                  <div>
                    <strong>{order.totalAmount.toLocaleString("ko-KR")}원</strong>
                    <p>{new Date(order.createdAt).toLocaleString("ko-KR")}</p>
                  </div>
                  <div>
                    <p>{order.receiverPhone || "-"}</p>
                    <p>{order.shippingAddress || "-"}</p>
                    <p>
                      {order.paymentMethod ?? "MANUAL"} / {order.paymentStatus ?? "PENDING_PAYMENT"}
                    </p>
                  </div>
                  <label>
                    Status
                    <select value={order.status} onChange={(event) => handleOrderStatusChange(order.orderNumber, event.target.value)}>
                      {orderStatuses.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
