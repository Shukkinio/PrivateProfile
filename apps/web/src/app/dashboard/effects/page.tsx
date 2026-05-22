'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from 'ui';
import { useProfile, type ProfileData } from '@/hooks/use-profile';
import { toast } from 'sonner';

const bgEffects = [
  { id: 'particles', label: 'Particles' },
  { id: 'stars', label: 'Stars' },
  { id: 'snow', label: 'Snow' },
  { id: 'rain', label: 'Rain' },
  { id: 'sakura', label: 'Sakura' },
  { id: 'smoke', label: 'Smoke' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'glow-waves', label: 'Glow Waves' },
  { id: 'floating-orbs', label: 'Floating Orbs' },
];

export default function EffectsPage() {
  const { profile, saveProfile } = useProfile();

  if (!profile) return null;

  const activeEffects: string[] = profile.bgEffects || [];

  const toggleEffect = (id: string) => {
    const updated = activeEffects.includes(id)
      ? activeEffects.filter((e) => e !== id)
      : [...activeEffects, id];
    saveProfile({ bgEffects: updated });
    toast.success(updated.includes(id) ? `${id} enabled` : `${id} disabled`);
  };

  const update = (key: keyof ProfileData, value: unknown) => saveProfile({ [key]: value });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Background Effects</CardLabel>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {bgEffects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => toggleEffect(effect.id)}
              className={`rounded-lg border p-3 text-center text-xs font-semibold transition-all ${
                activeEffects.includes(effect.id)
                  ? 'border-[#c4b5fd] bg-[#c4b5fd]/12 text-[#c4b5fd]'
                  : 'border-white/7 bg-[#0d0d14] text-white/40 hover:border-white/20 hover:text-white/70'
              }`}
            >
              {effect.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardLabel>Effect Intensity</CardLabel>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60">Intensity</span>
            <span className="font-mono text-[10px] text-[#c4b5fd]">{profile.effectIntensity}%</span>
          </div>
          <input
            type="range" min="0" max="100"
            value={profile.effectIntensity}
            onChange={(e) => update('effectIntensity', Number(e.target.value))}
            className="w-full accent-[#c4b5fd]"
          />
        </div>
      </Card>
    </motion.div>
  );
}
