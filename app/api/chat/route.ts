import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const { message, start, localSurvey, localRecommendations } =
    await req.json();

  type LocalSurveyRaw = Record<string, { value: string; text: string }>;

  const survey = user
    ? await prisma.surveyAnswer.findMany({
        where: { userId: user.id },
        include: { question: true },
      })
    : (() => {
        if (Array.isArray(localSurvey)) {
          return localSurvey.map((s: { question: string; answer: string }) => ({
            question: { text: s.question },
            answer: s.answer,
          }));
        }
        if (localSurvey && typeof localSurvey === "object") {
          const raw = localSurvey as LocalSurveyRaw;
          return Object.entries(raw).map(([key, s]) => ({
            question: { text: key },
            answer: s.value,
          }));
        }
        return [];
      })();

  let recList: string[] = [];
  if (user) {
    const u = await prisma.user.findUnique({ where: { id: user.id } });
    if (u?.recommendations) {
      try {
        recList = Array.isArray(u.recommendations)
          ? u.recommendations
          : JSON.parse(u.recommendations);
      } catch {
        recList = [];
      }
    }
  } else if (Array.isArray(localRecommendations)) {
    recList = localRecommendations;
  }

  if (start) {
    const items =
      recList.length > 0
        ? recList
        : survey.length > 0
        ? survey.map((s) => s.answer)
        : [];

    let reply: string;
    if (items.length > 0) {
      const listText = items.join(", ");
      reply = `고객님을 위해 추천된 영양제는 ${listText}이네요. 이 중에서 특히 궁금하신 제품이나, 복용 방법, 주의사항 등에 대해 궁금하신 부분이 있으신가요?`;
    } else {
      reply =
        "안녕하세요! 고객님에 대한 데이터가 아직 없네요. 나이·성별·건강 목표 등 기본 정보를 알려주시면 맞춤 추천을 도와드릴게요!";
    }

    if (user) {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          role: "assistant",
          content: reply,
        },
      });
    }

    return NextResponse.json({ reply });
  }

  const guidelinePath = path.join(process.cwd(), "public", "guidelines.txt");
  const guideline = await fs.readFile(guidelinePath, "utf8");
  const past = user
    ? await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
        take: 10,
      })
    : [];

  const surveyInfo = survey.length
    ? "사용자 검사 결과:\n" +
      survey.map((s) => `${s.question.text}: ${s.answer}`).join("\n")
    : "";
  const recInfo = recList.length ? "이전 추천 목록: " + recList.join(", ") : "";

  let additionalInstruction = "";
  if (user) {
    additionalInstruction =
      "로그인된 사용자이므로 서버에 저장된 검사 결과·설문·추천 이력을 활용해 상담을 진행하세요.";
  } else if (survey.length) {
    additionalInstruction =
      "비로그인 사용자의 로컬 설문 결과가 있으므로 해당 정보를 우선 활용하세요.";
  } else {
    additionalInstruction =
      "검사 결과가 없으므로 먼저 기본 정보(나이·성별·목표 등)를 물어보세요.";
  }

  const systemMessage = {
    role: "system",
    content: [guideline.trim(), surveyInfo, recInfo, additionalInstruction]
      .filter(Boolean)
      .join("\n\n"),
  } as const;

  const messages: { role: "system" | "assistant" | "user"; content: string }[] =
    [
      systemMessage,
      ...past.map((m) => ({
        role: m.role as "assistant" | "user",
        content: m.content,
      })),
    ];

  messages.push({
    role: "assistant",
    content: recList.length
      ? `이전에 추천된 영양제는 ${recList.join(
          ", "
        )} 입니다. 추가로 궁금하신 점이 있으신가요?`
      : survey.length
      ? `검사 결과를 바탕으로 권장되는 내용이 있습니다. 어떤 부분부터 도와드릴까요?`
      : "안녕하세요! 건강 상담을 위해 어떤 정보를 먼저 알려드리면 좋을까요?",
  });

  const userMessage = message?.trim() || "";
  messages.push({ role: "user", content: userMessage });

  const resp = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify({ model: "gpt-3.5-turbo", messages }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }
  const { choices } = await resp.json();
  const reply = choices?.[0]?.message?.content || "";

  if (user) {
    await prisma.chatMessage.createMany({
      data: [
        { userId: user.id, role: "user", content: userMessage },
        { userId: user.id, role: "assistant", content: reply },
      ],
    });
  }

  return NextResponse.json({ reply });
}
