"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Footer() {
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  return (
    <footer className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-screen-lg mx-auto px-6 pt-12 pb-4 flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="sm:pb-10">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo.png"
              alt="moa logo"
              width={100}
              height={32}
              className="object-contain mb-3"
            />
          </div>
          <p className="mt-4 text-white text-center md:text-left text-sm">
            나에게 필요한 건강만을 모아
          </p>
          <nav className="mt-3 text-white flex justify-center md:justify-start space-x-6">
            <Link
              href="https://wellnessbox-moa.vercel.app"
              className="group relative text-sm transition"
            >
              홈페이지
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link
              href="https://github.com/yeohj0710/wellnessbox-moa"
              className="group relative text-sm transition"
            >
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/pharmacist/login"
              className="group relative text-sm transition"
            >
              약사 로그인
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
            </Link>
          </nav>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
          <button
            onClick={() => setShowBusinessInfo((prev) => !prev)}
            className="cursor-pointer flex items-center text-xs font-bold text-gray-500 hover:text-gray-400 focus:outline-none"
          >
            사업자 정보
            <ChevronDownIcon
              className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                showBusinessInfo ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showBusinessInfo ? "max-h-52 mt-2" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-1 text-gray-500 text-xs text-center sm:text-right">
              <span>사업자등록번호: 795-01-03612</span>
              <span>통신판매업신고번호: 2025-서울서초-0646</span>
              <span>상호명: 웰니스박스 | 대표자: 박소현</span>
              <span>대표 전화번호: 02-6013-4400</span>
              <span>대표 이메일: smilerobert@naver.com</span>
              <span>주소: 서울특별시 서초구 반포대로19길 10 308호</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-screen-lg mx-auto px-6 py-4 text-center text-xs text-gray-500 space-y-0.5">
          <p>
            본 플랫폼은 통신판매중개자로서, 상품의 판매 당사자가 아닙니다. 구매
            관련 모든 거래는 판매자와 구매자 간에 직접 이루어지며, 당사는 중개
            역할만을 수행합니다.
          </p>
          <p>
            모든 거래에 대한 책임과 배송, 환불, 민원 등의 처리는 웰니스박스에서
            진행합니다.
          </p>
          <p className="mt-1">민원담당자: 권혁찬 02-6013-4400</p>
          <p className="mt-3 mb-3">© 2025 웰니스박스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
