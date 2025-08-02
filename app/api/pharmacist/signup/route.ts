import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await prisma.pharmacist.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Account exists' }, { status: 400 });
  }
  const passwordHash = hashPassword(password);
  await prisma.pharmacist.create({ data: { email, name, passwordHash } });
  return NextResponse.json({ ok: true });
}
