import Image from "next/image";
import { prisma } from "@/lib/prisma";
import SupplementGrid from "./SupplementGrid";

export default async function SupplementsSection() {
  const supplements = await prisma.supplement.findMany({
    orderBy: { importance: "desc" },
  });
  if (supplements.length === 0) return null;
  return (
    <section className="mt-20 px-4 sm:max-w-screen-md sm:mx-auto">
      <h2 className="flex flex-col items-center font-extrabold text-xl mb-12 gap-2">
        <span className="text-base">웰니스박스의 영양제 AI 추천 서비스,</span>
        <span className="flex items-center">
          <Image
            src="/logo.png"
            alt="moa 로고"
            width={100}
            height={100}
            className="h-[1em] w-auto object-contain"
            priority
          />
          <span className="ml-2">의 영양제들을 살펴보세요.</span>
        </span>
      </h2>
      <SupplementGrid supplements={supplements} />
    </section>
  );
}
