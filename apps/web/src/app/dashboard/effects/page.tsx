'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

const bgEffects = [
  { id: 'particles', label: 'Particles', color: 'purple' },
  { id: 'stars', label: 'Stars', color: 'blue' },
  { id: 'snow', label: 'Snow', color: 'teal' },
  { id: 'rain', label: 'Rain', color: 'blue' },
  { id: 'sakura', label: 'Sakura', color: 'coral' },
  { id: 'smoke', label: 'Smoke', color: 'amber' },
  { id: 'matrix', label: 'Matrix', color: 'green' },
  { id: 'glow-waves', label: 'Glow Waves', color: 'purple' },
  { id: 'floating-orbs', label: 'Floating Orbs', color: 'teal' },
];

export default function EffectsPage() {
  const [intensity, setIntensity] = useState(50);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleEffect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Background Effects</CardLabel>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {bgEffects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => toggleEffect(effect.id)}
              className={`rounded-lg border p-3 text-center text-xs font-semibold transition-all ${
                selected.includes(effect.id)
                  ? 'border-[#c4b5fd] bg-[#c4b5fd]/12 text-[#c4b5fd]'
                  : 'border-white/7 bg-[#0d0d14] text-white/40 hover:border-white/20 hover:text-white/70'
              }`}
            >
              {effect.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Effect Intensity</CardLabel>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60">Intensity</span>
              <span className="font-mono text-[10px] text-[#c4b5fd]">{intensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#c4b5fd]"
            />
          </div>
        </Card>
        <Card>
          <CardLabel>Performance</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">GPU optimized</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Adaptive quality</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Low perf. fallback</span>
              <Toggle checked />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardLabel>Advanced Profile Effects</CardLabel>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: 'Card tilt', desc: '3D tilt on hover' },
            { label: 'Parallax', desc: 'Depth movement' },
            { label: 'Floating cards', desc: 'Levitation effect' },
            { label: 'Neon shadows', desc: 'Glow drop shadow' },
            { label: 'Blur layers', desc: 'Depth of field' },
            { label: 'Chromatic aberration', desc: 'RGB split' },
          ].map((effect) => (
            <div key={effect.label} className="flex flex-col items-start gap-1.5 rounded-lg border border-white/7 bg-[#0d0d14] p-3">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs font-semibold text-[#e8e6f0]">{effect.label}</span>
                <Toggle className="ml-auto" />
              </div>
              <span className="text-[10px] text-white/30">{effect.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
