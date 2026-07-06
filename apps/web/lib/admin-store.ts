import { products, type Product } from "./products";

export const ADMIN_EMAIL = "admin@rumihat.local";
export const ADMIN_PASSWORD = "admin1234";

const PRODUCT_STORAGE_KEY = "rumihat.products";
const AUTH_STORAGE_KEY = "rumihat.adminSession";
const DEFAULT_EMPTY_PRODUCTS: Product[] = [];

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

export function isAdminLoggedIn() {
  return readJson<boolean>(AUTH_STORAGE_KEY, false);
}

export function loginAdmin(email: string, password: string) {
  const accepted = email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

  if (accepted) {
    writeJson(AUTH_STORAGE_KEY, true);
  }

  return accepted;
}

export function logoutAdmin() {
  if (canUseStorage()) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
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
