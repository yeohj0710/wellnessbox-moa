"use client";
import { useEffect, useState } from "react";
import { CartItem, getCart, setCart } from "@/lib/cart";

export default function CartModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showPay, setShowPay] = useState(false);
  useEffect(() => {
    const load = () => setItems(getCart());
    load();
    window.addEventListener("cartchange", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("cartchange", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const update = (id: number, delta: number) => {
    const arr = items
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
      .filter((i) => i.quantity > 0);
    setItems(arr);
    setCart(arr);
  };

  const remove = (id: number) => {
    const arr = items.filter((i) => i.id !== id);
    setItems(arr);
    setCart(arr);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">장바구니</h2>
        {items.length === 0 ? (
          <p className="text-sm">장바구니가 비어있습니다.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between items-center">
                <span className="text-sm">{i.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                    onClick={() => update(i.id, -1)}
                  >
                    -
                  </button>
                  <span>{i.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                    onClick={() => update(i.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                    onClick={() => remove(i.id)}
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between items-center mt-4 border-t pt-4">
          <span className="font-semibold">총 {total.toLocaleString()}원</span>
          <button
            onClick={() => setShowPay(true)}
            className="text-sm bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded cursor-pointer"
          >
            결제하기
          </button>
        </div>
        {showPay && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowPay(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative mx-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPay(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
              <p className="text-center font-semibold">
                결제 기능은 준비 중입니다.
              </p>
              <p className="text-center text-sm mt-2">Coming soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
