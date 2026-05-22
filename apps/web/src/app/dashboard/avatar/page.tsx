'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useProfile, type ProfileData } from '@/hooks/use-profile';
import { toast } from 'sonner';

export default function AvatarPage() {
  const { profile, saveProfile, saving } = useProfile();

  if (!profile) return null;

  const update = (key: keyof ProfileData, value: unknown) => {
    saveProfile({ [key]: value });
    toast.success('Saved');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Profile Avatar</CardLabel>
          <div className="mt-3 flex flex-col items-center gap-3">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-[#0d0d14] flex items-center justify-center text-3xl">
              {profile.displayName?.[0] || '👤'}
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
              { label: 'Border glow', key: 'glowIntensity', type: 'range' },
              { label: 'Floating animation', key: null },
              { label: 'Rotation effects', key: null },
              { label: 'Hover scale', key: null },
            ].map((e) => (
              <div key={e.label} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#e8e6f0]">{e.label}</div>
                  <div className="text-[10px] text-white/30">Visual effect</div>
                </div>
                <Toggle />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardLabel>Display Name</CardLabel>
        <div className="mt-3">
          <input
            value={profile.displayName}
            onChange={(e) => update('displayName', e.target.value)}
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
            placeholder="Your display name"
          />
          <div className="mt-1 text-[10px] text-white/30">
            {saving ? 'Saving...' : 'Changes auto-save'}
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Username Effect</CardLabel>
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {['gradient', 'rgb-glow', 'shimmer', 'glitch', 'typewriter', 'wave', 'fire', 'rainbow-pulse'].map((e) => (
              <button
                key={e}
                onClick={() => update('usernameEffect', e)}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  profile.usernameEffect === e
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
        <div className="mt-3">
          <textarea
            value={profile.bio}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Write something about yourself..."
            className="h-24 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 placeholder:text-white/25 resize-none"
          />
          <div className="mt-1 flex justify-between text-[10px] text-white/30">
            <span>{profile.bio.length}/500 characters</span>
            <span>{saving ? 'Saving...' : ''}</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Bio Effect</CardLabel>
        <div className="mt-3 flex gap-2">
          {['fade-in', 'stagger-reveal', 'cursor-typing'].map((e) => (
            <button
              key={e}
              onClick={() => update('bioEffect', e)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                profile.bioEffect === e
                  ? 'border-[#c4b5fd] bg-[#c4b5fd]/12 text-[#c4b5fd]'
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
