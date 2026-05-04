"use client";

import { useState } from "react";
import { setUsername } from "@/actions/auth";
import { Loader2, Landmark } from "lucide-react";

export function UsernameForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await setUsername(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 text-left">
      <div className="space-y-3">
        <label 
          htmlFor="username" 
          className="block font-black text-[10px] uppercase tracking-[0.3em] text-white/40"
        >
          Manager Codename
        </label>
        <div className="relative group">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Landmark className="h-5 w-5 text-gold/40 group-focus-within:text-gold transition-colors" />
           </div>
           <input
             type="text"
             name="username"
             id="username"
             placeholder="ENTER CODENAME..."
             required
             minLength={3}
             className="w-full bg-background border-2 border-gold/20 pl-12 p-4 font-black italic text-lg text-gold placeholder:text-gold/20 focus:outline-none focus:border-gold transition-all"
           />
        </div>
        {error && (
          <p className="mt-2 text-action-red text-[10px] font-black uppercase italic tracking-widest">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="prestige-button w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:translate-y-0"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying Identity...
          </>
        ) : (
          "Initialize Manager Fund"
        )}
      </button>
    </form>
  );
}
