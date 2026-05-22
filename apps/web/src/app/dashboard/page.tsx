'use client';

import { motion } from 'framer-motion';
import { useProfile, type ProfileData } from '@/hooks/use-profile';
import { useUpload } from '@/hooks/use-upload';
import { UploadZone } from '@/components/dashboard/upload-zone';
import { FeatureCard } from '@/components/dashboard/feature-card';
import { Card, CardHeader, CardLabel, CardValue, CardDesc } from 'ui';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function DashboardPage() {
  const { profile, links, tracks, loading, saveProfile } = useProfile();

  const handleToggle = async (key: keyof ProfileData, value: boolean) => {
    await saveProfile({ [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-[#c4b5fd] text-sm">Loading profile...</div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
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
                <span className="rounded-md border border-[#2dd4bf]/20 bg-[#2dd4bf]/12 px-2 py-[2px] font-mono text-[10px] font-medium text-[#2dd4bf]">↑ 18% this week</span>
                <span className="rounded-md border border-[#fbbf24]/20 bg-[#fbbf24]/12 px-2 py-[2px] font-mono text-[10px] font-medium text-[#fbbf24]">+203 today</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Quick stats</div>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardHeader>
              <CardLabel>Music tracks</CardLabel>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c4b5fd]/12 text-[14px] text-[#c4b5fd]">♫</div>
            </CardHeader>
            <CardValue>{tracks.length}</CardValue>
            <CardDesc>{tracks.length > 0 ? 'queued' : 'no tracks added'}</CardDesc>
          </Card>
          <Card>
            <CardHeader>
              <CardLabel>Links</CardLabel>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2dd4bf]/12 text-[14px] text-[#2dd4bf]">⊹</div>
            </CardHeader>
            <CardValue>{links.length}</CardValue>
            <CardDesc>{links.filter(l => !l.hidden).length} active · {links.filter(l => l.hidden).length} hidden</CardDesc>
          </Card>
          <Card>
            <CardHeader>
              <CardLabel>Display name</CardLabel>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#60a5fa]/12 text-[14px] text-[#60a5fa]">◒</div>
            </CardHeader>
            <CardValue>{profile?.displayName || '—'}</CardValue>
            <CardDesc>{profile?.bio ? 'bio set' : 'no bio yet'}</CardDesc>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Media uploads</div>
        <div className="grid grid-cols-2 gap-3">
          <UploadZone
            folder="background"
            accept="video/mp4,video/webm"
            label="Background video"
            hint="MP4 / WebM · max 50MB"
            icon="▶"
            onUpload={(url) => { saveProfile({ bgVideoUrl: url }); toast.success('Background video uploaded'); }}
            currentUrl={profile?.bgVideoUrl}
          />
          <UploadZone
            folder="music"
            accept="audio/mpeg,audio/ogg,audio/wav"
            label="Add music track"
            hint="MP3 / OGG · plays in order"
            icon="♫"
            onUpload={(url) => { toast.success('Track uploaded, add it in the Music panel'); }}
          />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">Feature toggles</div>
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard icon="◂" iconColor="purple" title="Custom cursor" description="Upload a .cur or .png"
            checked={profile?.customCursor} onToggle={(v) => handleToggle('customCursor', v)} />
          <FeatureCard icon="▸" iconColor="teal" title="Click-to-enter intro" description="Splash gate before profile"
            checked={profile?.introEnabled} onToggle={(v) => handleToggle('introEnabled', v)} />
          <FeatureCard icon="✦" iconColor="amber" title="Background effects" description="Particles, snow, stars…"
            checked={false} onToggle={() => {}} />
          <FeatureCard icon="T" iconColor="coral" title="Typewriter animation" description="Username / bio effect" />
          <FeatureCard icon="◇" iconColor="blue" title="Discord presence" description="Live status + decoration"
            checked={profile?.discordPresence} onToggle={(v) => handleToggle('discordPresence', v)} />
          <FeatureCard icon="▶" iconColor="green" title="MP3 player widget" description="Shown live on profile"
            checked={profile?.musicWidget} onToggle={(v) => handleToggle('musicWidget', v)} />
        </div>
      </motion.div>
    </motion.div>
  );
}
