"use client";

import { useState } from "react";
import { LogOut, ShieldAlert, Loader2, X } from "lucide-react";
import { deleteAccount } from "@/actions/auth";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function ResignButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResign() {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAccount();
      if (result.success) {
        // Force sign out and redirect to landing
        await signOut({ callbackUrl: "/" });
      } else {
        setError(result.error || "Deactivation failed.");
        setLoading(false);
      }
    } catch (err) {
      setError("Critical protocol failure.");
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-6 bg-white/5 border-2 border-action-red/20 hover:bg-action-red/10 hover:border-action-red transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-action-red/10 text-action-red transform -skew-x-12 group-hover:bg-action-red group-hover:text-white transition-all">
             <ShieldAlert size={20} strokeWidth={3} />
          </div>
          <div className="text-left">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-action-red/60">Protocol 99</div>
             <div className="text-xl font-black uppercase italic text-white">Resign from League</div>
          </div>
        </div>
        <LogOut className="text-action-red opacity-20 group-hover:opacity-100 transition-opacity" size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl"
          >
            <div className="bg-secondary border-4 border-action-red p-10 max-w-lg w-full shadow-[32px_32px_0px_#01160e] relative overflow-hidden">
               <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-action-red rounded-full mb-8 shadow-2xl border-4 border-white">
                    <ShieldAlert className="text-white" size={40} strokeWidth={3} />
                  </div>
                  
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4 leading-none">Permanent Resignation</h2>
                  <p className="text-white/60 font-bold uppercase text-xs mb-10 leading-relaxed italic">
                    By confirming this protocol, you will be permanently removed from the League. Your fund codename, performance history, and current portfolio will be destroyed. This action is irreversible.
                  </p>
                  
                  {error && (
                    <div className="mb-8 p-4 bg-action-red/20 border border-action-red text-action-red text-[10px] font-black uppercase italic">
                       {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handleResign}
                      disabled={loading}
                      className="bg-action-red text-white font-black uppercase italic tracking-widest py-5 px-10 hover:bg-action-red/90 transition-all active:scale-95 shadow-[8px_8px_0px_#ffffff] flex items-center justify-center gap-3"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Confirm Resignation"}
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      disabled={loading}
                      className="text-white/40 font-black uppercase italic tracking-widest py-4 hover:text-white transition-colors"
                    >
                      Abort Protocol
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
