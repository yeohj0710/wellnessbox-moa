import Link from "next/link";
import { getCurrentPharmacist } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function PharmacistChatsPage() {
  const pharmacist = await getCurrentPharmacist();
  if (!pharmacist) {
    return (
      <div className="p-4 text-center max-w-2xl mx-auto">
        <p>로그인이 필요합니다.</p>
        <Link href="/pharmacist/login" className="text-primary">
          로그인 페이지로
        </Link>
      </div>
    );
  }
  const consultations = await prisma.consultation.findMany({
    where: {
      OR: [{ pharmacistId: null }, { pharmacistId: pharmacist.id }],
      ended: false,
    },
    include: { user: true },
  });
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div className="p-4 max-w-2xl mx-auto w-full min-w-[20rem]">
      <h1 className="text-lg font-semibold mb-4 mt-2">상담 목록</h1>
      <ul className="space-y-3">
        {consultations.map((c) => (
          <li
            key={c.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{c.user.name || c.user.email}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
              {!c.pharmacistId ? (
                <p className="text-xs text-red-500">대기 중</p>
              ) : (
                <p className="text-xs text-yellow-500">매칭 완료</p>
              )}
            </div>
            <Link
              href={`/pharmacist/chats/${c.id}`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              대화하기
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold mt-8 mb-4">피드백 요약</h2>
      <ul className="space-y-3">
        {feedbacks.map((f) => (
          <li key={f.id} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm whitespace-pre-wrap">{f.summary}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(f.createdAt).toLocaleString()} (
              {f.type === "chat" ? "챗봇" : "상담"})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
