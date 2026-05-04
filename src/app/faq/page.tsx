"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is The Fund Manager League?",
    answer: "The Fund Manager League is a virtual stock market simulation game where you manage a mock portfolio using real-world stock prices from the Nigerian Stock Exchange (NGX). It is a competitive game for entertainment and educational purposes only."
  },
  {
    question: "Is real money involved?",
    answer: "Absolutely not. The Fund Manager League is a pure simulation. All capital (N250M) and transactions are virtual. No real money is ever involved, and you cannot deposit or withdraw any funds."
  },
  {
    question: "Can I win real prizes or rewards?",
    answer: "No. There are no real-world prizes, monetary rewards, or physical gifts for ranking on the leaderboards. The game is played solely for prestige, learning, and bragging rights among managers."
  },
  {
    question: "How much virtual capital do I start with?",
    answer: "Every manager is assigned a virtual starting capital of N250,000,000 to allocate across the Nigerian Stock Exchange each week."
  },
  {
    question: "When is the Game Deadline?",
    answer: "Fund allocations lock every Monday at 8:00 AM (WAT). Any changes made after this deadline will only apply to the next week's simulation period."
  },
  {
    question: "What assets can I select?",
    answer: "You can select any common stock listed on the Nigerian Stock Exchange (NGX). There is no limit to the number of different stocks you can track in your fund, as long as your total allocation is 100% or less."
  },
  {
    question: "What happens to unallocated virtual cash?",
    answer: "If your stock selections total less than 100%, the remaining virtual percentage is held as cash. Cash always has a 0% gain/loss performance in this simulation."
  },
  {
    question: "How often are simulation values updated?",
    answer: "Portfolio values are updated daily at 5:00 PM (WAT) based on the official closing prices of that day's trading session on the NGX."
  },
  {
    question: "How are the leaderboard positions determined?",
    answer: "Every day at 5:00 PM, we calculate the percentage gain or loss for every virtual portfolio relative to the start of the week. These scores are used to update the Hall of Fame standings."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24 px-6 bg-background relative overflow-hidden">
        {/* Financial Grid Background */}
        <div className="absolute inset-0 stadium-grid opacity-10" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gold px-4 py-1.5 transform -skew-x-12 text-background font-black text-xs uppercase tracking-widest mb-6 shadow-[4px_4px_0px_#008751]">
              <HelpCircle size={14} />
              <span>Manager Handbook</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">
              Manager <span className="text-gold">Handbook</span>
            </h1>
            <p className="text-white/60 text-lg font-bold uppercase italic leading-relaxed">
              Everything you need to know about the simulation.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FAQItem({ faq, index }: { faq: typeof faqs[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 border-2 border-white/10 overflow-hidden hover:border-gold transition-colors"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all"
      >
        <span className="font-black uppercase italic text-xl tracking-tight pr-8 text-white">{faq.question}</span>
        <ChevronDown 
          className={`text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={24} 
          strokeWidth={3}
        />
      </button>
      <div 
        className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'pb-8 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-white/60 font-bold uppercase italic text-sm leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </motion.div>
  );
}
