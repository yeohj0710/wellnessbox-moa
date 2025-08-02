"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function PharmacistChatPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [messages, setMessages] = useState<
    { fromUser: boolean; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/pharmacist/consult", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    fetchData();
  }, [id]);

  const send = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch("/api/pharmacist/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, message: input }),
    });
    if (res.ok) {
      setMessages((prev) => [...prev, { fromUser: false, content: input }]);
      setInput("");
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        0
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto w-full bg-transparent">
      <h1 className="text-xl font-bold p-4 text-center border-b">약사 상담</h1>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.fromUser ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-3 py-2 rounded max-w-full whitespace-pre-wrap break-keep ${
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

      <div className="sticky bottom-0 bg-transparent border-t p-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded bg-white focus:outline-none focus:ring-1 ring-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-primary text-white px-4 rounded flex items-center justify-center disabled:opacity-60"
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
  );
}
