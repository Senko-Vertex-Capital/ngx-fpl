"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 stadium-grid opacity-10" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gold px-4 py-1.5 transform -skew-x-12 text-background font-black text-xs uppercase tracking-widest mb-6 shadow-[4px_4px_0px_#008751]">
              <ShieldAlert size={14} />
              <span>Safety Protocol</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">
              Simulation <span className="text-gold">Disclaimer</span>
            </h1>
            <p className="text-white/60 text-lg font-bold uppercase italic leading-relaxed">
              Essential clarity on the nature of this virtual experience.
            </p>
          </motion.div>

          <div className="glass p-10 md:p-16 rounded-[2.5rem] border border-white/5 space-y-12">
             <div className="p-8 bg-gold/10 border-l-8 border-gold text-gold font-black uppercase italic text-2xl tracking-tighter">
                NOTICE: THIS IS NOT A FINANCIAL SERVICE.
             </div>

            <div className="grid md:grid-cols-2 gap-12 text-white/80 font-light leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase italic text-white">No Real Currency</h2>
                <p>
                  The Fund Manager League is a fictional simulation. Every "Naira" (₦) displayed on this platform is a virtual point with no economic value. You cannot deposit real money, and you cannot win real prizes, rewards, or cash.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase italic text-white">No Professional Advice</h2>
                <p>
                  We are not licensed by the Securities and Exchange Commission (SEC) or the Central Bank of Nigeria (CBN). This project is for educational and entertainment purposes only and should not be used to inform real-world financial strategy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase italic text-white">Data Delays</h2>
                <p>
                  Stock prices used in this simulation are sourced from public feeds and may be delayed, simulated, or approximate. This platform does not provide "real-time" market access.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase italic text-white">No Warranty</h2>
                <p>
                  The simulation is provided "as-is" without any warranty of accuracy or reliability. We are not responsible for any loss of virtual points or errors in ranking calculations.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
