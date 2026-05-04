"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFiscalCompetitionStatus } from "@/lib/utils/portfolio";

export async function savePortfolio(items: { stockSymbol: string; percentage: number }[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const totalPercentage = items.reduce((sum, item) => sum + item.percentage, 0);
  if (totalPercentage > 100) {
    return { error: "Total allocation cannot exceed 100%." };
  }

  const cashPercentage = 100 - totalPercentage;
  const status = getFiscalCompetitionStatus();

  try {
    await prisma.$transaction(async (tx) => {
      const portfolio = await tx.portfolio.findUnique({
        where: { userId: session.user.id },
      });

      if (!portfolio) throw new Error("Portfolio not found");

      // Delete existing items
      await tx.portfolioItem.deleteMany({
        where: { portfolioId: portfolio.id },
      });

      // Create new items
      if (items.length > 0) {
        await tx.portfolioItem.createMany({
          data: items.map((item) => ({
            portfolioId: portfolio.id,
            stockSymbol: item.stockSymbol,
            percentage: item.percentage,
          })),
        });
      }

      // Update portfolio cash percentage
      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { cashPercentage },
      });

      // Record transaction audit trail
      await tx.portfolioAudit.create({
        data: {
          portfolioId: portfolio.id,
          type: "REALLOCATION",
          description: `Strategy updated for FW${status.effectiveWeek}`,
          metadata: {
            items: items,
            cashPercentage: cashPercentage,
            fiscalStatus: status
          }
        }
      });
    });

    revalidatePath("/dashboard/portfolio");
    return { 
      success: true, 
      fiscalMetadata: {
        currentWeek: status.currentWeek,
        effectiveWeek: status.effectiveWeek,
        isAfterDeadline: status.isAfterDeadline
      }
    };
  } catch (error) {
    console.error("Save portfolio error:", error);
    return { error: "Failed to save fund strategy. Integrity check failed." };
  }
}
