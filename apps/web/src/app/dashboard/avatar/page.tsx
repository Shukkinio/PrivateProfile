'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

export default function AvatarPage() {
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('yourname');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Profile Avatar</CardLabel>
          <div className="mt-3 flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-full border border-white/10 bg-[#0d0d14] flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-[#c4b5fd]/25 px-4 py-3 transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4 w-full">
              <span className="text-xs text-white/35">
                <strong className="text-[#c4b5fd]">Click to upload</strong>
                <br />PNG / GIF / WEBP / APNG
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardLabel>Avatar Effects</CardLabel>
          <div className="mt-3 space-y-3">
            {[
              { label: 'Border glow', desc: 'Animated purple halo' },
              { label: 'Floating animation', desc: 'Gentle hover motion' },
              { label: 'Rotation effects', desc: 'Slow 3D rotation' },
              { label: 'Hover scale', desc: 'Enlarge on hover' },
            ].map((e) => (
              <div key={e.label} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#e8e6f0]">{e.label}</div>
                  <div className="text-[10px] text-white/30">{e.desc}</div>
                </div>
                <Toggle checked />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardLabel>Username</CardLabel>
        <div className="mt-3 space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
          />
          <div className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Username Effect</div>
          <div className="flex flex-wrap gap-2">
            {['gradient', 'rgb-glow', 'shimmer', 'glitch', 'typewriter', 'wave', 'fire', 'rainbow-pulse'].map((e) => (
              <button
                key={e}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  e === 'gradient'
                    ? 'border-[#c4b5fd] bg-[#c4b5fd]/12 text-[#c4b5fd]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Bio</CardLabel>
        <div className="mt-3 space-y-3">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            className="h-24 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 placeholder:text-white/25 resize-none"
          />
          <div className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Bio Effect</div>
          <div className="flex gap-2">
            {['fade-in', 'stagger-reveal', 'cursor-typing'].map((e) => (
              <button
                key={e}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  e === 'fade-in'
                    ? 'border-[#c4b5fd] bg-[#c4b5fd]/12 text-[#c4b5fd]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
