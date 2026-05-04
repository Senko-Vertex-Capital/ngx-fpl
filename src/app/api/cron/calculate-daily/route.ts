import { prisma } from "@/lib/prisma";
import { INITIAL_CAPITAL } from "@/lib/utils/portfolio";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Authorization check (Secures the institutional interface)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Calculate Period Start Dates
    const weekStart = new Date(today);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    const targetDates = [yesterday, weekStart, monthStart, quarterStart, yearStart];

    // 2. Fetch Portfolios (with Snapshots) and Stock Prices
    const [portfolios, stocks] = await Promise.all([
      prisma.portfolio.findMany({
        include: { 
          items: true,
          weeklySnapshots: {
            where: { weekStartingDate: weekStart },
            include: { items: true }
          }
        }
      }),
      prisma.stock.findMany()
    ]);

    const stockPriceMap = new Map(stocks.map(s => [s.symbol, Number(s.currentPrice)]));

    // 3. Fetch Historical Values in Bulk
    const historicalValues = await prisma.portfolioValueHistory.findMany({
      where: {
        date: { in: targetDates }
      }
    });

    const historyMap = new Map<string, Map<number, number>>();
    historicalValues.forEach(hv => {
      if (!historyMap.has(hv.portfolioId)) {
        historyMap.set(hv.portfolioId, new Map());
      }
      historyMap.get(hv.portfolioId)!.set(hv.date.getTime(), Number(hv.totalValue));
    });

    const operations: any[] = [];

    console.time("calculate-daily");
    // 4. Process Portfolios
    for (const portfolio of portfolios) {
      try {
        const snapshot = portfolio.weeklySnapshots[0];
        
        // Calculate Current Value based on the ACTIVE snapshot for this week
        let currentValue = INITIAL_CAPITAL; // Default if no snapshot (all cash)
        
        if (snapshot) {
          let totalVal = (Number(snapshot.cashPercentage) / 100) * INITIAL_CAPITAL;
          for (const item of snapshot.items) {
            const currentPrice = stockPriceMap.get(item.stockSymbol) || 0;
            const openingPrice = Number(item.openingPrice) || currentPrice;
            const positionGain = openingPrice > 0 ? (currentPrice / openingPrice) : 1;
            totalVal += (Number(item.percentage) / 100) * INITIAL_CAPITAL * positionGain;
          }
          currentValue = totalVal;
        }

        const pHistory = historyMap.get(portfolio.id) || new Map<number, number>();
        
        const getGain = (startDate: Date) => {
          const startVal = pHistory.get(startDate.getTime()) || INITIAL_CAPITAL;
          return ((currentValue / startVal) - 1) * 100;
        };

        const dailyGain = getGain(yesterday);
        const weeklyGain = getGain(weekStart);
        const monthlyGain = getGain(monthStart);
        const quarterlyGain = getGain(quarterStart);
        const yearlyGain = getGain(yearStart);

        // --- BATCH UPDATES ---
        operations.push(
          prisma.portfolioValueHistory.upsert({
            where: { portfolioId_date: { portfolioId: portfolio.id, date: today } },
            update: { totalValue: currentValue },
            create: { portfolioId: portfolio.id, date: today, totalValue: currentValue }
          })
        );

        // --- UPDATE PORTFOLIO PERFORMANCE ---
        operations.push(
          prisma.portfolio.update({
            where: { id: portfolio.id },
            data: {
              dailyGain,
              weeklyGain,
              monthlyGain,
              quarterlyGain,
              yearlyGain,
            }
          })
        );
      } catch (err) {
        console.error(`Failed to process portfolio ${portfolio.id}:`, err);
      }
    }

    // Execute all updates in a single transaction (or chunks if needed)
    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }
    console.timeEnd("calculate-daily");

    return NextResponse.json({ 
      success: true, 
      message: `Synchronized ${portfolios.length} portfolios with geometric returns.` 
    });
  } catch (error) {
    console.error("Critical Failure in calculate-daily protocol:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

