'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toggle } from 'ui';

export default function PreviewPage() {
  const [mode, setMode] = useState<'desktop' | 'mobile' | 'split'>('desktop');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-white/7 bg-[#111118] p-3">
        {(['desktop', 'mobile', 'split'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              mode === m
                ? 'bg-[#c4b5fd] text-[#1a0a3c]'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {m === 'desktop' ? '🖥 Desktop' : m === 'mobile' ? '📱 Mobile' : '⇆ Split'}
          </button>
        ))}
      </div>

      {mode === 'split' ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[9/16] max-h-[70vh] rounded-xl border border-white/7 bg-[#0d0d14] flex items-center justify-center text-white/20 text-sm">
            Mobile Preview
          </div>
          <div className="aspect-video max-h-[70vh] rounded-xl border border-white/7 bg-[#0d0d14] flex items-center justify-center text-white/20 text-sm">
            Desktop Preview
          </div>
        </div>
      ) : (
        <div
          className={`rounded-xl border border-white/7 bg-[#0d0d14] ${
            mode === 'mobile'
              ? 'mx-auto aspect-[9/16] max-h-[70vh] max-w-[360px]'
              : 'aspect-video max-h-[70vh]'
          } flex items-center justify-center text-white/20`}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">👤</div>
            <div className="text-sm">Real-time preview loading...</div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/7 bg-[#111118] p-4 space-y-3">
        <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">
          Preview Settings
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Auto-refresh on changes</span>
          <Toggle checked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Show background effects</span>
          <Toggle checked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Show music player</span>
          <Toggle />
        </div>
      </div>
    </motion.div>
  );
}
