'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';

export default function DiscordPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Discord Connection</CardLabel>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/20 text-[#5865F2] text-lg">◆</div>
            <div>
              <div className="text-sm font-semibold text-[#e8e6f0]">Not connected</div>
              <div className="text-[10px] text-white/30">Connect to show live presence</div>
            </div>
          </div>
          <button className="rounded-lg bg-[#5865F2] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#4752C4]">
            Connect Discord
          </button>
        </div>
      </Card>

      <Card>
        <CardLabel>Presence Settings</CardLabel>
        <div className="mt-3 space-y-3">
          {[
            { label: 'Show Discord avatar', desc: 'Use Discord avatar as profile avatar' },
            { label: 'Show avatar decoration', desc: 'Display Nitro decoration border' },
            { label: 'Show status', desc: 'Online/idle/dnd status indicator' },
            { label: 'Show activity', desc: 'Currently playing game or app' },
            { label: 'Show Spotify activity', desc: 'Currently listening to on Spotify' },
            { label: 'Show custom status', desc: 'Your Discord custom status text' },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#e8e6f0]">{s.label}</div>
                <div className="text-[10px] text-white/30">{s.desc}</div>
              </div>
              <Toggle checked />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Real-time Updates</CardLabel>
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[#34d399]">WebSocket connected</span>
            </div>
            <div className="mt-2 text-[10px] text-white/30">
              Presence updates in real-time via WebSocket
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Preview</CardLabel>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/7 bg-[#0d0d14] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865F2]/30 text-xs">D</div>
            <div>
              <div className="text-xs font-semibold text-white/80">username#0000</div>
              <div className="flex items-center gap-1 text-[10px] text-white/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" /> Online
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
