"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PharmacistLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const res = await fetch("/api/pharmacist/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) router.push("/pharmacist/chats");
    else setError((await res.json()).error || "Error");
  };

  return (
    <form
      onSubmit={submit}
      className="mt-12 w-full max-w-md mx-auto p-6 flex flex-col gap-3 bg-white rounded-lg shadow"
    >
      <h1 className="text-xl font-semibold text-center mb-2">약사 로그인</h1>
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
        className="bg-primary text-white p-2 rounded flex items-center justify-center disabled:opacity-60 cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              strokeWidth="4"
              fill="none"
              opacity="0.25"
            />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="4" />
          </svg>
        ) : (
          "로그인"
        )}
      </button>
      <p className="text-sm text-center mt-1">
        계정이 없으신가요?{" "}
        <a
          href="/pharmacist/signup"
          className="text-primary hover:text-primary/80"
        >
          회원가입
        </a>
      </p>
    </form>
  );
}
