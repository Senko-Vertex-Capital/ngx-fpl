"use client";

import Link from "next/link";
import { TrendingUp, Twitter, Github, Linkedin, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-background border-t-8 border-gold py-24 relative overflow-hidden text-white">
      {/* Financial Grid Background */}
      <div className="absolute inset-0 stadium-grid opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-20 mb-24">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <div className="bg-gold p-2 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <Landmark className="text-background w-8 h-8" strokeWidth={3} />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">
                The Fund <span className="text-gold">Manager</span> League
              </span>
            </Link>
            <p className="text-white/40 font-bold uppercase italic text-lg leading-snug">
              The premier virtual asset management simulation for the Nigerian market. 
              Pure skill. Zero financial risk. No real rewards.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="space-y-8">
              <h4 className="text-gold font-black uppercase italic tracking-widest text-xs">Game Access</h4>
              <ul className="space-y-4 text-sm font-bold uppercase italic text-white/60">
                <li><Link href="/dashboard" className="hover:text-gold transition-colors">Fund Dashboard</Link></li>
                <li><Link href="/dashboard/portfolio" className="hover:text-gold transition-colors">Asset Exchange</Link></li>
                <li><Link href="/rankings" className="hover:text-gold transition-colors">Hall of Fame</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-gold font-black uppercase italic tracking-widest text-xs">Help & Protocol</h4>
              <ul className="space-y-4 text-sm font-bold uppercase italic text-white/60">
                <li><Link href="/faq" className="hover:text-gold transition-colors">Manager Handbook</Link></li>
                <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Play</Link></li>
                <li><Link href="/privacy" className="hover:text-gold transition-colors">Data Privacy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-gold transition-colors">Simulation Disclaimer</Link></li>
              </ul>
            </div>
            <div className="space-y-8 col-span-2 md:col-span-1">
              <h4 className="text-gold font-black uppercase italic tracking-widest text-xs">Community</h4>
              <div className="flex gap-4">
                <Link href="#" className="w-12 h-12 bg-white/5 border-2 border-white/10 flex items-center justify-center hover:bg-gold hover:text-background transition-all transform -skew-x-12">
                  <Twitter size={20} strokeWidth={3} />
                </Link>
                <Link href="#" className="w-12 h-12 bg-white/5 border-2 border-white/10 flex items-center justify-center hover:bg-gold hover:text-background transition-all transform -skew-x-12">
                  <Github size={20} strokeWidth={3} />
                </Link>
                <Link href="#" className="w-12 h-12 bg-white/5 border-2 border-white/10 flex items-center justify-center hover:bg-gold hover:text-background transition-all transform -skew-x-12">
                  <Linkedin size={20} strokeWidth={3} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t-4 border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-black uppercase italic text-[10px] tracking-[0.3em] text-white/20">© {new Date().getFullYear()} THE FUND MANAGER LEAGUE. A VIRTUAL SIMULATION PROJECT.</p>
            <p className="font-black uppercase italic text-[10px] tracking-[0.3em] text-gold">NO REAL MONEY OR REWARDS INVOLVED. PURELY FOR EDUCATIONAL PURPOSES.</p>
          </div>
          <div className="bg-secondary px-6 py-3 border-2 border-gold transform -skew-x-12 font-black text-[10px] uppercase tracking-[0.2em] text-gold shadow-[4px_4px_0px_#8b5a2b]">
            VIRTUAL STOCK MARKET GAME
          </div>
        </div>
      </div>
    </footer>
  );
}
