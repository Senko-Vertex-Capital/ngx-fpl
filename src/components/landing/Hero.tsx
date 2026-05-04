"use client";

import Link from "next/link";
import { ArrowRight, Trophy, BarChart3, ShieldCheck, LayoutDashboard, Landmark, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export function Hero() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="relative pt-24 pb-40 overflow-hidden border-b-8 border-gold bg-background">
      {/* Financial Grid Background */}
      <div className="absolute inset-0 stadium-grid opacity-30" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-naira/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-gold px-4 py-1.5 transform -skew-x-12 mb-8 shadow-[4px_4px_0px_#008751]"
            >
              <Landmark size={16} className="text-background" strokeWidth={3} />
              <span className="text-background font-black text-xs uppercase tracking-tighter">Season {new Date().getFullYear()} Active • No Real Money</span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-[8rem] font-black leading-[0.8] tracking-tighter uppercase italic mb-10"
            >
              Master <br />
              <span className="text-gold text-glow-gold">The Exchange</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl font-bold uppercase italic text-white/80 mb-12 max-w-lg leading-tight"
            >
              Build your ₦250,000,000 Fund. <br />
              Navigate the Nigerian Stock Market. <br />
              No real capital risk. Pure financial prestige.
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              {!isAuthenticated ? (
                <Link 
                  href="/login" 
                  className="prestige-button text-2xl px-12 py-6 w-full sm:w-auto text-center font-black italic"
                >
                  Become a Fund Manager
                </Link>
              ) : (
                <Link 
                  href="/dashboard" 
                  className="prestige-button text-2xl px-12 py-6 w-full sm:w-auto text-center font-black italic"
                >
                  Manage My Portfolio
                </Link>
              )}
              <Link 
                href="#how-it-works" 
                className="text-white font-black uppercase italic tracking-widest hover:text-gold transition-colors flex items-center gap-2 group"
              >
                Manager Handbook
                <ArrowRight className="group-hover:translate-x-2 transition-transform text-gold" />
              </Link>
            </motion.div>
          </div>

          <div className="relative hidden lg:block">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
              animate={{ scale: 1, opacity: 1, rotate: -3 }}
              className="bg-secondary border-4 border-gold p-8 shadow-[20px_20px_0px_#01160e,24px_24px_0px_#c5a059]"
            >
               <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-1">Top Fund Manager</div>
                    <div className="text-4xl font-black italic uppercase">@WealthAvenue</div>
                  </div>
                  <Briefcase size={48} className="text-gold" />
               </div>
               
               <div className="space-y-4 mb-12">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-bold uppercase italic text-sm text-white/60">Asset Growth</span>
                    <span className="font-black text-2xl text-gold">+24.5%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-bold uppercase italic text-sm text-white/60">Market Ranking</span>
                    <span className="font-black text-2xl">#1</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 border border-gold/20 flex flex-col justify-center items-center">
                    <div className="text-[10px] font-black uppercase opacity-40">Portfolio Value</div>
                    <div className="font-black text-xl italic text-gold">₦311.2M</div>
                  </div>
                  <div className="h-24 bg-white/5 border border-gold/20 flex flex-col justify-center items-center">
                    <div className="text-[10px] font-black uppercase opacity-40">Active Stocks</div>
                    <div className="font-black text-xl italic text-gold">14</div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
