import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PortfolioEditor } from "@/components/dashboard/PortfolioEditor";
import { getFiscalCompetitionStatus } from "@/lib/utils/portfolio";
import { Clock } from "lucide-react";
import { DeadlineCountdown } from "@/components/dashboard/DeadlineCountdown";

export default async function PortfolioPage() {
  const session = await auth();
  const status = getFiscalCompetitionStatus();
  
  const stocks = await prisma.stock.findMany({
    orderBy: { symbol: "asc" },
  });

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session?.user?.id },
    include: {
      items: true,
    },
  });

  const activeSnapshot = await prisma.weeklyPortfolio.findFirst({
    where: { 
      portfolioId: portfolio?.id,
      weekStartingDate: { lte: new Date() } 
    },
    include: { items: true },
    orderBy: { weekStartingDate: 'desc' }
  });

  return (
    <div className="space-y-8 md:space-y-10 max-w-7xl mx-auto py-4 md:py-6 overflow-x-hidden">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 md:gap-12 border-b-8 border-gold bg-secondary p-6 md:p-10 shadow-[8px_8px_0px_#008751] md:shadow-[16px_16px_0px_#008751] relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
           <Clock size={400} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="inline-flex items-center gap-2 bg-gold text-background px-2 md:px-3 py-1 transform -skew-x-12">
              <Clock size={10} className="animate-pulse md:w-3 md:h-3" />
              <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest text-background">FW {status.currentWeek}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-2 md:px-3 py-1 transform -skew-x-12">
              <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest">Season {new Date().getFullYear()}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase italic leading-none tracking-tighter text-white">
            Fund <span className="text-gold">Allocation</span>
          </h1>
          <p className="text-white/60 font-bold uppercase italic mt-4 tracking-wide max-w-xl leading-snug text-xs md:text-sm">
            Strategic distribution floor. Positions lock every Monday at 8:00 AM WAT for FW{status.currentWeek} competition.
          </p>
        </div>

        <div className="relative z-10 flex items-center lg:min-w-[280px]">
           <DeadlineCountdown />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary p-6 border-l-4 border-naira shadow-lg">
           <div className="text-[10px] font-black uppercase text-naira mb-2">Currently Active (FW{status.currentWeek})</div>
           <div className="flex flex-wrap gap-2">
              {activeSnapshot?.items.map(item => (
                <div key={item.id} className="bg-white/5 px-2 py-1 border border-white/10 text-[10px] font-bold text-white/60">
                   {item.stockSymbol}: {Number(item.percentage)}%
                </div>
              ))}
              {Number(activeSnapshot?.cashPercentage) > 0 && (
                <div className="bg-naira/10 px-2 py-1 border border-naira/20 text-[10px] font-bold text-naira">
                   LIQUIDITY: {Number(activeSnapshot?.cashPercentage)}%
                </div>
              )}
              {!activeSnapshot && <div className="text-[10px] text-white/20 italic">No active strategy for this week.</div>}
           </div>
        </div>

        <div className="bg-secondary p-6 border-l-4 border-gold shadow-lg">
           <div className="text-[10px] font-black uppercase text-gold mb-2">Pending Next Week (FW{status.effectiveWeek})</div>
           <p className="text-[10px] font-bold text-white/40 uppercase italic leading-tight">
             Strategy below will be snapshotted on Monday 8:00 AM WAT. Current edits affect future performance only.
           </p>
        </div>
      </div>

      <PortfolioEditor 
        stocks={JSON.parse(JSON.stringify(stocks))} 
        initialPortfolio={JSON.parse(JSON.stringify(portfolio))} 
      />
    </div>
  );
}
