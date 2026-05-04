import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5433/ngxfpl?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const INITIAL_CAPITAL = 250000000;

async function main() {
  const stocksData = [
    { symbol: "ABBEYBDS", name: "Abbey Mortgage Bank Plc", price: 6.60 },
    { symbol: "ABCTRANS", name: "ABC Transport Plc", price: 6.24 },
    { symbol: "ACADEMY", name: "Academy Press Plc", price: 7.00 },
    { symbol: "ACCESSCORP", name: "Access Holdings Plc", price: 29.95 },
    { symbol: "AFRINSURE", name: "African Alliance Insurance Plc", price: 0.20 },
    { symbol: "AFRIPRUD", name: "Africa Prudential Plc", price: 14.00 },
    { symbol: "AFROMEDIA", name: "Afromedia Plc", price: 0.24 },
    { symbol: "AIICO", name: "AIICO Insurance Plc", price: 4.13 },
    { symbol: "AIRTELAFRI", name: "Airtel Africa Plc", price: 2746.70 },
    { symbol: "ALEX", name: "Aluminum Extrusion Ind. Plc", price: 10.55 },
    { symbol: "ARADEL", name: "Aradel Holdings Plc", price: 1679.90 },
    { symbol: "AUSTINLAZ", name: "Austin Laz & Company Plc", price: 3.60 },
    { symbol: "AVAIF", name: "AVA Infrastructure Fund", price: 1000000.00 },
    { symbol: "BAPLC", name: "B.A.P. Plc", price: 6.25 },
    { symbol: "BERGER", name: "Berger Paints Plc", price: 68.35 },
    { symbol: "BETAGLAS", name: "Beta Glass Plc", price: 498.50 },
    { symbol: "BUACEMENT", name: "BUA Cement Plc", price: 317.00 },
    { symbol: "BUAFOODS", name: "BUA Foods Plc", price: 824.60 },
    { symbol: "CADBURY", name: "Cadbury Nigeria Plc", price: 72.00 },
    { symbol: "CAP", name: "CAP Plc", price: 100.00 },
    { symbol: "CAVERTON", name: "Caverton Offshore Support Group Plc", price: 5.20 },
    { symbol: "CHAMPION", name: "Champion Breweries Plc", price: 14.50 },
    { symbol: "CHAMS", name: "Chams Holding Company Plc", price: 3.35 },
    { symbol: "CHELLARAM", name: "Chellarams Plc", price: 13.20 },
    { symbol: "CILEASING", name: "C & I Leasing Plc", price: 6.50 },
    { symbol: "CNIF", name: "Capital Nav. Fund", price: 110.00 },
    { symbol: "CONHALLPLC", name: "Consolidated Hallmark Insurance Plc", price: 4.67 },
    { symbol: "CONOIL", name: "Conoil Plc", price: 194.00 },
    { symbol: "CORNERST", name: "Cornerstone Insurance Plc", price: 5.60 },
    { symbol: "CUSTODIAN", name: "Custodian Investment Plc", price: 74.20 },
    { symbol: "CUTIX", name: "Cutix Plc", price: 3.36 },
    { symbol: "CWG", name: "CWG Plc", price: 21.95 },
    { symbol: "DAARCOMM", name: "Daar Communications Plc", price: 1.76 },
    { symbol: "DANGCEM", name: "Dangote Cement Plc", price: 850.00 },
    { symbol: "DANGSUGAR", name: "Dangote Sugar Refinery Plc", price: 66.20 },
    { symbol: "DEAPCAP", name: "Deap Capital Management & Trust Plc", price: 4.70 },
    { symbol: "EKOCORP", name: "Ekocorp Plc", price: 5.80 },
    { symbol: "ELLAHLAKES", name: "Ellah Lakes Plc", price: 10.20 },
    { symbol: "ENAMELWA", name: "Nigerian Enamelware Plc", price: 37.00 },
    { symbol: "ETERNA", name: "Eterna Plc", price: 33.50 },
    { symbol: "ETI", name: "Ecobank Transnational Incorporated", price: 71.70 },
    { symbol: "ETRANZACT", name: "eTranzact International Plc", price: 18.00 },
    { symbol: "EUNISELL", name: "Eunisell Interlinked Plc", price: 169.95 },
    { symbol: "FCMB", name: "FCMB Group Plc", price: 13.50 },
    { symbol: "FIDELITYBK", name: "Fidelity Bank Plc", price: 21.85 },
    { symbol: "FIDSON", name: "Fidson Healthcare Plc", price: 100.00 },
    { symbol: "FIRSTHOLDCO", name: "First Holdings Co.", price: 71.00 },
    { symbol: "FTGINSURE", name: "FTG Insurance", price: 1.39 },
    { symbol: "FTNCOCOA", name: "FTN Cocoa Processors Plc", price: 5.20 },
    { symbol: "GEREGU", name: "Geregu Power Plc", price: 1132.50 },
    { symbol: "GOLDBREW", name: "Golden Guinea Breweries Plc", price: 7.10 },
    { symbol: "GTCO", name: "Guaranty Trust Holding Company Plc", price: 130.00 },
    { symbol: "GUINEAINS", name: "Guinea Insurance Plc", price: 1.06 },
    { symbol: "GUINNESS", name: "Guinness Nigeria Plc", price: 497.00 },
    { symbol: "HMCALL", name: "H.M. Call", price: 3.85 },
    { symbol: "HONYFLOUR", name: "Honeywell Flour Mill Plc", price: 18.95 },
    { symbol: "IKEJAHOTEL", name: "Ikeja Hotel Plc", price: 33.00 },
    { symbol: "IMG", name: "Industrial & Medical Gases Nig. Plc", price: 36.00 },
    { symbol: "INFINITY", name: "Infinity Trust Mortgage Bank Plc", price: 9.35 },
    { symbol: "INTBREW", name: "International Breweries Plc", price: 14.05 },
    { symbol: "INTENEGINS", name: "International Energy Insurance Plc", price: 2.92 },
    { symbol: "JAIZBANK", name: "Jaiz Bank Plc", price: 9.00 },
    { symbol: "JAPAULGOLD", name: "Japaul Gold & Ventures Plc", price: 3.13 },
    { symbol: "JBERGER", name: "Julius Berger Nigeria Plc", price: 288.00 },
    { symbol: "JOHNHOLT", name: "John Holt Plc", price: 14.00 },
    { symbol: "JULI", name: "Juli Plc", price: 7.25 },
    { symbol: "LASACO", name: "Lasaco Assurance Plc", price: 2.00 },
    { symbol: "LEARNAFRCA", name: "Learn Africa Plc", price: 9.30 },
    { symbol: "LEGENDINT", name: "Legendary Investments Plc", price: 5.63 },
    { symbol: "LINKASSURE", name: "Linkage Assurance Plc", price: 1.48 },
    { symbol: "LIVESTOCK", name: "Livestock Feeds Plc", price: 6.55 },
    { symbol: "LIVINGTRUST", name: "Living Trust Mortgage Bank Plc", price: 3.69 },
    { symbol: "MANSARD", name: "AXA Mansard Insurance Plc", price: 14.50 },
    { symbol: "MAYBAKER", name: "May & Baker Nigeria Plc", price: 38.00 },
    { symbol: "MBENEFIT", name: "Mutual Benefits Assurance Plc", price: 4.00 },
    { symbol: "MCNICHOLS", name: "McNichols Consolidated Plc", price: 7.50 },
    { symbol: "MECURE", name: "MeCure Industries Plc", price: 60.60 },
    { symbol: "MEYER", name: "Meyer Plc", price: 18.65 },
    { symbol: "MOFIREIF", name: "Mofire REIT", price: 100.00 },
    { symbol: "MORISON", name: "Morison Industries Plc", price: 11.79 },
    { symbol: "MTNN", name: "MTN Nigeria Communications Plc", price: 820.50 },
    { symbol: "MULTITREX", name: "Multi-Trex Integrated Foods Plc", price: 0.36 },
    { symbol: "MULTIVERSE", name: "Multiverse Mining and Exploration Plc", price: 23.80 },
    { symbol: "NAHCO", name: "Nigerian Aviation Handling Company Plc", price: 242.00 },
    { symbol: "NASCON", name: "NASCON Allied Industries Plc", price: 171.60 },
    { symbol: "NB", name: "Nigerian Breweries Plc", price: 73.00 },
    { symbol: "NCR", name: "NCR (Nigeria) Plc", price: 199.00 },
    { symbol: "NEIMETH", name: "Neimeth International Pharmaceuticals Plc", price: 10.00 },
    { symbol: "NEM", name: "NEM Insurance Plc", price: 32.45 },
    { symbol: "NESTLE", name: "Nestle Nigeria Plc", price: 3249.90 },
    { symbol: "NGXGROUP", name: "Nigerian Exchange Group Plc", price: 164.50 },
    { symbol: "NIDF", name: "NIDF Plc", price: 127.00 },
    { symbol: "NNFM", name: "Northern Nigeria Flour Mills Plc", price: 79.40 },
    { symbol: "NPFMCRFBK", name: "NPF Microfinance Bank Plc", price: 5.45 },
    { symbol: "NREIT", name: "Nigerian Real Estate Inv. Trust", price: 103.00 },
    { symbol: "NSLTECH", name: "NSL Tech Plc", price: 0.94 },
    { symbol: "OANDO", name: "Oando Plc", price: 45.30 },
    { symbol: "OKOMUOIL", name: "Okomu Oil Palm Plc", price: 1765.00 },
    { symbol: "OMATEK", name: "Omatek Ventures Plc", price: 2.01 },
    { symbol: "PHARMDEKO", name: "Pharm-Deko Plc", price: 1.83 },
    { symbol: "PREMPAINTS", name: "Premier Paints Plc", price: 37.50 },
    { symbol: "PRESCO", name: "Presco Plc", price: 1980.00 },
    { symbol: "PRESTIGE", name: "Prestige Assurance Plc", price: 1.37 },
    { symbol: "PZ", name: "PZ Cussons Nigeria Plc", price: 78.50 },
    { symbol: "REDSTAREX", name: "Red Star Express Plc", price: 28.15 },
    { symbol: "REGALINS", name: "Regency Alliance Insurance Plc", price: 1.02 },
    { symbol: "RONCHESS", name: "Ronchess Global Resources Plc", price: 81.00 },
    { symbol: "ROYALEX", name: "Royal Exchange Plc", price: 1.70 },
    { symbol: "RTBRISCOE", name: "R.T. Briscoe (Nigeria) Plc", price: 9.16 },
    { symbol: "SCOA", name: "SCOA Nigeria Plc", price: 22.65 },
    { symbol: "SEPLAT", name: "Seplat Energy Plc", price: 10450.00 },
    { symbol: "SFSREIT", name: "SFS Real Estate Investment Trust", price: 418.75 },
    { symbol: "SKYAVN", name: "Skyway Aviation Handling Company Plc", price: 143.10 },
    { symbol: "SOVRENINS", name: "Sovereign Trust Insurance Plc", price: 1.89 },
    { symbol: "STACO", name: "Staco Insurance Plc", price: 0.48 },
    { symbol: "STANBIC", name: "Stanbic IBTC Holdings Plc", price: 154.50 },
    { symbol: "STERLINGNG", name: "Sterling Financial Holdings Plc", price: 8.10 },
    { symbol: "SUNUASSUR", name: "Sunu Assurances Nigeria Plc", price: 4.70 },
    { symbol: "TANTALIZER", name: "Tantalizers Plc", price: 3.68 },
    { symbol: "THOMASWY", name: "Thomas Wyatt Nigeria Plc", price: 2.75 },
    { symbol: "TIP", name: "The Industrial General Insurance Plc", price: 20.45 },
    { symbol: "TOTAL", name: "TotalEnergies Marketing Nigeria Plc", price: 640.00 },
    { symbol: "TRANSCOHOT", name: "Transcorp Hotels Plc", price: 203.00 },
    { symbol: "TRANSCORP", name: "Transnational Corporation Plc", price: 49.00 },
    { symbol: "TRANSEXPR", name: "Trans-Nationwide Express Plc", price: 7.20 },
    { symbol: "TRANSPOWER", name: "Transcorp Power Plc", price: 272.70 },
    { symbol: "TRIPPLEG", name: "Tripple Gee and Company Plc", price: 4.26 },
    { symbol: "UACN", name: "UAC of Nigeria Plc", price: 110.00 },
    { symbol: "UBA", name: "United Bank for Africa Plc", price: 50.20 },
    { symbol: "UCAP", name: "United Capital Plc", price: 16.15 },
    { symbol: "UHOMREIT", name: "Union Homes REIT", price: 72.50 },
    { symbol: "UNILEVER", name: "Unilever Nigeria Plc", price: 110.00 },
    { symbol: "UNIONDICON", name: "Union Dicon Salt Plc", price: 19.95 },
    { symbol: "UNITYBNK", name: "Unity Bank Plc", price: 1.51 },
    { symbol: "UNIVINSURE", name: "Universal Insurance Plc", price: 1.22 },
    { symbol: "UPDC", name: "UPDC Plc", price: 4.20 },
    { symbol: "UPDCREIT", name: "UPDC Real Estate Investment Trust", price: 7.60 },
    { symbol: "UPL", name: "University Press Plc", price: 5.20 },
    { symbol: "VERITASKAP", name: "Veritas Kapital Assurance Plc", price: 1.85 },
    { symbol: "VFDGROUP", name: "VFD Group Plc", price: 10.65 },
    { symbol: "VITAFOAM", name: "Vitafoam Nigeria Plc", price: 130.00 },
    { symbol: "WAPCO", name: "Lafarge Africa Plc", price: 273.00 },
    { symbol: "WAPIC", name: "Coronation Insurance Plc", price: 2.73 },
    { symbol: "WEMABANK", name: "Wema Bank Plc", price: 28.10 },
    { symbol: "ZENITHBANK", name: "Zenith Bank Plc", price: 127.00 },
    { symbol: "ZICHIS", name: "Zichis Plc", price: 12.90 },
  ];

  const usernames = ["AlphaFund", "BetaCapital", "GammaWealth", "DeltaEquity", "EpsilonAsset", "ZetaFinance", "EtaInvest", "ThetaMarket", "IotaGrowth", "NairaAlpha"];
  
  // 1. Create Stocks
  console.log("Upserting stocks...");
  for (const s of stocksData) {
    await prisma.stock.upsert({
      where: { symbol: s.symbol },
      update: { name: s.name, currentPrice: s.price },
      create: { symbol: s.symbol, name: s.name, currentPrice: s.price },
    });
  }

  // 2. Create Users & Initial Portfolios
  console.log("Seeding users...");
  const users = [];
  users.push(await prisma.user.upsert({
    where: { id: "cmo91x5uj0000grv549q550mi" },
    update: { username: "TheBigWolf" },
    create: { id: "cmo91x5uj0000grv549q550mi", username: "TheBigWolf" }
  }));

  for (let i = 0; i < 9; i++) {
    users.push(await prisma.user.upsert({
      where: { username: usernames[i] },
      update: {},
      create: { username: usernames[i] }
    }));
  }

  const portfolios = [];
  for (const user of users) {
    portfolios.push(await prisma.portfolio.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, cashPercentage: 100 }
    }));
  }

  // 3. Historical Simulation Loop
  const startDate = new Date("2026-01-01");
  const today = new Date("2026-04-21"); 
  
  console.log(`Simulating additive market protocol from ${startDate.toDateString()} to ${today.toLocaleDateString()}...`);
  
  let currentDate = new Date(startDate);
  const stockPriceHistory: Record<string, number> = {};
  stocksData.forEach(s => stockPriceHistory[s.symbol] = s.price);

  const portfolioStats: Record<string, { finishedWeeksReturns: number[], currentWeekDailyReturns: number[] }> = {};
  portfolios.forEach(p => portfolioStats[p.id] = { finishedWeeksReturns: [], currentWeekDailyReturns: [] });

  while (currentDate <= today) {
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const isMonday = currentDate.getDay() === 1;
    const isFriday = currentDate.getDay() === 5;

    if (!isWeekend) {
      for (const symbol in stockPriceHistory) {
        const volatility = 0.015; 
        const change = 1 + (Math.random() * (volatility * 2) - volatility); 
        stockPriceHistory[symbol] *= change;
        
        await prisma.dailyPrice.upsert({
          where: { stockSymbol_date: { stockSymbol: symbol, date: currentDate } },
          update: { price: stockPriceHistory[symbol] },
          create: { stockSymbol: symbol, date: currentDate, price: stockPriceHistory[symbol] }
        });
      }
    }

    if (isMonday) {
      for (const portfolio of portfolios) {
        const weekStart = new Date(currentDate);
        weekStart.setHours(0,0,0,0);
        
        const wp = await prisma.weeklyPortfolio.upsert({
          where: { portfolioId_weekStartingDate: { portfolioId: portfolio.id, weekStartingDate: weekStart } },
          update: {},
          create: {
            portfolioId: portfolio.id,
            weekStartingDate: weekStart,
            cashPercentage: 20
          }
        });

        const shuffled = [...stocksData].sort(() => 0.5 - Math.random()).slice(0, 5);
        for (const s of shuffled) {
          await prisma.weeklyPortfolioItem.upsert({
            where: { weeklyPortfolioId_stockSymbol: { weeklyPortfolioId: wp.id, stockSymbol: s.symbol } },
            update: { openingPrice: stockPriceHistory[s.symbol] },
            create: {
              weeklyPortfolioId: wp.id,
              stockSymbol: s.symbol,
              percentage: 16,
              openingPrice: stockPriceHistory[s.symbol]
            }
          });
        }
        
        portfolioStats[portfolio.id].currentWeekDailyReturns = [];
      }
    }

    if (!isWeekend) {
      for (const portfolio of portfolios) {
        const weekStart = new Date(currentDate);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        weekStart.setHours(0,0,0,0);

        const wp = await prisma.weeklyPortfolio.findUnique({
          where: { portfolioId_weekStartingDate: { portfolioId: portfolio.id, weekStartingDate: weekStart } },
          include: { items: true }
        });

        if (wp) {
          let totalValue = (Number(wp.cashPercentage) / 100) * INITIAL_CAPITAL;
          for (const item of wp.items) {
            totalValue += (Number(item.percentage) / 100) * INITIAL_CAPITAL * (stockPriceHistory[item.stockSymbol] / Number(item.openingPrice));
          }

          const yesterday = new Date(currentDate);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayHistory = await prisma.portfolioValueHistory.findUnique({
             where: { portfolioId_date: { portfolioId: portfolio.id, date: yesterday } }
          });
          
          const yesterdayValue = yesterdayHistory ? Number(yesterdayHistory.totalValue) : INITIAL_CAPITAL;
          const dailyGain = ((totalValue - yesterdayValue) / yesterdayValue) * 100;
          portfolioStats[portfolio.id].currentWeekDailyReturns.push(dailyGain);

          await prisma.portfolioValueHistory.upsert({
            where: { portfolioId_date: { portfolioId: portfolio.id, date: currentDate } },
            update: { totalValue },
            create: { portfolioId: portfolio.id, date: currentDate, totalValue }
          });

          if (isFriday) {
             const weeklySum = portfolioStats[portfolio.id].currentWeekDailyReturns.reduce((a, b) => a + b, 0);
             portfolioStats[portfolio.id].finishedWeeksReturns.push(weeklySum);
          }

          if (currentDate.getTime() === today.getTime()) {
             const currentWeekPoints = portfolioStats[portfolio.id].currentWeekDailyReturns.reduce((a, b) => a + b, 0);
             
             const currentMonth = today.getMonth();
             const finishedWeeksThisMonth = portfolioStats[portfolio.id].finishedWeeksReturns.slice(-4); // simplified
             const monthlyPoints = finishedWeeksThisMonth.reduce((a, b) => a + b, 0) + currentWeekPoints;

             const currentQuarter = Math.floor(currentMonth / 3);
             const finishedWeeksThisQuarter = portfolioStats[portfolio.id].finishedWeeksReturns.slice(-(currentMonth % 3 * 4 + 4)); // very rough approximation for seed
             const quarterlyPoints = finishedWeeksThisQuarter.reduce((a, b) => a + b, 0) + currentWeekPoints;
             
             const yearlyPoints = portfolioStats[portfolio.id].finishedWeeksReturns.reduce((a, b) => a + b, 0) + currentWeekPoints;

             await prisma.portfolio.update({
               where: { id: portfolio.id },
               data: { 
                 dailyGain: dailyGain, 
                 weeklyGain: currentWeekPoints, 
                 monthlyGain: monthlyPoints, 
                 quarterlyGain: quarterlyPoints,
                 yearlyGain: yearlyPoints 
               }
             });
          }
        }
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("Historical Multi-Period Additive Simulation Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
