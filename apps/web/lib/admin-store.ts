import { products, type Product } from "./products";

const PRODUCT_STORAGE_KEY = "rumihat.products";
const AUTH_STORAGE_KEY = "rumihat.adminSession";
const AUTH_TOKEN_STORAGE_KEY = "rumihat.adminToken";
const AUTH_PROFILE_STORAGE_KEY = "rumihat.adminProfile";
const DEFAULT_EMPTY_PRODUCTS: Product[] = [];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getManagedProducts() {
  return readJson<Product[]>(PRODUCT_STORAGE_KEY, DEFAULT_EMPTY_PRODUCTS).filter((product) => product.visible !== false);
}

export function getAdminProducts() {
  return readJson<Product[]>(PRODUCT_STORAGE_KEY, DEFAULT_EMPTY_PRODUCTS);
}

export function getStoreProducts() {
  const managedProducts = getManagedProducts();
  return managedProducts.length > 0 ? managedProducts : [products[0]];
}

export function getDetailProducts() {
  const managedProducts = getAdminProducts();
  return managedProducts.length > 0 ? managedProducts : [products[0]];
}

export function saveManagedProducts(nextProducts: Product[]) {
  writeJson(PRODUCT_STORAGE_KEY, nextProducts);
}

function normalizeApiProduct(product: Product & { colorName?: string }) {
  const detailImages =
    product.detailImages ??
    product.images
      ?.filter((image) => image.imageType !== "primary")
      .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
      .map((image) => image.url);
  const primaryImage = product.imageUrl ?? product.images?.find((image) => image.imageType === "primary")?.url;

  return {
    ...product,
    category: product.category ?? "CAP",
    status: product.status ?? (product.visible === false ? "HIDDEN" : "ACTIVE"),
    color: product.color ?? product.colorName ?? "black",
    imageUrl: primaryImage,
    detailImages,
    displayOrder: product.displayOrder ?? 0,
    options:
      product.options && product.options.length > 0
        ? product.options
        : [{ colorName: product.color ?? product.colorName ?? "black", sizeName: "FREE", stockQuantity: 0, extraPrice: 0 }]
  };
}

export async function fetchAdminProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const apiProducts = (await response.json()) as Array<Product & { colorName?: string }>;
    const normalizedProducts = apiProducts.map(normalizeApiProduct);
    saveManagedProducts(normalizedProducts);
    return normalizedProducts;
  } catch {
    return getAdminProducts();
  }
}

export async function fetchStoreProducts() {
  const apiProducts = await fetchAdminProducts();
  const visibleProducts = apiProducts.filter((product) => product.visible !== false && (product.status ?? "ACTIVE") === "ACTIVE");
  return visibleProducts.length > 0 ? visibleProducts : [products[0]];
}

export async function saveProduct(product: Product) {
  const nextProduct = { ...product, visible: product.visible !== false };

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${nextProduct.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...nextProduct,
        colorName: nextProduct.color,
        status: nextProduct.status ?? (nextProduct.visible === false ? "HIDDEN" : "ACTIVE"),
        displayOrder: nextProduct.displayOrder ?? 0,
        images: [
          ...(nextProduct.imageUrl ? [{ url: nextProduct.imageUrl, alt: nextProduct.name, imageType: "primary", sortOrder: 0 }] : []),
          ...(nextProduct.detailImages ?? []).map((url, index) => ({
            url,
            alt: `${nextProduct.name} detail ${index + 1}`,
            imageType: "detail",
            sortOrder: index + 1
          }))
        ],
        options:
          nextProduct.options && nextProduct.options.length > 0
            ? nextProduct.options
            : [{ colorName: nextProduct.color, sizeName: "FREE", stockQuantity: 0, extraPrice: 0 }]
      })
    });

    if (!response.ok) {
      throw new Error("Failed to save product");
    }

    const savedProduct = normalizeApiProduct((await response.json()) as Product & { colorName?: string });
    const localProducts = getAdminProducts();
    const exists = localProducts.some((item) => item.slug === savedProduct.slug);
    saveManagedProducts(exists ? localProducts.map((item) => (item.slug === savedProduct.slug ? savedProduct : item)) : [savedProduct, ...localProducts]);
    return savedProduct;
  } catch {
    const localProducts = getAdminProducts();
    const exists = localProducts.some((item) => item.slug === nextProduct.slug);
    saveManagedProducts(exists ? localProducts.map((item) => (item.slug === nextProduct.slug ? nextProduct : item)) : [nextProduct, ...localProducts]);
    return nextProduct;
  }
}

export async function deleteProduct(slug: string) {
  try {
    await fetch(`${API_BASE_URL}/api/products/${slug}`, { method: "DELETE" });
  } catch {
  }

  saveManagedProducts(getAdminProducts().filter((product) => product.slug !== slug));
}

export function isAdminLoggedIn() {
  return readJson<boolean>(AUTH_STORAGE_KEY, false) || Boolean(canUseStorage() && window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email.trim(), password })
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { token?: string };
  saveAdminSession(result.token ?? "password-login", "password", email.trim());
  return true;
}

export function getOAuthLoginUrl(provider: "google" | "kakao") {
  return `${API_BASE_URL}/oauth2/authorization/${provider}`;
}

export function saveAdminSession(token: string, provider = "password", email = "") {
  writeJson(AUTH_STORAGE_KEY, true);

  if (canUseStorage()) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    window.localStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify({ provider, email }));
  }
}

export function logoutAdmin() {
  if (canUseStorage()) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
  }
}

export function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
