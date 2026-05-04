"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Wallet, BarChart2, ShieldCheck, HelpCircle } from "lucide-react";

const rules = [
  {
    title: "Capital Base",
    desc: "Every manager starts with ₦250,000,000 in virtual capital. This balance is your baseline for the season.",
    icon: Wallet
  },
  {
    title: "Fiscal Lockdown",
    desc: "Strategy windows close every Monday at 8:00 AM WAT. After this, your fund is locked for the trading week.",
    icon: Clock
  },
  {
    title: "Market Integrity",
    desc: "We use official NGX closing prices. Your fund value is updated daily at 5:00 PM WAT, following the market bell.",
    icon: BarChart2
  },
  {
    title: "The Alpha Chase",
    desc: "Leaderboard points are additive. Every week of outperformance builds your standing in the annual Hall of Fame.",
    icon: ShieldCheck
  }
];

export function Handbook() {
  return (
    <section className="py-40 bg-secondary relative overflow-hidden border-t-8 border-gold">
      <div className="absolute inset-0 stadium-grid opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
           <div className="inline-flex items-center gap-3 bg-gold/10 px-6 py-2 border border-gold/20 mb-8 transform -skew-x-12">
              <BookOpen size={20} className="text-gold" strokeWidth={3} />
              <span className="text-gold font-black text-sm uppercase tracking-[0.2em]">The Protocol Handbook</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-tighter text-white mb-8">
             Operational <span className="text-gold text-glow-gold">Bylaws.</span>
           </h2>
           <p className="text-white/60 font-bold uppercase italic text-xl">
             The Fund Manager League operates on strict institutional rules. <br className="hidden md:block" /> Understand the cycle before you commit capital.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {rules.map((rule, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background/50 border-2 border-white/5 p-8 md:p-12 hover:border-gold/30 transition-colors group"
            >
              <div className="flex items-start gap-8">
                 <div className="w-16 h-16 bg-white/5 flex items-center justify-center shrink-0 transform -skew-x-12 group-hover:bg-gold transition-all">
                    <rule.icon size={32} className="text-gold group-hover:text-background transition-colors" strokeWidth={3} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black uppercase italic text-white mb-4 group-hover:text-gold transition-colors">{rule.title}</h3>
                    <p className="text-white/40 font-bold uppercase text-xs leading-relaxed tracking-wide italic">{rule.desc}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
           <div className="inline-flex items-center gap-4 p-4 bg-action-red/5 border border-action-red/20 max-w-xl">
              <HelpCircle className="text-action-red shrink-0" size={24} strokeWidth={3} />
              <p className="text-[10px] font-black uppercase text-action-red/80 tracking-widest text-left italic leading-relaxed">
                Notice: The League is a pure simulation. No real money can be deposited, earned, or withdrawn. Your success is measured in Alpha Points only.
              </p>
           </div>
        </div>
      </div>
    </section>
  );
}
