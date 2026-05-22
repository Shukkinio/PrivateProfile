'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from 'ui';
import { useState } from 'react';

const presets = [
  { name: 'Neon Void', color: '#c4b5fd' },
  { name: 'Monochrome', color: '#e8e6f0' },
  { name: 'Dracula', color: '#ff79c6' },
  { name: 'Glass', color: '#60a5fa' },
  { name: 'Cyberpunk', color: '#fbbf24' },
  { name: 'Minimal White', color: '#ffffff' },
  { name: 'Terminal', color: '#34d399' },
];

export default function ColorsPage() {
  const [accent, setAccent] = useState('#c4b5fd');
  const [glow, setGlow] = useState(50);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Accent Color</CardLabel>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
          <input
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-sm text-white/80"
          />
        </div>
      </Card>

      <Card>
        <CardLabel>Theme Presets</CardLabel>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => setAccent(p.color)}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-white/7 bg-[#0d0d14] p-3 transition-all hover:border-[#c4b5fd]/30"
            >
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[9px] text-white/40">{p.name}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Glow Settings</CardLabel>
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/60">Glow intensity</span>
                <span className="font-mono text-[10px] text-[#c4b5fd]">{glow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={glow}
                onChange={(e) => setGlow(Number(e.target.value))}
                className="w-full accent-[#c4b5fd]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Animated glow</div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="h-[19px] w-[34px] rounded-full border border-[#c4b5fd] bg-[#c4b5fd] after:absolute after:left-[17px] after:top-[2px] after:h-[13px] after:w-[13px] after:rounded-full after:bg-[#1a0a3c] after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Neon shadow</div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="h-[19px] w-[34px] rounded-full border border-[#c4b5fd] bg-[#c4b5fd] after:absolute after:left-[17px] after:top-[2px] after:h-[13px] after:w-[13px] after:rounded-full after:bg-[#1a0a3c] after:transition-all" />
              </label>
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Preview</CardLabel>
          <div className="mt-3 flex items-center justify-center rounded-lg border border-white/7 bg-[#0d0d14] p-6">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: `${accent}20`,
                color: accent,
                boxShadow: `0 0 ${glow}px ${accent}40`,
              }}
            >
              A
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
