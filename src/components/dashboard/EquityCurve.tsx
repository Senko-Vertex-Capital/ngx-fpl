"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EquityCurveProps {
  data: {
    date: string;
    value: number;
    fw: number;
  }[];
}

export function EquityCurve({ data }: EquityCurveProps) {
  // If no data, show empty state or placeholder
  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-white/20 font-black uppercase text-[10px] tracking-widest italic">
        Insufficient Data for Curve
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008751" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#008751" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="date"
            hide
          />
          <YAxis
            domain={['auto', 'auto']}
            hide
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-secondary border-2 border-gold p-3 shadow-2xl">
                    <p className="text-[10px] font-black uppercase text-gold mb-1">FW {payload[0].payload.fw}</p>
                    <p className="text-sm font-black italic text-white">
                      {payload[0].value?.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </p>
                    <p className="text-[8px] font-bold text-white/40 uppercase">{payload[0].payload.date}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#008751"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
