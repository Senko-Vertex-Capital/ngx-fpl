import { prisma } from "@/lib/prisma";

export const INITIAL_CAPITAL = 250000000;

/**
 * Calculates the current fiscal week and the week the portfolio will take effect.
 * Portfolios lock on Mondays at 8:00 AM WAT (UTC+1).
 */
export function getFiscalCompetitionStatus() {
  // We standardize on UTC but calculate the offset for WAT (UTC+1)
  const now = new Date();
  const watOffset = 1 * 60 * 60 * 1000; // 1 hour in ms
  const watNow = new Date(now.getTime() + watOffset);
  
  // Calculate current week of the year based on WAT
  const startOfYear = new Date(watNow.getFullYear(), 0, 1);
  const pastDaysOfYear = (watNow.getTime() - startOfYear.getTime()) / 86400000;
  const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  // Find this Monday at 8:00 AM WAT
  const deadline = new Date(now);
  const day = deadline.getUTCDay(); // Using UTC day to calculate Monday
  // Monday is 1. If today is Sunday (0), we need -6. 
  const diff = deadline.getUTCDate() - day + (day === 0 ? -6 : 1);
  deadline.setUTCDate(diff);
  deadline.setUTCHours(7, 0, 0, 0); // 7:00 AM UTC = 8:00 AM WAT

  const isAfterDeadline = now > deadline;
  const effectiveWeek = isAfterDeadline ? currentWeek + 1 : currentWeek;

  return {
    currentWeek,
    effectiveWeek,
    isAfterDeadline,
    deadlineISO: deadline.toISOString()
  };
}

export async function getCurrentPortfolioValue(userId: string) {
  const now = new Date();
  const weekStartingDate = new Date(now);
  weekStartingDate.setHours(0, 0, 0, 0);
  const day = weekStartingDate.getDay();
  const diff = weekStartingDate.getDate() - day + (day === 0 ? -6 : 1);
  weekStartingDate.setDate(diff);

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
  });

  if (!portfolio) return INITIAL_CAPITAL;

  const weeklySnapshot = await prisma.weeklyPortfolio.findUnique({
    where: {
      portfolioId_weekStartingDate: {
        portfolioId: portfolio.id,
        weekStartingDate,
      },
    },
    include: {
      items: true,
    },
  });

  if (!weeklySnapshot) {
    return INITIAL_CAPITAL;
  }

  let totalValue = 0;
  for (const item of weeklySnapshot.items) {
    const stock = await prisma.stock.findUnique({
      where: { symbol: item.stockSymbol },
    });
    if (!stock) continue;

    const investmentAmount = (Number(item.percentage) / 100) * INITIAL_CAPITAL;
    const currentPositionValue = investmentAmount * (Number(stock.currentPrice) / Number(item.openingPrice));
    totalValue += currentPositionValue;
  }

  const cashAmount = (Number(weeklySnapshot.cashPercentage) / 100) * INITIAL_CAPITAL;
  totalValue += cashAmount;

  return totalValue;
}
