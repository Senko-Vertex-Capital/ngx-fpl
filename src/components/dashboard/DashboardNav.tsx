"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Trophy, 
  History, 
  Settings,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
  { name: "Hall of Fame", href: "/rankings", icon: Trophy },
  { name: "History", href: "/dashboard/performance", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-4 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium transition-all group ${
              isActive 
                ? "bg-gold text-background shadow-[0_0_20px_rgba(197,160,89,0.2)]" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className={`w-5 h-5 ${isActive ? "text-background" : "group-hover:text-gold transition-colors"}`} />
              <span className="uppercase tracking-[0.2em] text-[10px] font-black italic">{item.name}</span>
            </div>
            {isActive && (
              <motion.div layoutId="active-pill-dashboard">
                 <ChevronRight size={14} />
              </motion.div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
