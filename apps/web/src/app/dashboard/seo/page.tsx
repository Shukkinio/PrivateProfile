'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useProfile, type ProfileData } from '@/hooks/use-profile';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SEOPage() {
  const { profile, saveProfile } = useProfile();

  if (!profile) return null;

  const update = (key: keyof ProfileData, value: unknown) => {
    saveProfile({ [key]: value });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Search Engine Preview</CardLabel>
        <div className="mt-3 rounded-lg border border-white/7 bg-[#0d0d14] p-4">
          <div className="text-sm text-[#8ab4f8]">{profile.seoTitle || `${profile.displayName || 'User'} · ProfileOS`}</div>
          <div className="text-xs text-[#bdc1c6]">profileos.netlify.app/{profile.displayName?.toLowerCase() || 'user'}</div>
          <div className="mt-1 text-xs text-[#9aa0a6]">{profile.seoDesc || 'Check out my profile on ProfileOS'}</div>
        </div>
      </Card>

      <Card>
        <CardLabel>Meta Tags</CardLabel>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 text-xs text-white/60">Page title</div>
            <input
              value={profile.seoTitle || ''}
              onChange={(e) => update('seoTitle', e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs text-white/60">Description</div>
            <textarea
              value={profile.seoDesc || ''}
              onChange={(e) => update('seoDesc', e.target.value)}
              rows={3}
              className="h-20 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 resize-none"
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Embed Color</CardLabel>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={profile.embedColor || '#c4b5fd'}
            onChange={(e) => update('embedColor', e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
          <input
            value={profile.embedColor || '#c4b5fd'}
            onChange={(e) => update('embedColor', e.target.value)}
            className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-sm text-white/80"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between rounded-xl border border-white/7 bg-[#111118] p-4">
        <div>
          <div className="text-xs font-semibold text-[#e8e6f0]">Animated tab title</div>
          <div className="text-[10px] text-white/30">Tab title animates with notifications</div>
        </div>
        <Toggle
          checked={profile.animatedTitle || false}
          onCheckedChange={(v) => update('animatedTitle', v)}
        />
      </div>
    </motion.div>
  );
}
