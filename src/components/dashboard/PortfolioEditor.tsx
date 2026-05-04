"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Save, Loader2, AlertCircle, TrendingUp, Info, ChevronRight, Coins, Landmark, Gavel, Search, Wallet, CheckCircle2, ShieldAlert, X, Timer } from "lucide-react";
import { savePortfolio } from "@/actions/portfolio";
import { motion, AnimatePresence } from "framer-motion";

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
}

interface PortfolioItem {
  stockSymbol: string;
  percentage: number;
}

interface Portfolio {
  id: string;
  cashPercentage: number;
  items: PortfolioItem[];
}

const INITIAL_CAPITAL = 250000000;

export function PortfolioEditor({ 
  stocks, 
  initialPortfolio 
}: { 
  stocks: Stock[]; 
  initialPortfolio: Portfolio | null 
}) {
  const [items, setItems] = useState<PortfolioItem[]>(
    initialPortfolio?.items.map(item => ({
      stockSymbol: item.stockSymbol,
      percentage: Number(item.percentage)
    })) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    currentWeek: number;
    effectiveWeek: number;
    isAfterDeadline: boolean;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const totalAllocated = useMemo(() => {
    return items.reduce((sum, item) => sum + item.percentage, 0);
  }, [items]);

  const cashPercentage = 100 - totalAllocated;
  const cashAmount = (cashPercentage / 100) * INITIAL_CAPITAL;
  const exposureAmount = (totalAllocated / 100) * INITIAL_CAPITAL;

  const filteredStocks = useMemo(() => {
    const selectedSymbols = new Set(items.map(i => i.stockSymbol));
    const unselected = stocks.filter(s => !selectedSymbols.has(s.symbol));
    
    if (!searchQuery) return unselected;
    
    const query = searchQuery.toLowerCase();
    return unselected.filter(s => 
      s.symbol.toLowerCase().includes(query) || 
      s.name.toLowerCase().includes(query)
    );
  }, [stocks, items, searchQuery]);

  function addItem(symbol: string) {
    if (totalAllocated >= 100) return;
    setItems([...items, { stockSymbol: symbol, percentage: 0 }]);
    setSearchQuery("");
  }

  function removeItem(symbol: string) {
    setItems(items.filter(i => i.stockSymbol !== symbol));
  }

  function updatePercentage(symbol: string, value: number) {
    const otherAllocated = totalAllocated - (items.find(i => i.stockSymbol === symbol)?.percentage || 0);
    const maxAllowed = 100 - otherAllocated;
    const clampedValue = Math.min(Math.max(0, value), maxAllowed);
    
    setItems(items.map(i => 
      i.stockSymbol === symbol ? { ...i, percentage: clampedValue } : i
    ));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const result = await savePortfolio(items);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // @ts-ignore
        setSuccessData(result.fiscalMetadata);
      }
    } catch (err) {
      setError("Critical market interface failure.");
    } finally {
      setLoading(false);
    }
  }

  const locale = 'en-NG';

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start relative pb-20 overflow-x-hidden">
      {/* Persistent Executive Feedback Overlay */}
      <AnimatePresence>
        {successData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-md"
          >
            <div className="bg-secondary border-4 border-gold p-6 md:p-10 max-w-lg w-full shadow-[20px_20px_0px_#01160e] text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <Landmark size={200} />
               </div>
               
               <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-naira rounded-full mb-6 md:mb-8 shadow-2xl border-4 border-gold">
                    <CheckCircle2 className="text-white" size={40} strokeWidth={3} />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">Strategy Locked</h2>
                  <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-8 md:mb-10">Fund Allocation Protocol Complete</div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 md:mb-10 text-left">
                     <div className="bg-white/5 p-4 md:p-5 border-l-4 border-white/20">
                        <div className="text-[8px] md:text-[9px] font-black uppercase text-white/40 mb-1">Fiscal Week</div>
                        <div className="text-2xl md:text-3xl font-black text-white italic">FW{successData.currentWeek}</div>
                     </div>
                     <div className="bg-gold/10 p-4 md:p-5 border-l-4 border-gold">
                        <div className="text-[8px] md:text-[9px] font-black uppercase text-gold/60 mb-1">Effective Week</div>
                        <div className="text-2xl md:text-3xl font-black text-gold italic">FW{successData.effectiveWeek}</div>
                     </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 md:p-5 bg-white/5 border border-white/10 text-left mb-8 md:mb-10">
                     <Timer className="text-gold shrink-0 mt-1" size={20} strokeWidth={3} />
                     <div>
                        <p className="text-xs md:text-sm font-black uppercase italic text-white/90">
                           {successData.isAfterDeadline 
                             ? "Deadline passed for this cycle." 
                             : "Eligible for immediate competition."
                           }
                        </p>
                        <p className="text-[9px] md:text-[10px] font-bold uppercase text-white/40 mt-1">
                           {successData.isAfterDeadline 
                             ? "Starts next Monday." 
                             : "Active for current market cycle."
                           }
                        </p>
                     </div>
                  </div>

                  <button 
                    onClick={() => setSuccessData(null)}
                    className="prestige-button w-full text-lg md:text-xl"
                  >
                    Acknowledge
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-md"
          >
            <div className="bg-background border-4 border-action-red p-6 md:p-10 max-w-lg w-full shadow-[20px_20px_0px_#01160e] text-center relative overflow-hidden">
               <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-action-red rounded-full mb-6 md:mb-8 shadow-2xl border-4 border-white">
                    <ShieldAlert className="text-white" size={40} strokeWidth={3} />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">Protocol Error</h2>
                  <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-action-red mb-8 md:mb-10 italic">Intervention Required</div>
                  
                  <div className="p-4 md:p-6 bg-action-red/10 border-2 border-action-red/20 text-left mb-8 md:mb-10">
                     <p className="text-xs md:text-sm font-black uppercase italic text-action-red leading-relaxed">
                        {error}
                     </p>
                  </div>

                  <button 
                    onClick={() => setError(null)}
                    className="bg-action-red text-white font-black uppercase italic tracking-widest py-3 px-8 md:py-4 md:px-10 hover:bg-action-red/90 transition-all active:scale-95 shadow-[4px_4px_0px_#ffffff] md:shadow-[8px_8px_0px_#ffffff]"
                  >
                    Retry
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Construction Floor */}
      <div className="lg:col-span-8 space-y-6">
        <div className="relative bg-[#002b1b] border-4 border-gold/30 p-4 md:p-8 min-h-[500px] md:min-h-[600px] overflow-hidden stadium-grid">
           <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           
           <div className="relative z-10">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 md:mb-12 gap-6 border-b border-gold/20 pb-8">
                 <div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">Fund Allocation</h2>
                    <p className="text-gold font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">Institutional Grade Portfolio</p>
                 </div>
                 
                 <div className="flex gap-2 md:gap-3 w-full xl:w-auto">
                    <div className="bg-secondary p-3 md:p-4 transform -skew-x-12 border-l-4 border-gold shadow-[4px_4px_0px_#022c22] flex-1 xl:flex-none">
                        <div className="text-[8px] md:text-[9px] font-black text-white/40 uppercase mb-1">Exposure</div>
                        <div className="text-sm sm:text-base md:text-xl font-black text-white italic break-all">₦{exposureAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="text-[9px] md:text-[10px] font-black text-gold">{totalAllocated}%</div>
                    </div>
                    <div className="bg-secondary p-3 md:p-4 transform -skew-x-12 border-l-4 border-naira shadow-[4px_4px_0px_#022c22] flex-1 xl:flex-none">
                        <div className="text-[8px] md:text-[9px] font-black text-white/40 uppercase mb-1">Reserve</div>
                        <div className="text-sm sm:text-base md:text-xl font-black text-naira italic break-all">₦{cashAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="text-[9px] md:text-[10px] font-black text-naira/60">{cashPercentage}%</div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                 <AnimatePresence>
                   {items.map((item) => {
                     const stockValue = (item.percentage / 100) * INITIAL_CAPITAL;
                     return (
                       <motion.div 
                          key={item.stockSymbol}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="bg-secondary/95 border-2 border-gold/40 p-4 md:p-5 relative group shadow-2xl overflow-hidden"
                       >
                          <button 
                            onClick={() => removeItem(item.stockSymbol)}
                            className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-action-red text-white flex items-center justify-center hover:scale-110 transition-transform z-20 shadow-lg"
                          >
                            <Trash2 size={14} strokeWidth={3} />
                          </button>
                          
                          <div className="mb-4">
                             <div className="flex justify-between items-start mb-2">
                                <div className="stat-badge text-[9px] md:text-[10px]">EQUITY</div>
                             </div>
                             <div className="text-white font-black uppercase italic truncate text-xl md:text-2xl mb-1 pr-6">
                                {item.stockSymbol}
                             </div>
                             <div className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-widest break-all">
                                ₦{stockValue.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                             </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-3">
                             <div className="flex-1">
                               <input
                                  type="number"
                                  value={item.percentage}
                                  onChange={(e) => updatePercentage(item.stockSymbol, parseFloat(e.target.value) || 0)}
                                  className="w-full bg-background/50 border-2 border-gold/20 p-2 font-black text-center text-gold outline-none focus:border-gold transition-all text-sm md:text-base"
                               />
                             </div>
                             <span className="font-black text-white/40 italic">%</span>
                          </div>
                       </motion.div>
                     );
                   })}
                 </AnimatePresence>

                 <div className="bg-white/5 border-2 border-dashed border-gold/20 p-6 flex flex-col justify-center items-center text-center backdrop-blur-sm">
                    <Wallet className="text-gold mb-2 md:mb-3" size={32} strokeWidth={3} />
                    <div className="text-[8px] md:text-[9px] font-black uppercase text-white/40 mb-1">Available Liquidity</div>
                    <div className="text-lg md:text-2xl font-black text-gold italic leading-none mb-2 break-all max-w-full">₦{cashAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="inline-block px-2 py-0.5 bg-gold/10 border border-gold/20 text-[8px] md:text-[9px] font-black text-gold uppercase tracking-widest">{cashPercentage}%</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-secondary border-b-4 border-gold shadow-2xl">
           <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${totalAllocated > 100 ? 'bg-action-red' : 'bg-gold'} animate-pulse`} />
              <span className="font-black uppercase italic text-xs md:text-sm text-white/80 tracking-tight">
                Allocated: <span className="text-gold break-all">₦{exposureAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </span>
           </div>
           
           <div className="w-full md:w-auto">
              <button
                onClick={handleSave}
                disabled={loading || totalAllocated > 100}
                className="prestige-button w-full md:w-auto flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Landmark size={20} />}
                Lock Strategy
              </button>
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-24">
        <div className="bg-secondary border-4 border-gold overflow-hidden shadow-2xl">
           <div className="p-4 md:p-6 bg-gold text-background flex justify-between items-center">
              <h2 className="font-black uppercase italic text-lg md:text-xl tracking-tighter text-background leading-none">Trading Floor</h2>
              <Gavel size={24} />
           </div>
           
           <div className="p-4 bg-background/50 border-b border-gold/20">
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gold/40" />
                 </div>
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="SEARCH ASSETS..."
                   className="w-full bg-background border border-gold/20 pl-10 p-3 font-black italic text-[10px] md:text-xs text-gold placeholder:text-gold/20 focus:outline-none focus:border-gold transition-all"
                 />
              </div>
           </div>

           <div className="p-2 md:p-4 space-y-2 max-h-[400px] lg:max-h-[610px] overflow-y-auto custom-scrollbar">
              {filteredStocks.length === 0 ? (
                <div className="py-10 text-center text-white/20 font-black uppercase text-[10px] italic">
                   No Assets Found
                </div>
              ) : (
                filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => addItem(stock.symbol)}
                    className="w-full flex items-center justify-between p-3 md:p-4 bg-white/5 border border-white/5 hover:border-gold hover:bg-white/10 transition-all text-left group"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="font-black text-gold text-base md:text-lg">{stock.symbol}</div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                      <span className="font-black text-xs md:text-sm text-white break-all">₦{Number(stock.currentPrice).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <div className="bg-gold/10 p-1 group-hover:bg-gold transition-colors">
                         <Plus size={18} className="text-gold group-hover:text-background transition-colors" />
                      </div>
                    </div>
                  </button>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
