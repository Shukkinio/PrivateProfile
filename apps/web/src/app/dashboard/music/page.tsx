'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, title: 'Midnight Dreams', artist: 'Lofi Girl', duration: '3:24' },
    { id: 2, title: 'Neon Lights', artist: 'Synthwave', duration: '4:12' },
    { id: 3, title: 'Crystal Rain', artist: 'Ambient', duration: '5:00' },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Music Playlist</CardLabel>
        <div className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-4 py-5 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4">
          <div className="text-2xl text-[#c4b5fd]/50">♫</div>
          <div className="text-xs text-white/35">
            <strong className="text-[#c4b5fd]">Upload MP3 / OGG / WAV</strong>
            <br />Files play in order · max 20MB each
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {tracks.map((track, i) => (
            <div key={track.id} className="flex items-center gap-3 rounded-lg border border-white/7 bg-[#0d0d14] p-2.5">
              <span className="w-4 text-center text-[10px] text-white/30">{i + 1}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#c4b5fd]/12 text-[11px] text-[#c4b5fd]">▶</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e8e6f0]">{track.title}</div>
                <div className="text-[10px] text-white/30">{track.artist}</div>
              </div>
              <span className="font-mono text-[10px] text-white/30">{track.duration}</span>
              <button className="text-[10px] text-white/20 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Playback Settings</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Autoplay</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Shuffle</span>
              <Toggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Loop all</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Crossfade</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Persistent playback</span>
              <Toggle checked />
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Crossfade Duration</CardLabel>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60">Duration</span>
              <span className="font-mono text-[10px] text-[#c4b5fd]">3s</span>
            </div>
            <input type="range" min="0" max="10" defaultValue={3} className="w-full accent-[#c4b5fd]" />
          </div>
          <div className="mt-4">
            <div className="mb-1.5 text-xs text-white/60">Playback quality</div>
            <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
              <option>Auto</option>
              <option>Low (64kbps)</option>
              <option>Medium (128kbps)</option>
              <option>High (320kbps)</option>
            </select>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
