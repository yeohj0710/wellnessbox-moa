import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!session || session.expires < new Date()) return null;
  return session.user;
}

export async function getCurrentPharmacist() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('pharmacist')?.value;
  if (!sessionToken) return null;
  const session = await prisma.pharmacistSession.findUnique({
    where: { sessionToken },
    include: { pharmacist: true },
  });
  if (!session || session.expires < new Date()) return null;
  return session.pharmacist;
}
