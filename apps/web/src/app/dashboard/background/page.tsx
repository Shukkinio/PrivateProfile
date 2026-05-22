'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from 'ui';
import { UploadZone } from '@/components/dashboard/upload-zone';
import { useProfile, type ProfileData } from '@/hooks/use-profile';
import { toast } from 'sonner';

export default function BackgroundPage() {
  const { profile, saveProfile } = useProfile();

  if (!profile) return null;

  const update = (key: keyof ProfileData, value: unknown) => {
    saveProfile({ [key]: value });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Background Video</CardLabel>
          <div className="mt-3">
            <UploadZone
              folder="background"
              accept="video/mp4,video/webm"
              label="Upload video"
              hint="MP4 / WebM · max 50MB"
              icon="▶"
              onUpload={(url) => { update('bgVideoUrl', url); toast.success('Background video set!'); }}
              currentUrl={profile.bgVideoUrl}
            />
            {profile.bgVideoUrl && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-[#34d399]">✓ Video uploaded</span>
                <button onClick={() => update('bgVideoUrl', '')} className="text-[10px] text-red-400/50 hover:text-red-400">Remove</button>
              </div>
            )}
          </div>
        </Card>
        <Card>
          <CardLabel>Video Adjustments</CardLabel>
          <div className="mt-3 grid grid-cols-2 gap-4">
            {[
              { label: 'Blur', key: 'blurAmount', unit: 'px' },
              { label: 'Brightness', key: 'brightness', unit: '%' },
              { label: 'Saturation', key: 'saturation', unit: '%' },
            ].map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">{s.label}</span>
                  <span className="font-mono text-[10px] text-[#c4b5fd]">{String(profile[s.key as keyof ProfileData] ?? 100)}{s.unit}</span>
                </div>
                <input
                  type="range" min="0" max="200"
                  value={Number(profile[s.key as keyof ProfileData] ?? 100)}
                  onChange={(e) => update(s.key as keyof ProfileData, Number(e.target.value))}
                  className="w-full accent-[#c4b5fd]"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
