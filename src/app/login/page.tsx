import { Navbar } from "@/components/landing/Navbar";
import { signIn, auth } from "@/auth";
import { Chrome, Facebook, Trophy, Landmark } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Financial Grid */}
        <div className="absolute inset-0 stadium-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-secondary p-10 md:p-12 border-b-[8px] border-r-[8px] border-gold shadow-[16px_16px_0px_#01160e] text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold p-4 transform -skew-x-12 mb-10 shadow-[4px_4px_0px_#008751]">
              <Landmark className="text-background w-10 h-10" strokeWidth={3} />
            </div>
            
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white leading-none">
              Client <br /> <span className="text-gold">Authentication</span>
            </h1>
            <p className="text-white/60 font-bold uppercase italic mb-12 text-xs tracking-widest">
              Establish your credentials to access the ₦250M fund simulation.
            </p>

            <div className="space-y-6">
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/onboarding" });
                }}
              >
                <button
                  type="submit"
                  className="prestige-button w-full flex items-center justify-center gap-4 text-sm"
                >
                  <Chrome className="w-5 h-5" strokeWidth={3} />
                  Authorize via Google
                </button>
              </form>

              <form
                action={async () => {
                  "use server";
                  await signIn("facebook", { redirectTo: "/onboarding" });
                }}
              >
                <button
                  type="submit"
                  className="prestige-button w-full flex items-center justify-center gap-4 text-sm"
                >
                  <Facebook className="w-5 h-5 fill-current" strokeWidth={3} />
                  Authorize via Facebook
                </button>
              </form>
            </div>

            <p className="mt-16 text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">
              SECURE VIRTUAL ACCESS ONLY
            </p>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
              By initiating access, you agree to the <br />
              <Link href="/terms" className="text-gold hover:underline cursor-pointer transition-all">Protocol Terms</Link> and <Link href="/privacy" className="text-gold hover:underline cursor-pointer transition-all">Data Usage Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
