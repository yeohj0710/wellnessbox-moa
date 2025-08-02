import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supplements = await prisma.supplement.findMany({
    where: { importance: { not: null } },
    orderBy: { importance: 'desc' },
  });
  return NextResponse.json(supplements);
}
