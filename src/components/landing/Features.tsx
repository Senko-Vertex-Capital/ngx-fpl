"use client";

import { Wallet, Lock, LineChart, Globe, Zap, Users, Target, Shield, Landmark, Scale, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Capital Injection",
    description: "Start with ₦250M in virtual liquidity. Diversify your capital across the NGX with absolute precision.",
    icon: Landmark,
    color: "bg-gold",
    textColor: "text-background",
  },
  {
    title: "The Closing Bell",
    description: "Your positions lock every Monday at 8:00 AM. Strategic patience is the hallmark of the elite.",
    icon: Scale,
    color: "bg-naira",
    textColor: "text-white",
  },
  {
    title: "Daily P&L",
    description: "Monitor your fund's growth daily at 5:00 PM. Performance data is verified at every market close.",
    icon: BarChart3,
    color: "bg-bronze",
    textColor: "text-white",
  },
  {
    title: "Leaderboard Elite",
    description: "Measure your returns against Nigeria's finest. Climb the ranks to become the nation's top fund manager.",
    icon: TrendingUp,
    color: "bg-background",
    textColor: "text-gold",
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="py-40 bg-white text-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent opacity-10" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1 bg-background text-gold font-black uppercase italic mb-6 transform -skew-x-12">
              Manager Protocol
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter">
              Master Your <br />
              <span className="text-naira">Investment Fund.</span>
            </h2>
          </div>
          <p className="text-background/60 text-xl font-bold uppercase italic max-w-sm leading-tight border-l-4 border-gold pl-6">
            Allocate assets, monitor growth, and dominate the exchange floor. 
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 border-4 border-background group hover:bg-background hover:text-white transition-all duration-300"
            >
              <div className={`${feature.color} ${feature.textColor} w-16 h-16 flex items-center justify-center mb-8 transform -rotate-3 group-hover:rotate-6 transition-transform shadow-[4px_4px_0px_#8b5a2b]`}>
                <feature.icon size={32} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-6 leading-none tracking-tighter">
                {feature.title}
              </h3>
              <p className="font-bold text-sm uppercase opacity-70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 p-12 bg-background text-white relative overflow-hidden border-b-8 border-gold shadow-[16px_16px_0px_#c5a059]">
           <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <Landmark size={400} />
           </div>
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-4xl font-black uppercase italic mb-6">No real currency. <br /> Just financial prestige.</h4>
                <p className="font-bold uppercase italic opacity-60">The Fund Manager League is a high-stakes simulation for the Nigerian market. Prove your management skills on the national stage.</p>
              </div>
              <div className="flex justify-start md:justify-end">
                 <Link href="/login" className="prestige-button text-xl px-10 py-5">Initiate Fund Access</Link>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
