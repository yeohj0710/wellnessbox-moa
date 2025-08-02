"use client";
import { useState } from "react";

export default function PharmacistSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const res = await fetch("/api/pharmacist/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      setMessage("가입 신청이 접수되었습니다. 승인 대기중입니다.");
      setEmail("");
      setPassword("");
      setName("");
    } else {
      setError((await res.json()).error || "Error");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-12 w-full max-w-md mx-auto p-6 flex flex-col gap-3 bg-white rounded-lg shadow"
    >
      <h1 className="text-xl font-semibold text-center mb-2">약사 회원가입</h1>
      {message && <p className="text-green-600 text-sm">{message}</p>}
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
      <input
        className="border p-2 rounded"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        className="bg-primary text-white p-2 rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "등록 중..." : "가입 신청"}
      </button>
    </form>
  );
}
