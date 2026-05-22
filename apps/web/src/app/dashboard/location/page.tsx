'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useProfile, type ProfileData } from '@/hooks/use-profile';
import { toast } from 'sonner';

export default function LocationPage() {
  const { profile, saveProfile } = useProfile();

  if (!profile) return null;

  const update = (key: keyof ProfileData, value: unknown) => {
    saveProfile({ [key]: value });
    toast.success('Saved');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Location Settings</CardLabel>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 text-xs text-white/60">Location text</div>
            <input
              value={profile.location || ''}
              onChange={(e) => update('location', e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs text-white/60">Timezone</div>
            <select
              value={profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
              onChange={(e) => update('timezone', e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
            >
              {Intl.supportedValuesOf('timeZone').map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Preview</CardLabel>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs">📍</span>
          <span className="text-xs text-white/70">{profile.location || 'No location set'}</span>
          {profile.timezone && (
            <span className="text-[10px] text-white/30">
              {new Date().toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
