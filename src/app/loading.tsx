"use client";

import { Landmark, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-background z-[200] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 stadium-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-80" />
      
      <div className="relative z-10 space-y-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gold rounded-full shadow-[0_0_50px_rgba(197,160,89,0.3)] border-4 border-white"
        >
          <Landmark className="text-background" size={40} strokeWidth={3} />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
            Synchronizing <br />
            <span className="text-gold">Market Data</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
             <Loader2 className="text-gold animate-spin" size={20} strokeWidth={3} />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Verifying Institutional Protocols...</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full">
         <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/10">Authorized Access Only • The Fund Manager League</p>
      </div>
    </div>
  );
}
