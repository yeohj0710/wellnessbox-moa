import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('session')?.value;
  if (sessionToken) {
    await prisma.session.deleteMany({ where: { sessionToken } });
  }
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('session', '', { expires: new Date(0) });
  return res;
}
