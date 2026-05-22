'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from '@/components/dashboard/feature-card';
import { Card, CardHeader, CardLabel, CardValue, CardDesc } from 'ui';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function DashboardPage() {
  const [toggles, setToggles] = useState({
    customCursor: true,
    introScreen: true,
    bgEffects: false,
    typewriter: true,
    discordPresence: true,
    mp3Widget: true,
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
      {/* View Counter Bar */}
      <motion.div variants={item}>
        <div className="rounded-xl border border-[#c4b5fd]/15 bg-[#0d1117] px-[18px] py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 font-mono text-[9px] font-medium uppercase tracking-wider text-white/30">
                total profile views
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[28px] font-extrabold text-[#c4b5fd]">48,291</span>
                <span className="text-xs text-white/35">unique visitors · IP-deduplicated</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#34d399]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#34d399] animate-pulse" />
                12 online now
              </div>
              <div className="flex gap-2">
                <span className="rounded-md border border-[#2dd4bf]/20 bg-[#2dd4bf]/12 px-2 py-[2px] font-mono text-[10px] font-medium text-[#2dd4bf]">
                  ↑ 18% this week
                </span>
                <span className="rounded-md border border-[#fbbf24]/20 bg-[#fbbf24]/12 px-2 py-[2px] font-mono text-[10px] font-medium text-[#fbbf24]">
                  +203 today
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">
          Quick stats
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardHeader>
              <CardLabel>Music tracks</CardLabel>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c4b5fd]/12 text-[14px] text-[#c4b5fd]">
                ♫
              </div>
            </CardHeader>
            <CardValue>3</CardValue>
            <CardDesc>queued · shuffle off</CardDesc>
          </Card>
          <Card>
            <CardHeader>
              <CardLabel>Links</CardLabel>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2dd4bf]/12 text-[14px] text-[#2dd4bf]">
                ⊹
              </div>
            </CardHeader>
            <CardValue>7</CardValue>
            <CardDesc>5 active · 2 hidden</CardDesc>
          </Card>
          <Card>
            <CardHeader>
              <CardLabel>Images hosted</CardLabel>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#60a5fa]/12 text-[14px] text-[#60a5fa]">
                ⊞
              </div>
            </CardHeader>
            <CardValue>24</CardValue>
            <CardDesc>142 MB used</CardDesc>
          </Card>
        </div>
      </motion.div>

      {/* Media Uploads */}
      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">
          Media uploads
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-[#c4b5fd]/25 px-[18px] py-4 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4">
            <div className="text-[22px] text-[#c4b5fd]/50">▶</div>
            <div className="text-[11.5px] text-white/35">
              <strong className="text-[#c4b5fd]">Background video</strong>
              <br />
              MP4 / WebM · max 50MB
            </div>
          </div>
          <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-[#c4b5fd]/25 px-[18px] py-4 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4">
            <div className="text-[22px] text-[#c4b5fd]/50">♫</div>
            <div className="text-[11.5px] text-white/35">
              <strong className="text-[#c4b5fd]">Add music track</strong>
              <br />
              MP3 / OGG · plays in order
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Toggles */}
      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">
          Feature toggles
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon="◂"
            iconColor="purple"
            title="Custom cursor"
            description="Upload a .cur or .png"
            checked={toggles.customCursor}
            onToggle={(v) => setToggles((t) => ({ ...t, customCursor: v }))}
          />
          <FeatureCard
            icon="▸"
            iconColor="teal"
            title="Click-to-enter intro"
            description="Splash gate before profile"
            checked={toggles.introScreen}
            onToggle={(v) => setToggles((t) => ({ ...t, introScreen: v }))}
          />
          <FeatureCard
            icon="✦"
            iconColor="amber"
            title="Background effects"
            description="Particles, snow, stars…"
            checked={toggles.bgEffects}
            onToggle={(v) => setToggles((t) => ({ ...t, bgEffects: v }))}
          />
          <FeatureCard
            icon="T"
            iconColor="coral"
            title="Typewriter animation"
            description="Username / bio effect"
            checked={toggles.typewriter}
            onToggle={(v) => setToggles((t) => ({ ...t, typewriter: v }))}
          />
          <FeatureCard
            icon="◇"
            iconColor="blue"
            title="Discord presence"
            description="Live status + decoration"
            checked={toggles.discordPresence}
            onToggle={(v) => setToggles((t) => ({ ...t, discordPresence: v }))}
          />
          <FeatureCard
            icon="▶"
            iconColor="green"
            title="MP3 player widget"
            description="Shown live on profile"
            checked={toggles.mp3Widget}
            onToggle={(v) => setToggles((t) => ({ ...t, mp3Widget: v }))}
          />
        </div>
      </motion.div>

      {/* Pro & Advanced */}
      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">
          Pro & advanced
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FeatureCard
            compact
            icon="▦"
            iconColor="purple"
            title="Profile layouts"
            description=""
            badge="PRO"
          />
          <FeatureCard
            compact
            icon="✦"
            iconColor="amber"
            title="Exclusive badges"
            description=""
            badge="PRO"
          />
          <FeatureCard
            compact
            icon="◎"
            iconColor="teal"
            title="SEO & metadata"
            description=""
            badge="ALL"
            badgeColor="teal"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
