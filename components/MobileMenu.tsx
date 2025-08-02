"use client";
import { useState } from "react";

export default function MobileMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-gray-700 focus:outline-none"
        aria-label="메뉴 열기"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        className={`
          fixed
          top-16
          right-0
          bottom-0
          w-40
          bg-white
          shadow-lg
          p-4
          transform
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
