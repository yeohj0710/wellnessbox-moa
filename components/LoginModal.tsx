"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      onClose();
      window.location.href = "/";
    } else setError((await res.json()).error || "Error");
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow w-full max-w-md relative mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✕
        </button>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold text-center mb-2">로그인</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            className="border p-2 rounded"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary/80 text-white p-2 rounded disabled:opacity-500 cursor-pointer"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <div className="text-center text-sm mt-1">
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 cursor-pointer"
            >
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
