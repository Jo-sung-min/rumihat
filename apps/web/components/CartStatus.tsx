"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount, subscribeCart } from "../lib/cart-store";

export function CartStatus() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    return subscribeCart(() => setCount(getCartCount()));
  }, []);

  return <Link href="/cart">Cart({count})</Link>;
}
