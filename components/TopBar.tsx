import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import MobileMenu from "./MobileMenu";
import CartButton from "./CartButton";
import ConsultMenuItem from "./ConsultMenuItem";

export default async function TopBar() {
  const user = await getCurrentUser();

  const MenuItems = () => (
    <>
      <Link
        href="/survey"
        className="font-semibold text-gray-700 hover:text-primary"
      >
        자가진단
      </Link>
      <Link
        href="/chat"
        className="font-semibold text-gray-700 hover:text-primary"
      >
        AI 상담
      </Link>
      <ConsultMenuItem loggedIn={Boolean(user)} />
      {user ? (
        <LogoutButton />
      ) : (
        <Link
          href="/login"
          className="text-base font-semibold text-gray-700 hover:text-primary"
        >
          로그인
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 sm:px-0 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="block transform transition-transform duration-200 hover:scale-110"
        >
          <Image
            src="/logo.png"
            alt="moa 로고"
            width={72}
            height={32}
            priority
            className="filter transition duration-200 hover:brightness-110"
          />
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <MenuItems />
          <CartButton />
        </div>
        <div className="flex md:hidden items-center gap-2">
          <CartButton />
          <MobileMenu>
            <MenuItems />
          </MobileMenu>
        </div>
      </div>
    </nav>
  );
}
