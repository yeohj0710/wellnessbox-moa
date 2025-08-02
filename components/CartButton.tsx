"use client";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";
import { getCart } from "@/lib/cart";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () =>
      setCount(getCart().reduce((sum, i) => sum + i.quantity, 0));
    update();
    window.addEventListener("cartchange", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartchange", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 text-gray-700 hover:text-primary cursor-pointer"
        aria-label="장바구니"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 0 0 6.53 17h10.94a1 1 0 0 0 .88-.53L21 13M7 13l1 5m10-5l-1 5M6 21h12"
          />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {count}
          </span>
        )}
      </button>
      {open && <CartModal onClose={() => setOpen(false)} />}
    </>
  );
}
