import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const OPENAI_URL =
  process.env.OPENAI_URL || "https://api.openai.com/v1/chat/completions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const consult = await prisma.consultation.findFirst({
    where: { userId: user.id, ended: false },
    include: {
      pharmacist: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!consult) return NextResponse.json({ messages: [] });

  const survey = await prisma.surveyAnswer.findMany({
    where: { userId: user.id },
    include: { question: true },
  });

  return NextResponse.json({
    id: consult.id,
    pharmacist: consult.pharmacist?.name || consult.pharmacist?.email || null,
    messages: consult.messages.map((m) => ({
      fromUser: m.fromUser,
      content: m.content,
    })),
    survey: survey.map((s) => ({
      question: s.question.text,
      answer: s.answer,
    })),
    recommendations: user.recommendations
      ? JSON.parse(user.recommendations)
      : null,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { message } = await req.json();
  if (!message || !message.trim())
    return NextResponse.json({ error: "Empty" }, { status: 400 });

  let consult = await prisma.consultation.findFirst({
    where: { userId: user.id, ended: false },
  });
  if (!consult) {
    consult = await prisma.consultation.create({ data: { userId: user.id } });
  }

  await prisma.consultationMessage.create({
    data: { consultationId: consult.id, fromUser: true, content: message },
  });

  return NextResponse.json({ ok: true, id: consult.id });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { consultId, messages } = await req.json();
  if (!consultId || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // 요약용 텍스트 생성
  const text = messages
    .map(
      (m: { fromUser: boolean; content: string }) =>
        `${m.fromUser ? "사용자" : "약사"}: ${m.content}`
    )
    .join("\n");

  const prompt = `다음은 사용자와 약사의 상담 내역입니다. 3문장 이내로 요약하고 개선할 점이 있다면 알려주세요.\n\n${text}`;

  // OpenAI 호출
  const resp = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  let summary = "";
  if (resp.ok) {
    const data = await resp.json();
    summary = data.choices?.[0]?.message?.content || "";
  }

  // 피드백 저장 및 상담 종료 처리
  await prisma.feedback.create({
    data: {
      userId: user.id,
      type: "consult",
      consultationId: consultId,
      summary,
    },
  });
  await prisma.consultation.update({
    where: { id: consultId },
    data: { ended: true },
  });

  return NextResponse.json({ ok: true });
}
