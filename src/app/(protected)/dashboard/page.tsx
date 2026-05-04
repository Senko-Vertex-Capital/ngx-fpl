/** EXECUTIVE DASHBOARD PROTOCOL v2.1 - CORE PERFORMANCE INTERFACE */
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentPortfolioValue, INITIAL_CAPITAL } from "@/lib/utils/portfolio";
import { TrendingUp, TrendingDown, Wallet, Trophy, Target, ArrowUpRight, Zap, Landmark, BarChart3, Users, Clock } from "lucide-react";
import Link from "next/link";
import { DeadlineCountdown } from "@/components/dashboard/DeadlineCountdown";
import { EquityCurve } from "@/components/dashboard/EquityCurve";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
    include: { items: true }
  });

  const currentValue = await getCurrentPortfolioValue(userId);
  const totalGainLoss = currentValue - INITIAL_CAPITAL;
  const percentageGainLoss = (totalGainLoss / INITIAL_CAPITAL) * 100;
  const isGain = totalGainLoss >= 0;

  // Calculate Rank
  const userLatestHistory = await prisma.portfolioValueHistory.findFirst({
    where: { portfolioId: portfolio?.id },
    orderBy: { date: "desc" },
  });

  let rankDisplay = "--";
  if (userLatestHistory) {
    const higherRankedCount = await prisma.portfolioValueHistory.count({
      where: {
        date: userLatestHistory.date,
        totalValue: { gt: userLatestHistory.totalValue }
      }
    });
    rankDisplay = `#${higherRankedCount + 1}`;
  }

  // Total Managers
  const totalManagers = await prisma.user.count();
  const managerDisplay = totalManagers >= 1000 
    ? `${(totalManagers / 1000).toFixed(1)}K` 
    : totalManagers.toString();

  // Today's Performance
  const todayGain = portfolio ? Number((portfolio as any).dailyGain) : 0;
  const isTodayGain = todayGain >= 0;

  // Week Logic
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  // History for Curve
  const valueHistory = await prisma.portfolioValueHistory.findMany({
    where: {
      portfolioId: portfolio?.id || "",
      date: { gte: startOfYear }
    },
    orderBy: { date: 'asc' }
  });

  const weeklyData = Array.from({ length: 52 }, (_, i) => {
    const weekNum = i + 1;
    const historyInWeek = valueHistory.filter(l => {
      const d = new Date(l.date);
      const start = new Date(d.getFullYear(), 0, 1);
      const days = (d.getTime() - start.getTime()) / 86400000;
      const w = Math.ceil((days + start.getDay() + 1) / 7);
      return w === weekNum;
    });
    if (historyInWeek.length === 0) return null;
    const lastValue = Number(historyInWeek[historyInWeek.length - 1].totalValue);
    return ((lastValue - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;
  });

  const validPoints = weeklyData
    .map((val, i) => val !== null ? { x: i * 10, y: 50 - (val * 4) } : null)
    .filter(p => p !== null) as { x: number, y: number }[];

  const linePath = validPoints.length > 0 
    ? `M ${validPoints.map(p => `${p.x},${p.y}`).join(' L ')}` 
    : '';

  const areaPath = validPoints.length > 0
    ? `${linePath} L ${validPoints[validPoints.length - 1].x},50 L ${validPoints[0].x},50 Z`
    : '';

  // Liquidity
  const cashAmount = portfolio 
    ? (Number(portfolio.cashPercentage) / 100) * INITIAL_CAPITAL 
    : INITIAL_CAPITAL;
  const cashPercentage = portfolio ? Number(portfolio.cashPercentage) : 100;

  const locale = 'en-NG';

  return (
    <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto py-4 md:py-6 overflow-x-hidden">
      {/* Optimized Executive Header */}
      <div className="bg-secondary p-6 md:p-10 border-b-8 border-gold shadow-[8px_8px_0px_#008751] md:shadow-[16px_16px_0px_#008751] relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
           <Landmark size={400} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 md:gap-12">
          {/* Brand & Identity Column */}
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 bg-gold text-background px-2 md:px-3 py-1 transform -skew-x-12">
                <Clock className="animate-pulse" size={14} />
                <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest whitespace-nowrap">FW {currentWeek}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-2 md:px-3 py-1 transform -skew-x-12">
                <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest whitespace-nowrap">Season {new Date().getFullYear()}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase italic leading-none tracking-tighter text-white mb-2 md:mb-4">
              Executive <span className="text-gold">P&L</span>
            </h1>
            <p className="text-white/60 font-bold uppercase italic tracking-wide text-xs md:text-sm">
              Fund Codename: <span className="text-white">@{session?.user?.username}</span>
            </p>
          </div>
          
          {/* Institutional Metrics Column */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4 xl:justify-end flex-1">
             <div className="w-full lg:w-auto lg:min-w-[280px]">
                <DeadlineCountdown />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 md:p-6 border-l-4 border-gold transform -skew-x-12">
                    <div className="text-[8px] md:text-[10px] font-black uppercase text-white/40 mb-1">Position</div>
                    <div className="text-2xl md:text-4xl font-black text-gold italic">{rankDisplay}</div>
                </div>
                <div className="bg-white/5 p-4 md:p-6 border-l-4 border-gold transform -skew-x-12">
                    <div className="text-[8px] md:text-[10px] font-black uppercase text-white/40 mb-1">Managers</div>
                    <div className="text-2xl md:text-4xl font-black text-white italic">{managerDisplay}</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-gold p-6 md:p-8 shadow-[6px_6px_0px_#01160e] flex flex-col justify-between h-48 md:h-64 transform transition-transform hover:-translate-y-2 text-background overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-background/60">Total Fund Value</div>
            <Landmark size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black italic tracking-tighter leading-none mb-2 break-all">
              ₦{currentValue.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[8px] md:text-[10px] font-bold text-background/60 uppercase">Institutional Base: ₦250M</div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 shadow-[6px_6px_0px_#8b5a2b] flex flex-col justify-between h-48 md:h-64 text-background transform transition-transform hover:-translate-y-2 overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">This Trading Week</div>
            {isGain ? <TrendingUp size={24} strokeWidth={3} className="text-naira" /> : <TrendingDown size={24} strokeWidth={3} className="text-action-red" />}
          </div>
          <div className="min-w-0">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter leading-none mb-2 ${isGain ? 'text-naira' : 'text-action-red'} break-all`}>
              {isGain ? '+' : ''}{percentageGainLoss.toFixed(2)}%
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-[8px] md:text-[10px] font-black uppercase ${isTodayGain ? 'text-naira' : 'text-action-red'}`}>
                 Today: {isTodayGain ? '▲' : '▼'} {Math.abs(todayGain).toFixed(2)}%
               </span>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-4 border-gold p-6 md:p-8 shadow-[6px_6px_0px_#008751] flex flex-col justify-between h-48 md:h-64 transform transition-transform hover:-translate-y-2 overflow-hidden md:col-span-2 xl:col-span-1">
          <div className="flex justify-between items-start">
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Free Liquidity</div>
            <Wallet className="text-gold" size={24} strokeWidth={3} />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-none mb-2 break-all">
              ₦{cashAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="stat-badge inline-block text-[8px] md:text-[10px] uppercase">{cashPercentage}% Cash Position</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 pb-10">
        <div className="bg-secondary border-b-8 border-gold p-6 md:p-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-6 md:mb-10 flex items-center gap-4 text-white">
            <BarChart3 size={32} className="text-gold" strokeWidth={3} />
            Fund Strategy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <Link 
              href="/dashboard/portfolio" 
              className="flex flex-col items-start p-6 md:p-8 bg-white/5 border-2 border-white/10 hover:border-gold hover:bg-gold hover:text-background transition-all group"
            >
              <ArrowUpRight size={32} className="text-gold group-hover:text-background mb-4 md:mb-6" strokeWidth={3} />
              <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Operations</div>
              <div className="text-lg md:text-xl font-black uppercase italic">Rebalance Fund</div>
            </Link>
            <Link 
              href="/rankings" 
              className="flex flex-col items-start p-6 md:p-8 bg-white/5 border-2 border-white/10 hover:border-gold hover:bg-gold hover:text-background transition-all group"
            >
              <Trophy size={32} className="text-gold group-hover:text-background mb-4 md:mb-6" strokeWidth={3} />
              <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Intelligence</div>
              <div className="text-lg md:text-xl font-black uppercase italic">Hall of Fame</div>
            </Link>
          </div>
        </div>

        <div className="bg-white text-background p-6 md:p-10 shadow-[10px_10px_0px_#052e16] md:shadow-[16px_16px_0px_#052e16]">
           <div className="flex justify-between items-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Equity Curve</h2>
              <div className="stat-badge text-[8px] md:text-[10px]">Annual Growth</div>
           </div>
           
           <div className="h-40 md:h-48 w-full relative pt-4 bg-background/[0.02] border border-background/5">
               <EquityCurve data={valueHistory.map(h => ({
                 date: new Date(h.date).toLocaleDateString(),
                 value: Number(h.totalValue),
                 fw: Math.ceil(((new Date(h.date).getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
               }))} />
            </div>
           
           <div className="mt-6 md:mt-8 flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>JAN (FW1)</span>
              <span>JUN</span>
              <span>DEC (FW52)</span>
           </div>
        </div>
      </div>
    </div>
  );
}
