'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

const defaultLinks = [
  { platform: 'github', label: 'GitHub', url: 'https://github.com/yourname', hidden: false },
  { platform: 'twitter', label: 'Twitter / X', url: 'https://x.com/yourname', hidden: false },
  { platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@yourname', hidden: false },
  { platform: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/user/yourname', hidden: true },
  { platform: 'discord', label: 'Discord Server', url: 'https://discord.gg/yourname', hidden: false },
];

export default function LinksPage() {
  const [links, setLinks] = useState(defaultLinks);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Social Links</CardLabel>
        <div className="mt-3 space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-white/7 bg-[#0d0d14] p-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-xs">⊹</span>
              <input
                value={link.label}
                onChange={(e) => {
                  const updated = [...links];
                  updated[i] = { ...updated[i], label: e.target.value };
                  setLinks(updated);
                }}
                className="h-7 w-28 rounded border border-white/5 bg-transparent px-2 text-[11px] text-white/70"
              />
              <input
                value={link.url}
                onChange={(e) => {
                  const updated = [...links];
                  updated[i] = { ...updated[i], url: e.target.value };
                  setLinks(updated);
                }}
                className="h-7 flex-1 rounded border border-white/5 bg-transparent px-2 text-[11px] text-white/70"
              />
              <Toggle
                checked={!link.hidden}
                onCheckedChange={(v) => {
                  const updated = [...links];
                  updated[i] = { ...updated[i], hidden: !v };
                  setLinks(updated);
                }}
              />
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-white/20 hover:bg-red-500/10 hover:text-red-400 text-xs">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2 text-xs text-white/30 transition-all hover:border-[#c4b5fd]/30 hover:text-[#c4b5fd]">
          + Add Link
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Link Settings</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Hover animation</div>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Glow effect</div>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Monochrome mode</div>
              <Toggle />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Click analytics</div>
              <Toggle checked />
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Click Stats</CardLabel>
          <div className="mt-3 space-y-2">
            {['GitHub', 'YouTube', 'Discord', 'Spotify'].map((name) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <span className="text-white/60">{name}</span>
                <span className="font-mono text-[#c4b5fd]">{Math.floor(Math.random() * 500)} clicks</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
