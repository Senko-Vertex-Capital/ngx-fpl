import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { History, TrendingUp, TrendingDown, ArrowUpRight, Landmark, CalendarDays, Percent } from "lucide-react";
import { INITIAL_CAPITAL } from "@/lib/utils/portfolio";

export default async function PerformanceHistoryPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  if (!session) redirect("/login");

  // Fetch all weekly snapshots for the manager
  const snapshots = await prisma.weeklyPortfolio.findMany({
    where: {
      portfolio: { userId }
    },
    include: {
      items: true,
      portfolio: true
    },
    orderBy: { weekStartingDate: 'desc' }
  });

  const audits = await prisma.portfolioAudit.findMany({
    where: { portfolio: { userId } },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Map each week to its historical value at the end of that week
  const historyData = await Promise.all(snapshots.map(async (snapshot) => {
    const weekEndDate = new Date(snapshot.weekStartingDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6); // Approximation of week end

    // Find the closest value history entry for this week
    const lastValueInWeek = await prisma.portfolioValueHistory.findFirst({
      where: {
        portfolioId: snapshot.portfolioId,
        date: {
          gte: snapshot.weekStartingDate,
          lte: weekEndDate
        }
      },
      orderBy: { date: 'desc' }
    });

    // Calculate Fiscal Week Number
    const startOfYear = new Date(snapshot.weekStartingDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (snapshot.weekStartingDate.getTime() - startOfYear.getTime()) / 86400000;
    const fw = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

    // Calculate yield for that week relative to Initial Capital
    const currentValue = lastValueInWeek ? Number(lastValueInWeek.totalValue) : INITIAL_CAPITAL;
    const yieldPercentage = ((currentValue - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;

    return {
      snapshot,
      yieldPercentage,
      fiscalWeek: fw
    };
  }));

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-6">
      {/* Header Banner */}
      <div className="bg-secondary p-10 border-b-8 border-gold shadow-[16px_16px_0px_#008751] relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
           <History size={400} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold text-background px-3 py-1 transform -skew-x-12 mb-4">
            <CalendarDays size={12} />
            <span className="font-black text-[10px] uppercase tracking-widest text-background">Audit Log</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-tighter text-white">
            Performance <span className="text-gold">History</span>
          </h1>
          <p className="text-white/60 font-bold uppercase italic mt-4 tracking-wide max-w-xl">
            Verified record of your fund&apos;s weekly allocations and market returns for the current fiscal cycle.
          </p>
        </div>
      </div>

      {historyData.length === 0 ? (
        <div className="bg-white/5 border-4 border-dashed border-white/10 p-20 text-center">
           <div className="text-white/20 font-black uppercase italic text-2xl">No Fiscal Records Found</div>
           <p className="text-white/40 font-bold uppercase text-xs mt-2">Historical data appears after your first week in the league.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {historyData.map((item, idx) => {
            const isGain = item.yieldPercentage >= 0;
            const yieldVal = item.yieldPercentage;
            
            return (
              <div key={item.snapshot.id} className="bg-secondary border-4 border-white/5 overflow-hidden group hover:border-gold/50 transition-all shadow-xl">
                 <div className="grid lg:grid-cols-4 items-stretch">
                    {/* Week Identity */}
                    <div className="p-8 bg-background border-r-2 border-white/5 flex flex-col justify-center">
                       <div className="text-[10px] font-black uppercase text-gold mb-1">Fiscal Cycle</div>
                       <div className="text-4xl font-black italic text-white uppercase">FW{item.fiscalWeek}</div>
                       <div className="text-[10px] font-bold text-white/40 uppercase mt-2">
                          Start: {item.snapshot.weekStartingDate.toLocaleDateString()}
                       </div>
                    </div>

                    {/* Yield Display */}
                    <div className="p-8 bg-white/5 border-r-2 border-white/5 flex flex-col justify-center">
                       <div className="text-[10px] font-black uppercase text-white/40 mb-2">Weekly Yield</div>
                       <div className={`text-4xl font-black italic ${isGain ? 'text-naira' : 'text-action-red'}`}>
                          {isGain ? '+' : ''}{yieldVal.toFixed(2)}%
                       </div>
                       <div className="text-[10px] font-bold text-white/20 uppercase mt-2 flex items-center gap-2">
                          <Percent size={10} />
                          Return on Initial Capital
                       </div>
                    </div>

                    {/* Allocation Summary */}
                    <div className="p-8 lg:col-span-2 relative overflow-hidden">
                       <div className="text-[10px] font-black uppercase text-white/40 mb-4 flex justify-between">
                          <span>Portfolio Distribution</span>
                          <span className="text-gold">{100 - Number(item.snapshot.cashPercentage)}% Exposure</span>
                       </div>
                       
                       <div className="flex flex-wrap gap-2">
                          {item.snapshot.items.map((stock) => (
                             <div key={stock.stockSymbol} className="bg-white/5 border border-white/10 px-3 py-1.5 flex items-center gap-3">
                                <span className="text-[10px] font-black text-gold uppercase">{stock.stockSymbol}</span>
                                <span className="text-[10px] font-bold text-white/60">{Number(stock.percentage)}%</span>
                             </div>
                          ))}
                          {Number(item.snapshot.cashPercentage) > 0 && (
                            <div className="bg-naira/10 border border-naira/20 px-3 py-1.5 flex items-center gap-3">
                               <span className="text-[10px] font-black text-naira uppercase">LIQUIDITY</span>
                               <span className="text-[10px] font-bold text-naira/60">{Number(item.snapshot.cashPercentage)}%</span>
                            </div>
                          )}
                       </div>

                       <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <ArrowUpRight size={80} />
                       </div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Strategy Timeline (Audit Log) */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Landmark className="text-gold" size={24} />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Strategy <span className="text-gold">Timeline</span></h2>
        </div>

        <div className="relative pl-8 border-l-2 border-white/10 space-y-12 py-4">
          {audits.map((audit: any) => (
            <div key={audit.id} className="relative">
              {/* Dot */}
              <div className="absolute -left-[41px] top-0 w-4 h-4 bg-background border-2 border-gold transform rotate-45 shadow-[2px_2px_0px_#008751]" />
              
              <div className="bg-secondary p-6 border border-white/5 hover:border-gold/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[8px] font-black uppercase text-gold tracking-widest">{audit.type}</div>
                    <div className="text-sm font-bold text-white uppercase italic">{audit.description}</div>
                  </div>
                  <div className="text-[10px] font-mono text-white/40">{new Date(audit.createdAt).toLocaleString()}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(audit.metadata as any)?.items?.map((item: any) => (
                    <div key={item.stockSymbol} className="text-[9px] font-black text-white/60 bg-white/5 px-2 py-0.5 border border-white/10">
                      {item.stockSymbol}: {item.percentage}%
                    </div>
                  ))}
                  <div className="text-[9px] font-black text-naira bg-naira/10 px-2 py-0.5 border border-naira/20">
                    CASH: {(audit.metadata as any)?.cashPercentage}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-10 border-t-2 border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authorized Performance Record • Verified by The Fund Manager League</p>
      </div>
    </div>
  );
}
