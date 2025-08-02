"use client";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function ConsultationClient({
  consultId,
  pharmacist,
}: {
  consultId: number | null;
  pharmacist: string | null;
}) {
  const [messages, setMessages] = useState<
    { fromUser: boolean; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!consultId) return;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/consult");
      if (res.ok) {
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      }
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    })();
  }, [consultId]);

  const send = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    if (res.ok) {
      setMessages((prev) => [...prev, { fromUser: true, content: input }]);
      setInput("");
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        0
      );
    }
    setLoading(false);
  };

  const endConsult = async () => {
    if (!consultId) return;
    setEnding(true);
    try {
      await fetch("/api/consult", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultId, messages }),
      });
      window.location.href = "/";
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center p-4 border-b">
        {pharmacist ? (
          <h1 className="text-lg sm:text-xl font-bold flex-1 text-center">
            상담 약사: {pharmacist} 약사
          </h1>
        ) : (
          <div className="flex flex-col items-center w-full gap-1 sm:gap-1.5">
            <h2 className="w-full text-base sm:text-lg font-bold text-center">
              약사 상담
            </h2>
            <span className="w-full text-xs text-center text-gray-500">
              미리 채팅을 보내두시면 약사님이 답변드립니다.
            </span>
          </div>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={ending}
          className={`ml-2 w-16 sm:w-20 text-xs sm:text-sm rounded-lg transition ${
            ending
              ? "text-red-300 cursor-not-allowed"
              : "text-red-500 hover:text-red-600 cursor-pointer"
          }`}
        >
          {ending ? (
            <svg className="animate-spin h-4 w-4 mx-auto" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="3"
                fill="none"
                opacity="0.25"
              />
              <path
                d="M22 12a10 10 0 0 1-10 10"
                stroke="white"
                strokeWidth="3"
              />
            </svg>
          ) : (
            "상담 종료"
          )}
        </button>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.fromUser ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-full whitespace-pre-wrap break-keep ${
                m.fromUser ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: (props) => <p className="last:mb-0" {...props} />,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 p-4 flex gap-2 bg-white">
        <input
          className="flex-1 border p-2 px-4 rounded-full focus:outline-none focus:ring-1 ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={send}
          disabled={loading}
          className="flex items-center justify-center bg-primary hover:bg-violet-800 text-white px-4 rounded-full transition cursor-pointer disabled:opacity-60"
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
              <path
                d="M22 12a10 10 0 0 1-10 10"
                stroke="white"
                strokeWidth="4"
              />
            </svg>
          ) : (
            "전송"
          )}
        </button>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl mx-2 px-3 py-4 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">
              상담 종료 확인
            </h3>
            <p className="text-center text-gray-600 mb-6">
              종료된 상담은 복구할 수 없어요.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer px-4 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                취소
              </button>
              <button
                onClick={endConsult}
                disabled={ending}
                className={`px-4 py-1 rounded-md text-white transition ${
                  ending
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 cursor-pointer"
                }`}
              >
                {ending ? (
                  <svg
                    className="animate-spin h-4 w-4 mx-auto"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="white"
                      strokeWidth="3"
                    />
                  </svg>
                ) : (
                  "확인"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
