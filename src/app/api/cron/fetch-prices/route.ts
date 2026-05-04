import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { scrapeNGXPrices } from "@/lib/utils/ngx-scraper";

/**
 * INSTITUTIONAL PRICE SYNCHRONIZATION PROTOCOL
 * Scheduled: Daily at 5:00 PM WAT
 * 
 * This protocol now operates with full continuity, including holidays and weekends,
 * to ensure a complete historical record. It automatically initializes new assets
 * identified on the NGX exchange floor.
 */
export async function GET(request: Request) {
  // Authorization check (Secures the institutional interface)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // 1. Fetch live market data from NGX
    const tickerMap = await scrapeNGXPrices();
    if (!tickerMap) {
      throw new Error("NGX Market Interface Unreachable");
    }

    const symbols = Object.keys(tickerMap);
    console.log(`Synchronizing market data for ${symbols.length} identifiers...`);

    // 2. Process and Upsert Asset Records
    // We use a transaction-ready approach to ensure data integrity
    const operations = symbols.map((symbol) => {
      const { price, name } = tickerMap[symbol];
      
      // We use upsert for the Stock model to auto-create missing assets
      // and update the current price for existing ones.
      return prisma.stock.upsert({
        where: { symbol },
        update: { 
          currentPrice: price,
          name: name // Keep name updated in case of corporate rebranding
        },
        create: {
          symbol,
          name,
          currentPrice: price,
          sector: "NGX Equities", // Default sector for auto-created stocks
        }
      });
    });

    // Run stock upserts first to ensure all IDs exist
    await Promise.all(operations);

    // 3. Log Daily Price History
    // We record the closing price for the target date, regardless of trading session status
    const historyOperations = symbols.map((symbol) => {
      const { price } = tickerMap[symbol];
      
      return prisma.dailyPrice.upsert({
        where: {
          stockSymbol_date: {
            stockSymbol: symbol,
            date: targetDate,
          },
        },
        update: { price },
        create: {
          stockSymbol: symbol,
          date: targetDate,
          price,
        },
      });
    });

    await Promise.all(historyOperations);

    return NextResponse.json({ 
      success: true, 
      message: `Market synchronization complete. ${symbols.length} assets processed and audited for ${targetDate.toDateString()}.` 
    });
  } catch (error) {
    console.error("Critical Failure in institutional synchronization protocol:", error);
    return NextResponse.json({ 
      error: "Institutional Interface Error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
