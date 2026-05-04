import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Authorization check (Secures the institutional interface)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        items: {
          include: {
            stock: true,
          },
        },
      },
    });

    const now = new Date();
    // Use the start of the current week (Monday)
    const weekStartingDate = new Date(now);
    weekStartingDate.setHours(0, 0, 0, 0);
    // Find previous Monday if not today
    const day = weekStartingDate.getDay();
    const diff = weekStartingDate.getDate() - day + (day === 0 ? -6 : 1);
    weekStartingDate.setDate(diff);

    for (const portfolio of portfolios) {
      await prisma.$transaction(async (tx) => {
        const weeklyPortfolio = await tx.weeklyPortfolio.create({
          data: {
            portfolioId: portfolio.id,
            weekStartingDate,
            cashPercentage: portfolio.cashPercentage,
          },
        });

        if (portfolio.items.length > 0) {
          await tx.weeklyPortfolioItem.createMany({
            data: portfolio.items.map((item) => ({
              weeklyPortfolioId: weeklyPortfolio.id,
              stockSymbol: item.stockSymbol,
              percentage: item.percentage,
              openingPrice: item.stock.currentPrice,
            })),
          });
        }
      });
    }

    return NextResponse.json({ success: true, message: "Portfolios snapshotted successfully" });
  } catch (error) {
    console.error("Cron snapshot-portfolios error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
