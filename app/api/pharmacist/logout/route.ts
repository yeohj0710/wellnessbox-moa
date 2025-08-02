import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('pharmacist')?.value;
  if (sessionToken) {
    await prisma.pharmacistSession.deleteMany({ where: { sessionToken } });
  }
  const res = NextResponse.redirect(new URL('/pharmacist/login', req.url));
  res.cookies.set('pharmacist', '', { expires: new Date(0) });
  return res;
}
