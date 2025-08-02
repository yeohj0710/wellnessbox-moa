"use client";
import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import type { Supplement } from "./SupplementGrid";
import { getCart, setCart } from "@/lib/cart";

export default function SupplementModal({
  supplement,
  onClose,
}: {
  supplement: Supplement;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);

  const addToCart = () => {
    const cart = getCart();
    const existing = cart.find((i) => i.id === supplement.id);
    if (existing) existing.quantity += qty;
    else cart.push({ ...supplement, quantity: qty });
    setCart(cart);
    onClose();
  };

  useEffect(() => {
    setQty(1);
  }, [supplement]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded shadow-lg w-full max-w-sm relative mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center gap-2">
          <img
            src={supplement.imageUrl}
            alt={supplement.name}
            className="w-32 h-32 object-cover rounded"
          />
          <h2 className="text-sm font-semibold text-gray-800 truncate text-center">
            {supplement.name}
          </h2>
          <p className="mt-1 text-xs text-gray-500">{supplement.unit}</p>
          <p className="mt-1 text-sm font-semibold text-primary">
            {supplement.price.toLocaleString()}원
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <MinusIcon className="w-3 h-3 text-gray-600" />
            </button>
            <span className="w-6 text-center">{qty}</span>
            <button
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => setQty((q) => q + 1)}
            >
              <PlusIcon className="w-3 h-3 text-gray-600" />
            </button>
          </div>
          <button
            className="mt-2 w-full bg-primary hover:bg-primary/80 text-white py-2 rounded cursor-pointer text-sm font-bold"
            onClick={addToCart}
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
}
