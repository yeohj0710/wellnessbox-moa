import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { answers, recommendations } = await req.json();
  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  for (const a of answers) {
    if (!a.question || !a.answer) continue;
    let q = await prisma.surveyQuestion.findFirst({ where: { text: a.question as string } });
    if (!q) {
      q = await prisma.surveyQuestion.create({ data: { text: a.question as string } });
    }
    const existing = await prisma.surveyAnswer.findFirst({
      where: { userId: user.id, questionId: q.id },
    });
    if (existing) {
      await prisma.surveyAnswer.update({
        where: { id: existing.id },
        data: { answer: a.answer as string },
      });
    } else {
      await prisma.surveyAnswer.create({
        data: {
          userId: user.id,
          questionId: q.id,
          answer: a.answer as string,
        },
      });
    }
  }

  if (Array.isArray(recommendations)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { recommendations: JSON.stringify(recommendations) },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ hasSurvey: false, loggedIn: false });
  }
  const count = await prisma.surveyAnswer.count({ where: { userId: user.id } });
  return NextResponse.json({
    hasSurvey: count > 0,
    loggedIn: true,
    name: user.name,
    recommendations: user.recommendations
      ? JSON.parse(user.recommendations)
      : null,
  });
}
