"use client";

import { useEffect } from "react";
import { ShieldAlert, RefreshCcw, Home, Gavel } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Protocol Error:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-background z-[300] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 stadium-grid opacity-20" />
      
      <div className="relative z-10 max-w-2xl w-full">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-secondary border-4 border-action-red p-12 shadow-[32px_32px_0px_#01160e] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 text-action-red">
             <ShieldAlert size={300} />
          </div>

          <div className="relative z-10">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-action-red rounded-full mb-8 shadow-2xl border-4 border-white">
                <Gavel className="text-white" size={40} strokeWidth={3} />
             </div>

             <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-4 leading-none text-glow-red">
               Market Interface <br />
               <span className="text-action-red italic">Offline</span>
             </h2>

             <p className="text-white/60 font-bold uppercase text-xs mb-12 leading-relaxed italic tracking-wide">
               A critical failure has occurred in the institutional data link. <br />
               Ref ID: {error.digest || "SIM-ERR-ALPHA"}
             </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => reset()}
                  className="bg-white text-background font-black uppercase italic tracking-widest py-4 px-10 hover:bg-gold transition-all active:scale-95 shadow-[8px_8px_0px_#d42e12] flex items-center justify-center gap-3"
                >
                  <RefreshCcw size={18} strokeWidth={3} />
                  Retry Protocol
                </button>
                <Link
                  href="/"
                  className="bg-transparent border-2 border-white/20 text-white font-black uppercase italic tracking-widest py-4 px-10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                >
                  <Home size={18} strokeWidth={3} />
                  Return to Base
                </Link>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 w-full">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Protocol Emergency Response • The Fund Manager League</p>
      </div>
    </div>
  );
}
