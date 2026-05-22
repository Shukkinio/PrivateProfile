'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

export default function BackgroundPage() {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [opacity, setOpacity] = useState(100);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Background Video</CardLabel>
          <div className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-4 py-6 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4">
            <div className="text-2xl text-[#c4b5fd]/50">▶</div>
            <div className="text-xs text-white/35">
              <strong className="text-[#c4b5fd]">Upload video</strong>
              <br />MP4 / WebM · max 50MB
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/60">Current: none</span>
            <button className="text-[10px] text-red-400/50 hover:text-red-400">Remove</button>
          </div>
        </Card>
        <Card>
          <CardLabel>Mobile Fallback</CardLabel>
          <div className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-4 py-6 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4">
            <div className="text-2xl text-[#c4b5fd]/50">⊞</div>
            <div className="text-xs text-white/35">
              <strong className="text-[#c4b5fd]">Upload image</strong>
              <br />PNG / JPG / WebP
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardLabel>Video Adjustments</CardLabel>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {[
            { label: 'Blur', value: blur, set: setBlur, unit: 'px' },
            { label: 'Brightness', value: brightness, set: setBrightness, unit: '%' },
            { label: 'Saturation', value: saturation, set: setSaturation, unit: '%' },
            { label: 'Opacity', value: opacity, set: setOpacity, unit: '%' },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/60">{s.label}</span>
                <span className="font-mono text-[10px] text-[#c4b5fd]">{s.value}{s.unit}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-[#c4b5fd]"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Overlay Gradient</CardLabel>
          <div className="mt-3 flex gap-2">
            <input type="color" defaultValue="#000000" className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
            <span className="self-center text-white/20 text-xs">→</span>
            <input type="color" defaultValue="#000000" className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
            <select className="ml-auto h-9 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white/60">
              <option>to bottom</option>
              <option>to top</option>
              <option>to right</option>
              <option>to left</option>
            </select>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/60">Enable overlay</span>
            <Toggle checked />
          </div>
        </Card>
        <Card>
          <CardLabel>Quality Settings</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Auto quality</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Low perf fallback</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">GPU acceleration</span>
              <Toggle checked />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
