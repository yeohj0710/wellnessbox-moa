import { getCurrentUser } from '@/lib/session';
import ConsultationClient from './ConsultationClient';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ConsultPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="p-4 text-center space-y-2 max-w-2xl mx-auto">
        <p>로그인이 필요합니다.</p>
        <div className="space-x-3">
          <Link href="/login" className="text-primary">로그인</Link>
          <Link href="/signup" className="text-primary">회원가입</Link>
        </div>
      </div>
    );
  }
  const consult = await prisma.consultation.findFirst({
    where: { userId: user.id, ended: false },
    include: { pharmacist: true },
  });
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto w-full">
      <ConsultationClient
        consultId={consult?.id || null}
        pharmacist={consult?.pharmacist?.name || null}
      />
    </div>
  );
}
