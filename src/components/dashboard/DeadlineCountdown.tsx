"use client";

import { useState, useEffect } from "react";
import { Timer, AlertTriangle } from "lucide-react";

export function DeadlineCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isUrgent: boolean;
  } | null>(null);

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const nextDeadline = new Date(now);
      const day = nextDeadline.getDay();
      let daysUntilMonday = (1 - day + 7) % 7;
      if (daysUntilMonday === 0 && nextDeadline.getHours() >= 8) {
        daysUntilMonday = 7;
      }
      
      nextDeadline.setDate(nextDeadline.getDate() + daysUntilMonday);
      nextDeadline.setHours(8, 0, 0, 0);

      const difference = nextDeadline.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        const isUrgent = difference < (1000 * 60 * 60 * 24);
        setTimeLeft({ days, hours, minutes, seconds, isUrgent });
      }
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className={`p-3 md:p-4 border-2 flex items-center gap-3 md:gap-6 transition-all duration-500 w-full md:w-auto ${
      timeLeft.isUrgent ? 'border-action-red/40 bg-action-red/5 shadow-[0_0_20px_rgba(212,46,18,0.1)]' : 'border-white/10 bg-white/5'
    }`}>
      <div className={`p-2 md:p-3 transform -skew-x-12 shrink-0 ${
        timeLeft.isUrgent ? 'bg-action-red animate-pulse' : 'bg-gold'
      }`}>
        <Timer className={timeLeft.isUrgent ? 'text-white' : 'text-background'} size={18} strokeWidth={3} />
      </div>
      
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none truncate ${
          timeLeft.isUrgent ? 'text-action-red' : 'text-gold/60'
        }`}>
          {timeLeft.isUrgent ? 'STRATEGY LOCKDOWN IMMINENT' : 'FISCAL LOCKDOWN'}
        </span>
        
        <div className="flex items-center gap-2 md:gap-3">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <Divider />
          <TimeUnit value={timeLeft.hours} label="HRS" />
          <Divider />
          <TimeUnit value={timeLeft.minutes} label="MIN" />
          <Divider />
          <TimeUnit value={timeLeft.seconds} label="SEC" />
        </div>
      </div>

      {timeLeft.isUrgent && (
         <div className="ml-auto hidden sm:block shrink-0">
            <AlertTriangle className="text-action-red" size={20} />
         </div>
      )}
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[28px] md:min-w-[32px]">
      <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white tabular-nums leading-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[6px] md:text-[7px] font-black text-white/20 tracking-widest mt-1 md:mt-1.5">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-3 md:h-4 w-[1px] bg-white/10 self-start mt-0.5 md:mt-1" />;
}
