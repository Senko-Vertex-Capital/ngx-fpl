"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
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
              <Lock size={14} />
              <span>Data Protocol</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">
              Privacy & <span className="text-gold">Data</span>
            </h1>
            <p className="text-white/60 text-lg font-bold uppercase italic leading-relaxed">
              How we manage and protect your manager identity.
            </p>
          </motion.div>

          <div className="glass p-10 md:p-16 rounded-[2.5rem] border border-white/5 space-y-12 text-white/80 font-light leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">1. Information Collection</h2>
              <p>
                We collect only the most basic information required to facilitate your participation in the league. This includes your social ID from Google or Facebook, and the unique username you choose. We do not store your email addresses, real names, or profile pictures in our core database.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">2. Usage of Data</h2>
              <p>
                Your data is used solely to maintain your simulation progress, calculate your leaderboard rankings, and manage your virtual portfolio. We do not sell, rent, or share your data with third-party advertisers.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">3. Cookies & Sessions</h2>
              <p>
                We use secure session cookies to keep you logged into the platform. These are technical requirements and are not used for tracking your behavior outside of the simulation.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-gold">4. Data Deletion</h2>
              <p>
                As a manager, you have the right to request the deletion of your account and all associated simulation data at any time through our support channels.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
