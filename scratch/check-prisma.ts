import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const models = Object.keys(prisma).filter(key => !key.startsWith("_") && !key.startsWith("$"));
  console.log("Generated Models:", models);
  
  // Check Portfolio fields via metadata if possible, or just try to access it
  try {
     console.log("Checking Portfolio fields...");
     // @ts-ignore
     const p = await prisma.portfolio.findFirst();
     console.log("Sample Portfolio:", p);
  } catch (e) {
     console.error("Error accessing portfolio:", e);
  }
}

main();
