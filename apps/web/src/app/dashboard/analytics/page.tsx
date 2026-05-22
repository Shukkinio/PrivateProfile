'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardLabel, CardValue, CardDesc } from 'ui';

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-xl border border-[#c4b5fd]/15 bg-[#0d1117] px-[18px] py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 font-mono text-[9px] font-medium uppercase tracking-wider text-white/30">
              total profile views
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[28px] font-extrabold text-[#c4b5fd]">48,291</span>
              <span className="text-xs text-white/35">all time</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#34d399]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#34d399] animate-pulse" />
              12 online now
            </div>
            <div className="flex gap-2">
              <span className="rounded-md border border-[#2dd4bf]/20 bg-[#2dd4bf]/12 px-2 py-[2px] font-mono text-[10px] font-medium text-[#2dd4bf]">↑ 18% this week</span>
              <span className="rounded-md border border-[#fbbf24]/20 bg-[#fbbf24]/12 px-2 py-[2px] font-mono text-[10px] font-medium text-[#fbbf24]">+203 today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Traffic overview</div>
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardLabel>Today</CardLabel>
          <CardValue>203</CardValue>
          <CardDesc>+12% from yesterday</CardDesc>
        </Card>
        <Card>
          <CardLabel>This Week</CardLabel>
          <CardValue>1,847</CardValue>
          <CardDesc>↑ 18%</CardDesc>
        </Card>
        <Card>
          <CardLabel>This Month</CardLabel>
          <CardValue>8,291</CardValue>
          <CardDesc>↑ 24%</CardDesc>
        </Card>
        <Card>
          <CardLabel>Unique Visitors</CardLabel>
          <CardValue>12,450</CardValue>
          <CardDesc>IP-deduplicated</CardDesc>
        </Card>
      </div>

      <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Top countries</div>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          {[
            { country: 'United States', pct: 34 },
            { country: 'Germany', pct: 12 },
            { country: 'United Kingdom', pct: 10 },
            { country: 'Brazil', pct: 8 },
            { country: 'Japan', pct: 6 },
          ].map((c) => (
            <div key={c.country} className="flex items-center justify-between py-1.5 text-xs">
              <span className="text-white/60">{c.country}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#c4b5fd]" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="font-mono text-[10px] text-white/40">{c.pct}%</span>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-white/25 mb-3">Devices</div>
          {[
            { device: 'Desktop', pct: 52 },
            { device: 'Mobile', pct: 40 },
            { device: 'Tablet', pct: 8 },
          ].map((d) => (
            <div key={d.device} className="flex items-center justify-between py-1.5 text-xs">
              <span className="text-white/60">{d.device}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#2dd4bf]" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="font-mono text-[10px] text-white/40">{d.pct}%</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </motion.div>
  );
}
