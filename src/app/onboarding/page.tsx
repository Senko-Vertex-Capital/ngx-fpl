import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { UsernameForm } from "@/components/auth/UsernameForm";
import { prisma } from "@/lib/prisma";
import { Landmark } from "lucide-react";
import Link from "next/link";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  if (user.username) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Financial Grid */}
        <div className="absolute inset-0 stadium-grid opacity-20" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-secondary p-10 md:p-12 border-b-[8px] border-r-[8px] border-gold shadow-[16px_16px_0px_#01160e] text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold p-4 transform -skew-x-12 mb-10 shadow-[4px_4px_0px_#008751]">
              <Landmark className="text-background w-10 h-10" strokeWidth={3} />
            </div>
            
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white leading-none">
              Final <br /> <span className="text-gold">Protocol</span>
            </h1>
            <p className="text-white/60 font-bold uppercase italic mb-10 text-xs tracking-widest">
              Choose your principal manager identity for the national leaderboard.
            </p>

            <UsernameForm />

            <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">
              UNIQUE IDENTITY MANDATORY
            </p>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
              By setting your identity, you reaffirm acceptance of the <br />
              <Link href="/terms" className="text-gold hover:underline cursor-pointer transition-all">Terms of Play</Link> and <Link href="/privacy" className="text-gold hover:underline cursor-pointer transition-all">Data Usage Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
