"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useState } from "react";
import { Menu, X, Landmark, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-80">
        {/* Elite Mobile Header */}
        <header className="h-20 border-b-4 border-gold bg-secondary flex items-center justify-between px-6 sticky top-0 z-40 lg:hidden shadow-2xl">
           <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gold p-1.5 transform -skew-x-12">
                <Landmark className="text-background w-5 h-5" />
              </div>
              <span className="font-black text-sm tracking-tighter uppercase italic leading-none text-white text-left">
                The Fund <span className="text-gold">Manager</span> <br /> League
              </span>
           </Link>
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="bg-gold p-2 transform -skew-x-12 shadow-[3px_3px_0px_#008751] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
           >
             <Menu className="text-background" size={24} strokeWidth={3} />
           </button>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto stadium-grid bg-[#020617]/50">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[300px] bg-secondary border-l-4 border-gold z-[101] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b-2 border-gold/10 flex justify-between items-center">
                 <span className="font-black text-gold uppercase italic tracking-widest text-xs">Navigation Protocol</span>
                 <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="text-white hover:text-gold transition-colors" size={32} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-8">
                 <DashboardNav onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>

              <div className="p-8 border-t-2 border-gold/10">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="prestige-button w-full flex items-center justify-center gap-3 text-xs italic"
                >
                  <LogOut size={16} strokeWidth={3} />
                  Terminate Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
