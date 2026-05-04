"use client";

import Link from "next/link";
import { TrendingUp, Menu, X, LayoutDashboard, User, Landmark, Trophy } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="border-b-4 border-gold bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gold p-1.5 transform -skew-x-12 group-hover:scale-110 transition-transform">
            <Landmark className="text-background w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-white leading-none">
            The Fund <span className="text-gold">Manager</span> <br /> League
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] italic">
          <Link href="/" className="hover:text-gold transition-colors underline-offset-8 hover:underline decoration-4">Exchange</Link>
          <Link href="/rankings" className="hover:text-gold transition-colors underline-offset-8 hover:underline decoration-4">Standings</Link>
          <Link href="/faq" className="hover:text-gold transition-colors underline-offset-8 hover:underline decoration-4">Protocol</Link>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Link 
              href="/login" 
              className="prestige-button text-xs font-black"
            >
              Client Login
            </Link>
          ) : (
            <Link 
              href="/dashboard" 
              className="prestige-button text-xs font-black flex items-center gap-2"
            >
              <LayoutDashboard size={16} strokeWidth={3} />
              My Fund
            </Link>
          )}
          <button className="lg:hidden text-gold" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden border-t-4 border-gold bg-background px-6 py-10 space-y-6"
          >
            <Link href="/" className="block text-3xl font-black italic uppercase hover:text-gold" onClick={() => setIsOpen(false)}>
              Exchange
            </Link>
            <Link href="/rankings" className="block text-3xl font-black italic uppercase hover:text-gold" onClick={() => setIsOpen(false)}>
              Standings
            </Link>
            <Link href="/faq" className="block text-3xl font-black italic uppercase hover:text-gold" onClick={() => setIsOpen(false)}>
              Protocol
            </Link>
            <div className="pt-6 border-t border-gold/20">
               {!isAuthenticated ? (
                  <Link href="/login" className="prestige-button block text-center font-black italic uppercase" onClick={() => setIsOpen(false)}>Client Login</Link>
                ) : (
                  <Link href="/dashboard" className="prestige-button block text-center font-black italic uppercase" onClick={() => setIsOpen(false)}>My Fund</Link>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
