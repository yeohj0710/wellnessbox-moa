"use client";
export default function LogoutButton() {
  const onClick = async () => {
    await fetch("/api/logout", { method: "POST" });
    location.reload();
  };
  return (
    <button
      onClick={onClick}
      className="inline-flex text-base font-semibold text-gray-800 hover:text-red-500 cursor-pointer"
    >
      로그아웃
    </button>
  );
}
