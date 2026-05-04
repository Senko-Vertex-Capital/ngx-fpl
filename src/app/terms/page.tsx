"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function TermsPage() {
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
              <Scale size={14} />
              <span>Legal Protocol</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">
              Terms of <span className="text-gold">Play</span>
            </h1>
            <p className="text-white/60 text-lg font-bold uppercase italic leading-relaxed">
              The framework for participating in the simulation.
            </p>
          </motion.div>

          <div className="glass p-10 md:p-16 rounded-[2.5rem] border border-white/5 space-y-12 text-white/80 font-light leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">1. Nature of the Game</h2>
              <p>
                The Fund Manager League is a virtual stock market simulation. All transactions, assets, and performance metrics are strictly for entertainment and educational purposes. No real currency is ever exchanged, deposited, or withdrawn within this platform.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">2. Eligibility</h2>
              <p>
                Participants must be at least 18 years of age. By accessing the platform, you represent that you have the legal capacity to enter into this agreement. Only one account is permitted per individual manager.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">3. Virtual Capital</h2>
              <p>
                Each manager is provided with a virtual starting balance of ₦250,000,000. This capital has no real-world value and cannot be converted into any legal tender, credit, or physical rewards.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">4. No Investment Advice</h2>
              <p>
                Content on this platform does not constitute financial, legal, or investment advice. The simulation may use real market data, but it is not intended to provide professional guidance for real-world trading. Always consult a licensed financial advisor before making actual investments.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">5. Market Data Accuracy</h2>
              <p>
                While we strive to provide accurate data from the Nigerian Stock Exchange, we do not guarantee the completeness or timeliness of market prices. Technical delays may occur, and simulation results should not be used as a basis for real-world financial decisions.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate any manager account that violates the spirit of the game, including but not limited to, multi-accounting, exploiting technical bugs, or using offensive usernames.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
