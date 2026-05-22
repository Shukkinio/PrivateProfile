'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useProfile, type LinkData } from '@/hooks/use-profile';
import { toast } from 'sonner';
import { useState } from 'react';

const PLATFORMS = ['discord', 'github', 'twitch', 'youtube', 'tiktok', 'telegram', 'spotify', 'custom'];

export default function LinksPage() {
  const { links, saveLinks, saving } = useProfile();
  const [localLinks, setLocalLinks] = useState<LinkData[]>(links);

  const updateLink = (i: number, data: Partial<LinkData>) => {
    const updated = [...localLinks];
    updated[i] = { ...updated[i], ...data };
    setLocalLinks(updated);
  };

  const addLink = () => {
    setLocalLinks([...localLinks, {
      platform: 'custom',
      url: '',
      label: 'New Link',
      hidden: false,
      order: localLinks.length,
    }]);
  };

  const removeLink = (i: number) => {
    setLocalLinks(localLinks.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    await saveLinks(localLinks.map((l, i) => ({ ...l, order: i })));
    toast.success('Links saved!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Social Links</CardLabel>
        <div className="mt-3 flex justify-end gap-2 mb-3">
          <div className="text-[10px] text-white/30 self-center">{localLinks.length} links</div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#c4b5fd] px-3 py-1.5 text-[11px] font-semibold text-[#1a0a3c] hover:bg-[#d8ccff] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save links'}
          </button>
        </div>

        <div className="space-y-2">
          {localLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-white/7 bg-[#0d0d14] p-2.5">
              <select
                value={link.platform}
                onChange={(e) => updateLink(i, { platform: e.target.value })}
                className="h-7 w-20 rounded border border-white/5 bg-transparent px-1 text-[10px] text-white/70"
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <input
                value={link.label}
                onChange={(e) => updateLink(i, { label: e.target.value })}
                className="h-7 w-24 rounded border border-white/5 bg-transparent px-2 text-[11px] text-white/70"
                placeholder="Label"
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                className="h-7 flex-1 rounded border border-white/5 bg-transparent px-2 text-[11px] text-white/70"
                placeholder="https://..."
              />
              <Toggle
                checked={!link.hidden}
                onCheckedChange={(v) => updateLink(i, { hidden: !v })}
              />
              <button onClick={() => removeLink(i)} className="flex h-7 w-7 items-center justify-center rounded-md text-white/20 hover:bg-red-500/10 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
        <button
          onClick={addLink}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2 text-xs text-white/30 transition-all hover:border-[#c4b5fd]/30 hover:text-[#c4b5fd]"
        >
          + Add Link
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Link Settings</CardLabel>
          <div className="mt-3 space-y-3">
            {['Hover animation', 'Glow effect', 'Monochrome mode', 'Click analytics'].map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span className="text-xs text-white/60">{s}</span>
                <Toggle checked />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel>Click Stats</CardLabel>
          <div className="mt-3 text-[11px] text-white/30">
            {localLinks.length === 0
              ? 'No links yet. Add some to track clicks.'
              : localLinks.map(l => (
                  <div key={l.label} className="flex justify-between py-1">
                    <span className="text-white/60">{l.label}</span>
                    <span className="font-mono text-[#c4b5fd]">0 clicks</span>
                  </div>
                ))
            }
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
