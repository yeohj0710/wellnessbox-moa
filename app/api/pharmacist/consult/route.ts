import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentPharmacist } from '@/lib/session';

export async function GET() {
  const pharmacist = await getCurrentPharmacist();
  if (!pharmacist) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const consultations = await prisma.consultation.findMany({
    where: {
      OR: [
        { pharmacistId: null },
        { pharmacistId: pharmacist.id },
      ],
      ended: false,
    },
    include: { user: true },
  });
  return NextResponse.json({
    consultations: consultations.map((c) => ({ id: c.id, user: c.user.name || c.user.email, pharmacistId: c.pharmacistId })),
  });
}

export async function POST(req: NextRequest) {
  const pharmacist = await getCurrentPharmacist();
  if (!pharmacist) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, message } = await req.json();
  const consultation = await prisma.consultation.findUnique({ where: { id } });
  if (!consultation || consultation.ended) {
    return NextResponse.json({ error: 'Invalid consultation' }, { status: 400 });
  }
  if (!consultation.pharmacistId) {
    await prisma.consultation.update({ where: { id }, data: { pharmacistId: pharmacist.id } });
  } else if (consultation.pharmacistId !== pharmacist.id) {
    return NextResponse.json({ error: 'Already taken' }, { status: 400 });
  }
  await prisma.consultationMessage.create({
    data: { consultationId: id, fromUser: false, content: message },
  });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const pharmacist = await getCurrentPharmacist();
  if (!pharmacist) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const consult = await prisma.consultation.findFirst({
    where: { id, OR: [{ pharmacistId: null }, { pharmacistId: pharmacist.id }] },
    include: { messages: { orderBy: { createdAt: 'asc' } }, user: true, pharmacist: true },
  });
  if (!consult) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    id: consult.id,
    user: consult.user.name || consult.user.email,
    pharmacist: consult.pharmacist ? consult.pharmacist.name || consult.pharmacist.email : null,
    messages: consult.messages.map((m) => ({ fromUser: m.fromUser, content: m.content })),
  });
}
