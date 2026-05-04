"use client";

import Link from "next/link";
import { TrendingUp, LogOut, Landmark } from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardNav } from "./DashboardNav";

export function Sidebar() {
  return (
    <aside className="w-80 border-r-4 border-gold bg-secondary hidden lg:flex flex-col h-screen fixed top-0 left-0 z-30">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gold p-2 transform -skew-x-12 group-hover:scale-110 transition-transform shadow-[4px_4px_0px_#008751]">
            <Landmark className="text-background w-6 h-6" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase italic leading-none text-white">
            The Fund <span className="text-gold">Manager</span> <br /> League
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DashboardNav />
      </div>

      <div className="p-6">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-action-red/80 hover:text-white hover:bg-action-red transition-all border border-transparent hover:border-white/20"
        >
          <LogOut className="w-4 h-4" />
          End Session
        </button>
      </div>
    </aside>
  );
}
