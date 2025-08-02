import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }
  const passwordHash = hashPassword(password);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  const sessionToken = createSessionToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { sessionToken, userId: user.id, expires } });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', sessionToken, { httpOnly: true, expires });
  return res;
}
