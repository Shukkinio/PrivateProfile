'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-xl">
        <button
          onClick={() => setPlaying(!playing)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c4b5fd]/20 text-sm text-[#c4b5fd] transition-all hover:bg-[#c4b5fd]/30"
        >
          {playing ? '⏸' : '▶'}
        </button>

        <div className="flex flex-col">
          <div className="text-xs font-semibold text-white/80">Midnight Dreams</div>
          <div className="text-[10px] text-white/30">Lofi Girl</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#c4b5fd]"
              style={{ width: `${progress}%` }}
              animate={playing ? { width: [ `${progress}%`, '100%' ] } : {}}
              transition={{ duration: 60, ease: 'linear' }}
            />
          </div>
          <span className="font-mono text-[10px] text-white/30">1:23</span>
        </div>

        <div className="flex items-center gap-1">
          {playing && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full bg-[#c4b5fd]/60"
              animate={{ height: [4, 12 + Math.random() * 8, 4] }}
              transition={{ duration: 0.5 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>

        <button className="text-xs text-white/30 hover:text-white">♫</button>
      </div>
    </motion.div>
  );
}
