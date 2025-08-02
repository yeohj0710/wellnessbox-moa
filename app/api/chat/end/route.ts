import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const { messages } = await request.json();
  const text = (messages as { role: string; content: string }[])
    .map((m) => `${m.role === "user" ? "사용자" : "AI"}: ${m.content}`)
    .join("\n");
  const prompt = `다음은 사용자와 AI의 상담 내역입니다. 3문장 이내로 요약하고, 대화를 기반으로 현재의 영양제 추천 알고리즘에서 개선할 사항을 짧게 정리하세요.

${text}`;

  const resp = await fetch(
    process.env.OPENAI_URL || "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  let summary = "";
  if (resp.ok) {
    const data = await resp.json();
    summary = data.choices?.[0]?.message?.content || "";
  }

  await prisma.feedback.create({
    data: {
      userId: user?.id ?? null,
      type: "chat",
      summary,
    },
  });

  return NextResponse.json({ ok: true });
}
