'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';

export default function ProEffectsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#fbbf24]">
          <span>✦</span> PRO Feature
        </div>
        <p className="mt-1 text-xs text-white/40">
          Upgrade to unlock advanced profile effects and exclusive animations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>3D & Motion</CardLabel>
          <div className="mt-3 space-y-3">
            {[
              { label: 'Card tilt', desc: '3D perspective on hover' },
              { label: 'Parallax depth', desc: 'Multi-layer movement' },
              { label: 'Floating cards', desc: 'Suspended levitation' },
              { label: 'Magnetic buttons', desc: 'Follow cursor attraction' },
            ].map((e) => (
              <div key={e.label} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white/40">{e.label}</div>
                  <div className="text-[10px] text-white/20">{e.desc}</div>
                </div>
                <Toggle />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel>Visual Effects</CardLabel>
          <div className="mt-3 space-y-3">
            {[
              { label: 'Neon shadows', desc: 'Colored glow drop shadow' },
              { label: 'Blur layers', desc: 'Depth of field effect' },
              { label: 'Chromatic aberration', desc: 'RGB color splitting' },
              { label: 'Ambient glow', desc: 'Soft surrounding light' },
            ].map((e) => (
              <div key={e.label} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white/40">{e.label}</div>
                  <div className="text-[10px] text-white/20">{e.desc}</div>
                </div>
                <Toggle />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardLabel>Profile Layouts</CardLabel>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { name: 'Centered', pro: false },
            { name: 'Fullscreen', pro: false },
            { name: 'Split', pro: false },
            { name: 'Minimal', pro: false },
            { name: 'Glass Card', pro: true },
            { name: 'Cyberpunk', pro: true },
            { name: 'Monochrome', pro: true },
            { name: 'Terminal', pro: true },
          ].map((layout) => (
            <div
              key={layout.name}
              className={`rounded-lg border p-3 text-center text-xs ${
                layout.pro
                  ? 'border-white/7 bg-[#0d0d14] opacity-50'
                  : 'border-[#c4b5fd]/20 bg-[#c4b5fd]/8 text-[#c4b5fd]'
              }`}
            >
              {layout.name}
              {layout.pro && <div className="mt-1 text-[9px] text-[#fbbf24]">PRO</div>}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
