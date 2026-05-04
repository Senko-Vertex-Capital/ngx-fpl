import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Settings, User as UserIcon, ShieldCheck, Mail, Fingerprint, Database, Info } from "lucide-react";
import { ResignButton } from "@/components/auth/ResignButton";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const manager = session.user;
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: manager?.id || "" }
  });

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6">
      {/* Header Banner */}
      <div className="bg-secondary p-10 border-b-8 border-gold shadow-[16px_16px_0px_#008751] relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
           <Settings size={400} className="text-gold" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold text-background px-3 py-1 transform -skew-x-12 mb-4">
            <Fingerprint size={12} />
            <span className="font-black text-[10px] uppercase tracking-widest text-background">Account Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-tighter text-white">
            Manager <span className="text-gold">Settings</span>
          </h1>
          <p className="text-white/60 font-bold uppercase italic mt-4 tracking-wide max-w-xl">
            Control your institutional credentials and data footprint within the League.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Identity Card */}
         <div className="bg-secondary border-4 border-white/5 p-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
               <div className="w-12 h-12 bg-gold/10 border-2 border-gold flex items-center justify-center transform -skew-x-12">
                  <UserIcon className="text-gold" size={24} strokeWidth={3} />
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase text-gold">Manager Identity</div>
                  <div className="text-2xl font-black italic text-white uppercase">@{manager?.username}</div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <Mail className="text-white/20 shrink-0" size={20} />
                  <div>
                     <div className="text-[10px] font-black uppercase text-white/40 mb-1">Authorized Email</div>
                     <div className="text-sm font-bold text-white/80">{manager?.email}</div>
                  </div>
               </div>

               {/* New Performance Summary in Settings */}
               <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Lifetime Intelligence</div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 p-4 border-l-2 border-gold">
                        <div className="text-[8px] font-black text-white/40 uppercase mb-1">Daily P&L</div>
                        <div className={`text-lg font-black italic ${Number(portfolio?.dailyGain) >= 0 ? 'text-naira' : 'text-action-red'}`}>
                           {Number(portfolio?.dailyGain) >= 0 ? '+' : ''}{Number(portfolio?.dailyGain || 0).toFixed(2)}%
                        </div>
                     </div>
                     <div className="bg-white/5 p-4 border-l-2 border-gold">
                        <div className="text-[8px] font-black text-white/40 uppercase mb-1">Monthly P&L</div>
                        <div className={`text-lg font-black italic ${Number(portfolio?.monthlyGain) >= 0 ? 'text-naira' : 'text-action-red'}`}>
                           {Number(portfolio?.monthlyGain) >= 0 ? '+' : ''}{Number(portfolio?.monthlyGain || 0).toFixed(2)}%
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Security & Support */}
         <div className="space-y-8">
            <div className="bg-white/5 border-2 border-white/5 p-8 flex flex-col justify-center gap-4">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="text-naira" size={20} strokeWidth={3} />
                  <span className="text-xs font-black uppercase italic text-white/90">Protocol Status: Secure</span>
               </div>
               <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed">
                  Your session is verified via encrypted institutional providers. No password management required.
               </p>
            </div>

            <div className="bg-secondary border-l-8 border-gold p-8 space-y-4">
               <div className="flex items-center gap-3">
                  <Database className="text-gold" size={20} strokeWidth={3} />
                  <span className="text-xs font-black uppercase italic text-white">Data Retention</span>
               </div>
               <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed">
                  We store only your performance history and fund settings. All data is localized to the Nigerian Simulation cluster.
               </p>
            </div>
         </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-12 border-t-2 border-white/5">
         <div className="mb-8 flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-action-red/20" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-action-red italic">Termination Protocols</div>
            <div className="h-[2px] flex-1 bg-action-red/20" />
         </div>
         
         <div className="max-w-2xl mx-auto">
            <ResignButton />
            <div className="mt-6 flex items-start gap-4 p-4 bg-white/5 border border-white/10">
               <Info className="text-white/20 shrink-0" size={16} />
               <p className="text-[9px] font-bold text-white/30 uppercase leading-relaxed">
                  Notice: Resigning will initiate an immediate purge of your manager profile from our ledgers. This action fulfills the &quot;Right to be Forgotten&quot; clause in our Privacy Protocol.
               </p>
            </div>
         </div>
      </div>

      <div className="text-center py-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authorized Security Interface • The Fund Manager League</p>
      </div>
    </div>
  );
}
