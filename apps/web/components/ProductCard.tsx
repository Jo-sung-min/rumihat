import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "../lib/products";
import { formatWon } from "../lib/products";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  const href = product.slug === "light-purple" ? "/products/light-purple" : `/products/${product.slug}`;

  return (
    <article className="product-card">
      <button className="wish-button" aria-label="위시리스트에 추가">
        <Heart size={24} strokeWidth={1.5} />
      </button>
      <Link href={href} className="product-image-link" aria-label={`${product.name} 상세 보기`}>
        {product.imageUrl ? (
          <img className="managed-product-image" src={product.imageUrl} alt={product.name} />
        ) : (
          <ProductVisual
            tone={product.tone}
            accent={product.accent}
            logo={product.name.includes("small logo") ? "sebs" : "com"}
            flower={product.name.includes("FLOWER")}
          />
        )}
      </Link>
      <div className="product-meta">
        <Link href={href}>{product.name}</Link>
        <div className="product-badges">
          {product.badge ? <span>{product.badge}</span> : null}
          {product.salePrice ? <strong>SALE</strong> : null}
        </div>
        <p className="product-price">
          {product.salePrice ? <del>{formatWon(product.price)}</del> : null}
          <span>{formatWon(product.salePrice ?? product.price)}</span>
        </p>
      </div>
    </article>
  );
}
