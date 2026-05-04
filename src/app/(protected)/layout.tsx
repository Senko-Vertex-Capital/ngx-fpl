import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Double-check user exists in DB (critical for DB wipe resilience)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true } // Optimize query
  });

  if (!user) {
    // If DB is wiped but cookie persists, we must force them out
    redirect("/login");
  }

  if (!user.username) {
    // If they haven't onboarded, force onboarding
    redirect("/onboarding");
  }

  // Pass through to the page components
  return <>{children}</>;
}
