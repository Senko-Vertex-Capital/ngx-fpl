"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function setUsername(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const username = formData.get("username") as string;
  if (!username || username.length < 3) {
    return { error: "Username must be at least 3 characters long." };
  }

  // Check if username is already taken
  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    return { error: "This username is already taken." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });
    
    // Also create initial portfolio for the user
    await prisma.portfolio.create({
      data: {
        userId: session.user.id,
        cashPercentage: 100,
      },
    });
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/");
  redirect("/dashboard");
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // Delete the user - Prisma cascade will handle accounts, sessions, and portfolios
    await prisma.user.delete({
      where: { id: session.user.id },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return { error: "Failed to initiate data deletion protocol." };
  }
}
