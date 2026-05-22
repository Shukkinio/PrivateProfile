'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

interface Image {
  id: number;
  name: string;
  size: string;
  type: string;
  date: string;
}

export default function ImagesPage() {
  const [images] = useState<Image[]>([
    { id: 1, name: 'avatar.png', size: '2.4 MB', type: 'PNG', date: '2 hours ago' },
    { id: 2, name: 'background.mp4', size: '24.1 MB', type: 'MP4', date: '1 day ago' },
    { id: 3, name: 'banner.webp', size: '1.2 MB', type: 'WEBP', date: '3 days ago' },
    { id: 4, name: 'track-01.mp3', size: '8.7 MB', type: 'MP3', date: '1 week ago' },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Upload Files</CardLabel>
        <div className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-4 py-6 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4">
          <div className="text-2xl text-[#c4b5fd]/50">⊞</div>
          <div className="text-xs text-white/35">
            <strong className="text-[#c4b5fd]">Drop files or click to upload</strong>
            <br />PNG / JPG / WEBP / GIF / MP3 / MP4
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Your Files</CardLabel>
        <div className="mt-3 space-y-1">
          {images.map((img) => (
            <div key={img.id} className="flex items-center gap-3 rounded-lg border border-white/7 bg-[#0d0d14] p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#c4b5fd]/12 text-[11px] text-[#c4b5fd]">
                {img.type === 'MP3' ? '♫' : img.type === 'MP4' ? '▶' : '⊞'}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e8e6f0]">{img.name}</div>
                <div className="text-[10px] text-white/30">{img.size} · {img.date}</div>
              </div>
              <div className="flex gap-1">
                <button className="rounded px-2 py-1 text-[10px] text-white/30 hover:text-white">Copy URL</button>
                <button className="rounded px-2 py-1 text-[10px] text-white/20 hover:text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Upload Settings</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Auto-compress</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Auto-optimize</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Public by default</span>
              <Toggle checked />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 text-xs text-white/60">Expiration</div>
            <select className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80">
              <option>Never</option>
              <option>1 hour</option>
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </div>
        </Card>
        <Card>
          <CardLabel>Storage Stats</CardLabel>
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/60">Used</span>
                <span className="font-mono text-[10px] text-[#c4b5fd]">36.4 MB / 2 GB</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5">
                <div className="h-full w-[1.8%] rounded-full bg-[#c4b5fd]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Images</span>
                <span className="font-mono text-white/30">12 files</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Audio</span>
                <span className="font-mono text-white/30">3 files</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Video</span>
                <span className="font-mono text-white/30">1 file</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
