'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from 'ui';
import { useState } from 'react';

const googleFonts = [
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Syne', family: 'Syne, sans-serif' },
  { name: 'DM Mono', family: 'DM Mono, monospace' },
  { name: 'Space Grotesk', family: 'Space Grotesk, sans-serif' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono, monospace' },
  { name: 'Clash Display', family: 'Clash Display, sans-serif' },
  { name: 'Cabinet Grotesk', family: 'Cabinet Grotesk, sans-serif' },
  { name: 'Satoshi', family: 'Satoshi, sans-serif' },
  { name: 'General Sans', family: 'General Sans, sans-serif' },
];

export default function FontsPage() {
  const [selectedFont, setSelectedFont] = useState('Syne');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Profile Font</CardLabel>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {googleFonts.map((font) => (
            <button
              key={font.name}
              onClick={() => setSelectedFont(font.name)}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedFont === font.name
                  ? 'border-[#c4b5fd] bg-[#c4b5fd]/12'
                  : 'border-white/7 bg-[#0d0d14] hover:border-white/20'
              }`}
            >
              <div className="text-sm font-semibold text-[#e8e6f0]" style={{ fontFamily: font.family }}>
                {font.name}
              </div>
              <div className="mt-1 text-[10px] text-white/30">Aa Bb Cc 123</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Font Settings</CardLabel>
          <div className="mt-3 space-y-4">
            <div>
              <div className="mb-1 text-xs text-white/60">Font size</div>
              <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
                {[12, 13, 14, 15, 16, 18, 20, 24].map((s) => (
                  <option key={s} selected={s === 14}>{s}px</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-1 text-xs text-white/60">Letter spacing</div>
              <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
                {['-0.02em', '-0.01em', 'normal', '0.01em', '0.02em', '0.05em', '0.1em'].map((s) => (
                  <option key={s} selected={s === 'normal'}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-1 text-xs text-white/60">Font weight</div>
              <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
                {[300, 400, 500, 600, 700, 800].map((w) => (
                  <option key={w} selected={w === 600}>{w}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Font Pairing</CardLabel>
          <div className="mt-3 space-y-4">
            <div>
              <div className="mb-1 text-xs text-white/60">Heading font</div>
              <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
                {googleFonts.map((f) => (
                  <option key={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-1 text-xs text-white/60">Body font</div>
              <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
                {googleFonts.map((f) => (
                  <option key={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardLabel>Live Preview</CardLabel>
        <div className="mt-3 rounded-lg border border-white/7 bg-[#0d0d14] p-4">
          <div className="text-2xl font-bold text-[#e8e6f0]" style={{ fontFamily: selectedFont }}>
            The quick brown fox
          </div>
          <div className="mt-1 text-sm text-white/50" style={{ fontFamily: selectedFont }}>
            jumps over the lazy dog. 1234567890
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
