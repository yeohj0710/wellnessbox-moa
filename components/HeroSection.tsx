"use client";
import { useState } from "react";
import Link from "next/link";
import LoginModal from "./LoginModal";

export default function HeroSection({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const handleConsult = () => {
    if (loggedIn) window.location.href = "/consult";
    else setOpen(true);
  };

  const base =
    "cursor-pointer text-center font-bold w-56 sm:w-64 py-2 rounded-full text-sm " +
    "bg-white text-[#5441bb] shadow-lg " +
    "transition-transform duration-300 ease-in-out transform " +
    "hover:shadow-2xl " +
    "hover:bg-[#5441bb] hover:text-white";
  const items = [
    {
      key: "survey",
      label: "나에게 맞는 영양제 추천받기",
      href: "/survey",
      extra: "mt-[40vh]",
    },
    {
      key: "chat",
      label: "친절한 AI 상담사와 대화하기",
      href: "/chat",
      extra: "mt-2",
    },
    {
      key: "consult",
      label: "약사님에게 영양제 상담받기",
      onClick: handleConsult,
      extra: "mt-2",
    },
  ];

  return (
    <section
      className="w-full sm:max-w-screen-md sm:mx-auto h-[70vh] sm:h-[80vh] bg-no-repeat bg-center bg-cover sm:bg-auto flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/moa_1.svg')" }}
    >
      {items.map(({ key, label, href, onClick, extra }) =>
        href ? (
          <Link key={key} href={href} className={`${base} ${extra}`}>
            {label}
          </Link>
        ) : (
          <button key={key} onClick={onClick} className={`${base} ${extra}`}>
            {label}
          </button>
        )
      )}
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </section>
  );
}
