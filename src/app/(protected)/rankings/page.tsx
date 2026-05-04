import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/landing/Navbar";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Trophy, User as UserIcon, Medal, Award } from "lucide-react";
import Link from "next/link";

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const session = await auth();
  const isAuthenticated = !!session;

  const { period = "weekly" } = await searchParams;
  
  const sortMap: Record<string, any> = {
    weekly: { weeklyGain: "desc" },
    monthly: { monthlyGain: "desc" },
    quarterly: { quarterlyGain: "desc" },
    yearly: { yearlyGain: "desc" },
  };

  const sortOrder = sortMap[period] || sortMap.weekly;

  const rankings = await prisma.portfolio.findMany({
    orderBy: sortOrder,
    take: 50,
    include: {
      user: true,
    },
  });

  const periods = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <div className={`flex min-h-screen bg-background ${!isAuthenticated ? 'flex-col' : ''}`}>
      {isAuthenticated ? <Sidebar /> : <Navbar />}
      
      <div className="flex-1 flex flex-col lg:ml-80">
        {isAuthenticated && (
          <header className="h-16 border-b-4 border-gold bg-secondary flex items-center justify-between px-8 sticky top-0 z-40 lg:hidden shadow-2xl">
             <span className="font-black text-lg tracking-tighter uppercase italic text-white">
              The Fund <span className="text-gold">Manager</span> League
            </span>
          </header>
        )}
        
        <main className={`flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-12 ${!isAuthenticated ? 'mt-8' : ''}`}>
          {/* Header Banner */}
          <div className="bg-secondary p-8 md:p-10 border-b-8 border-gold shadow-[16px_16px_0px_#008751] relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                <Award size={400} className="text-gold" />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <div className="inline-block px-3 py-1 bg-gold text-background font-black text-[10px] uppercase tracking-widest transform -skew-x-12 mb-4">
                      Executive Hall of Fame
                   </div>
                   <h1 className="text-4xl md:text-7xl font-black uppercase italic leading-none tracking-tighter text-white">
                      Alpha <span className="text-gold">Standings</span>
                   </h1>
                   <p className="text-white/60 font-bold uppercase italic mt-4 tracking-wide text-xs md:text-base">
                      Manager points are the sum of weekly performance returns.
                   </p>
                </div>
                
                {/* Filter Control Deck */}
                <div className="flex flex-col gap-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Select Time Horizon</span>
                   <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1.5 border border-white/10 rounded-sm shadow-inner">
                     {periods.map((p) => (
                       <Link
                         key={p.id}
                         href={`/rankings?period=${p.id}`}
                         className={`relative px-4 md:px-6 py-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 overflow-hidden group ${
                           period === p.id 
                             ? "text-background" 
                             : "text-white/40 hover:text-white"
                         }`}
                       >
                         {/* Sliding Background for Active State */}
                         {period === p.id && (
                           <div className="absolute inset-0 bg-gold shadow-[inset_0px_0px_12px_rgba(255,255,255,0.4)] z-0" />
                         )}
                         
                         {/* Hover State Decoration */}
                         {period !== p.id && (
                           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                         )}
                         
                         <span className="relative z-10">{p.label}</span>
                       </Link>
                     ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-secondary border-4 border-gold overflow-hidden shadow-[12px_12px_0px_#01160e] md:shadow-[20px_20px_0px_#01160e]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gold text-background text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
                    <th className="px-6 md:px-8 py-4">Rank</th>
                    <th className="px-6 md:px-8 py-4">Manager</th>
                    <th className="px-6 md:px-8 py-4 text-right">Points</th>
                    <th className="px-6 md:px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-secondary">
                  {rankings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-white/40 font-bold uppercase italic">
                         Awaiting Performance Data...
                      </td>
                    </tr>
                  ) : (
                    rankings.map((rank, index) => {
                      const points = period === "monthly" 
                          ? Number((rank as any).monthlyGain) 
                          : period === "quarterly"
                            ? Number((rank as any).quarterlyGain)
                            : period === "yearly" 
                              ? Number((rank as any).yearlyGain) 
                              : Number((rank as any).weeklyGain);
                      
                      const isGain = points >= 0;
                      const isTop3 = index < 3;
                      const isUser = session?.user?.id === rank.userId;
                      
                      return (
                        <tr key={rank.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${isUser ? 'bg-gold/5' : ''}`}>
                          <td className="px-6 md:px-8 py-4 md:py-6">
                            <div className="flex items-center gap-3">
                              <span className={`text-xl md:text-2xl font-black italic ${isTop3 ? 'text-gold' : 'text-white/20'}`}>
                                {index + 1}
                              </span>
                              {index === 0 && <Medal size={20} className="text-gold" strokeWidth={3} />}
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 md:w-10 md:h-10 border-2 flex items-center justify-center transform -skew-x-12 ${isUser ? 'bg-gold border-background' : 'bg-white/5 border-gold'}`}>
                                 <UserIcon size={18} className={isUser ? 'text-background' : 'text-gold'} strokeWidth={3} />
                              </div>
                              <div className={`font-black uppercase italic tracking-tight text-xs md:text-sm ${isUser ? 'text-gold' : 'text-white'}`}>
                                @{rank.user.username}
                                {isUser && <span className="ml-2 text-[8px] md:text-[9px] bg-gold text-background px-2 py-0.5">YOU</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                            <div className={`inline-block px-3 md:px-4 py-1 md:py-1.5 font-black text-base md:text-xl transform -skew-x-12 ${isGain ? 'bg-naira text-white' : 'bg-action-red text-white shadow-[2px_2px_0px_#37003c] md:shadow-[4px_4px_0px_#37003c]'}`}>
                               {points.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                             <div className={`text-[8px] md:text-[10px] font-black uppercase italic ${isGain ? 'text-naira' : 'text-action-red'}`}>
                                {isGain ? 'ALPHA' : 'UNDER'}
                             </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center py-10">
             <div className="inline-block px-6 py-2 border-2 border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Authorized Competition Feed
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
