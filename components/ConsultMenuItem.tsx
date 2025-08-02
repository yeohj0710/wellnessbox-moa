"use client";
import { useState } from "react";
import ReactDOM from "react-dom";
import LoginModal from "./LoginModal";

export default function ConsultMenuItem({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loggedIn) {
      window.location.href = "/consult";
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <a
        href="/consult"
        onClick={handleClick}
        className="font-semibold text-gray-700 hover:text-primary cursor-pointer"
      >
        약사 상담
      </a>
      {open &&
        ReactDOM.createPortal(
          <LoginModal onClose={() => setOpen(false)} />,
          document.body
        )}
    </>
  );
}
