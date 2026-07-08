"use client";

import { useEffect, useState } from "react";
import { fetchStoreProducts } from "../lib/admin-store";
import type { Product } from "../lib/products";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 16;

export function StoreGrid() {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStoreProducts().then(setItems);
  }, []);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <main className="store-grid" aria-label="상품 목록">
        {pageItems.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </main>
      <nav className="pagination" aria-label="페이지">
        <button type="button" onClick={() => setPage(1)} disabled={currentPage === 1}>
          «
        </button>
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>
          ‹
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) =>
          pageNumber === currentPage ? (
            <strong key={pageNumber}>{pageNumber}</strong>
          ) : (
            <button type="button" onClick={() => setPage(pageNumber)} key={pageNumber}>
              {pageNumber}
            </button>
          )
        )}
        <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount}>
          ›
        </button>
        <button type="button" onClick={() => setPage(pageCount)} disabled={currentPage === pageCount}>
          »
        </button>
      </nav>
    </>
  );
}
