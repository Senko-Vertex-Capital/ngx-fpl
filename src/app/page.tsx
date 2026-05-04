"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Handbook } from "@/components/landing/Handbook";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Twitter, Github, Linkedin, TrendingUp, Landmark, Percent, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Handbook />
        
        {/* High-Octane Financial CTA Section */}
        <section className="py-40 bg-background relative overflow-hidden border-t-8 border-gold">
          <div className="absolute inset-0 stadium-grid opacity-20" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-12 md:p-24 border-b-[16px] border-r-[16px] border-gold shadow-[24px_24px_0px_#008751] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
              
              <div className="inline-flex items-center gap-3 bg-gold/10 px-6 py-2 border border-gold/20 mb-12 transform -skew-x-12">
                <Percent size={20} className="text-gold" strokeWidth={3} />
                <span className="text-gold font-black text-sm uppercase tracking-[0.2em]">Yield Maximization Active</span>
              </div>

              <h2 className="text-6xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-white mb-12">
                Chase <br />
                <span className="text-gold text-glow-gold">The Alpha.</span>
              </h2>
              
              <p className="text-white/60 text-xl md:text-3xl font-bold uppercase italic mb-16 max-w-3xl mx-auto leading-tight">
                ₦250,000,000 is waiting for a principal manager. <br />
                Do you have the conviction to deliver maximum returns?
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link 
                  href="/login" 
                  className="prestige-button text-3xl px-16 py-8 italic"
                >
                  Launch My Fund
                </Link>
                <Link 
                  href="/rankings" 
                  className="bg-white/10 text-white font-black uppercase italic tracking-widest px-16 py-8 hover:bg-white/20 transition-all transform -skew-x-12 flex items-center justify-center gap-4 border border-white/20"
                >
                  <Trophy size={32} className="text-gold" strokeWidth={3} />
                  Hall of Fame
                </Link>
              </div>

              <div className="mt-16 flex justify-center gap-12 opacity-20 grayscale grayscale-100">
                <Landmark size={48} />
                <TrendingUp size={48} />
                <Percent size={48} />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
