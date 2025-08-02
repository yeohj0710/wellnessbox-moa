"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usedSuggestions, setUsedSuggestions] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ending, setEnding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const DEFAULT_SUGGESTIONS = [
    "추천받은 각 영양제에 대해 설명해줘",
    "내 진단 결과로 다른 영양제 추천해줘",
    "추천받은 영양제의 주의사항 있어?",
  ];

  useEffect(() => {
    setSuggestions(
      DEFAULT_SUGGESTIONS.filter((s) => !usedSuggestions.includes(s))
    );
  }, [usedSuggestions]);

  const animateReply = (index: number, text: string) => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setMessages((prev) => {
        const arr = [...prev];
        arr[index] = { role: "assistant", content: text.slice(0, i) };
        return arr;
      });
      if (i >= text.length) clearInterval(timer);
    }, 20);
  };

  const send = async (msg?: string, start = false) => {
    const text = msg ?? input;
    if (!text.trim() && !start) return;
    if (DEFAULT_SUGGESTIONS.includes(text)) {
      setUsedSuggestions((prev) => Array.from(new Set([...prev, text])));
    }
    setLoading(true);
    const newMsgs = [...messages];
    if (!start) newMsgs.push({ role: "user", content: text });
    newMsgs.push({ role: "assistant", content: "" });
    const index = newMsgs.length - 1;
    setMessages(newMsgs);
    if (!start) setInput("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
    const localSurvey = !loggedIn
      ? JSON.parse(localStorage.getItem("surveyAnswers") || "null")
      : undefined;
    const localRecs = !loggedIn
      ? JSON.parse(localStorage.getItem("recommendedSupplements") || "null")
      : undefined;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        start,
        localSurvey,
        localRecommendations: localRecs,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const cleaned = data.reply
        .replace(/(\r\n|\r|\n){3,}/g, "\n\n")
        .replace(/\r/g, "\n");
      animateReply(index, cleaned);
    }
    setLoading(false);
  };

  const endConsult = async () => {
    setEnding(true);
    try {
      const res = await fetch("/api/chat/end", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        alert("상담 종료에 실패했습니다.");
      }
    } finally {
      setShowConfirm(false);
      setEnding(false);
    }
  };

  useEffect(() => {
    if (initialized) return;
    (async () => {
      const res = await fetch("/api/survey");
      if (res.ok) {
        const data = await res.json();
        setLoggedIn(data.loggedIn);
      }
      send("", true);
      setInitialized(true);
    })();
  }, [initialized]);

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg sm:text-xl font-bold flex-1 text-center">
          건강기능식품 상담 AI 모아
        </h1>
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
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-full whitespace-pre-wrap break-keep ${
                m.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      p: (props) => <p className="last:mb-0" {...props} />,
                    }}
                  >
                    {m.content.replace(/\n{2,}/g, "\n")}
                  </ReactMarkdown>
                ) : (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                )
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: (props) => <p className="last:mb-0" {...props} />,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-white">
        {!loading && suggestions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-4 pt-2 bg-white no-scrollbar">
            {suggestions.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSuggestions((prev) => prev.filter((s) => s !== t));
                  send(t);
                }}
                className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 text-sm whitespace-nowrap cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <div className="p-4 flex gap-2">
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
            onClick={() => send()}
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
