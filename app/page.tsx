import { getCurrentUser } from "@/lib/session";
import HeroSection from "@/components/HeroSection";
import SupplementsSection from "@/components/SupplementsSection";
import OpenExternalInKakao from "@/components/OpenExternalInKakao";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <>
      <OpenExternalInKakao path="/" />
      <HeroSection loggedIn={Boolean(user)} />
      <SupplementsSection />
    </>
  );
}
