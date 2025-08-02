import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const pharmacist = await prisma.pharmacist.findUnique({ where: { email } });
  if (!pharmacist || !verifyPassword(password, pharmacist.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }
  if (!pharmacist.approval) {
    return NextResponse.json({ error: '승인 대기 중입니다' }, { status: 400 });
  }
  const sessionToken = createSessionToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.pharmacistSession.create({ data: { sessionToken, pharmacistId: pharmacist.id, expires } });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('pharmacist', sessionToken, { httpOnly: true, expires });
  return res;
}
