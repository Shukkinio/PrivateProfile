'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

export default function AudioWidgetPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Player Widget Settings</CardLabel>
        <div className="mt-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#e8e6f0]">Show player on profile</div>
              <div className="text-[10px] text-white/30">Display live music player widget</div>
            </div>
            <Toggle checked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#e8e6f0]">Draggable widget</div>
              <div className="text-[10px] text-white/30">Users can drag player around</div>
            </div>
            <Toggle checked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#e8e6f0]">Waveform visualizer</div>
              <div className="text-[10px] text-white/30">Animated audio waveform</div>
            </div>
            <Toggle checked />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Widget Preview</CardLabel>
          <div className="mt-3 flex flex-col gap-2 rounded-lg border border-white/7 bg-[#0d0d14] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c4b5fd]/12 text-[#c4b5fd]">▶</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-white/10">
                    <div className="h-full w-1/2 rounded-full bg-[#c4b5fd]" />
                  </div>
                  <span className="font-mono text-[10px] text-white/30">1:23</span>
                </div>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-[#c4b5fd]/50"
                      style={{ height: `${Math.random() * 16 + 4}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-white/40">
              <span className="text-xs cursor-pointer hover:text-white">⏮</span>
              <span className="text-base cursor-pointer hover:text-white">⏸</span>
              <span className="text-xs cursor-pointer hover:text-white">⏭</span>
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Widget Style</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Compact mode</span>
              <Toggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Show volume slider</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Show equalizer</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Glass background</span>
              <Toggle checked />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
