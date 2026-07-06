export type Product = {
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  badge?: "추천" | "NEW" | "SALE";
  color: string;
  tone: string;
  accent?: string;
  imageUrl?: string;
  visible?: boolean;
};

export const products: Product[] = [
  { slug: "flower-charcoal", name: "Rumihat X Nick Gear FLOWER CHARCOAL COTTON", price: 109000, badge: "추천", color: "charcoal", tone: "#454545", accent: "#efe7cd" },
  { slug: "flower-navy", name: "Rumihat X Nick Gear FLOWER NAVY COTTON", price: 109000, badge: "NEW", color: "navy", tone: "#182337", accent: "#fff3d4" },
  { slug: "flower-beige", name: "Rumihat X Nick Gear FLOWER BEIGE COTTON", price: 109000, color: "beige", tone: "#d9bd8f", accent: "#fff8df" },
  { slug: "flower-black", name: "Rumihat X Nick Gear FLOWER BLACK COTTON", price: 109000, badge: "NEW", color: "black", tone: "#111111", accent: "#f8f3dc" },
  { slug: "washing-charcoal", name: "Rumihat .COM BALL CAP (WASHING)-CHARCOAL", price: 74000, badge: "추천", color: "washed charcoal", tone: "#34363a" },
  { slug: "non-washing-black", name: "Rumihat .COM BALL CAP (NON WASHING)-BLACK", price: 74000, color: "black", tone: "#090909" },
  { slug: "small-logo-gray", name: "Rumihat small logo twill ball cap - gray", price: 74000, salePrice: 22200, color: "gray", tone: "#59616b" },
  { slug: "small-logo-pink", name: "Rumihat small logo twill ball cap - pink", price: 74000, salePrice: 22200, color: "pink", tone: "#b66a62" },
  { slug: "small-logo-blue", name: "Rumihat small logo twill ball cap - blue", price: 74000, salePrice: 22200, badge: "추천", color: "blue", tone: "#506b91" },
  { slug: "small-logo-navy", name: "Rumihat small logo twill ball cap - navy", price: 74000, salePrice: 22200, badge: "추천", color: "navy", tone: "#111b32" },
  { slug: "light-beige", name: "Rumihat .COM BALL CAP (OG)-LIGHT BEIGE", price: 74000, color: "light beige", tone: "#d8c7aa" },
  { slug: "mint", name: "Rumihat .COM BALL CAP (OG)-MINT", price: 74000, color: "mint", tone: "#c1e8e1" },
  { slug: "light-purple", name: "Rumihat .COM BALL CAP (OG)-LIGHT PURPLE", price: 74000, color: "light purple", tone: "#e7c4df" },
  { slug: "camel-brown", name: "Rumihat .COM BALL CAP (OG)-CAMEL BROWN", price: 74000, color: "camel brown", tone: "#b36b36" },
  { slug: "corduroy-camel", name: "Rumihat X Nick Gear FLOWER CORDUROY CAMEL", price: 119000, badge: "추천", color: "camel", tone: "#a8753a", accent: "#fff5d5" },
  { slug: "corduroy-black", name: "Rumihat X Nick Gear FLOWER CORDUROY BLACK", price: 119000, color: "black corduroy", tone: "#161616", accent: "#faf4dc" }
];

export const featuredProduct = products.find((product) => product.slug === "light-purple") ?? products[0];

export const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

