'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

export default function SEOPage() {
  const [title, setTitle] = useState('yourname · ProfileOS');
  const [desc, setDesc] = useState('Check out my profile on ProfileOS');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Search Engine Preview</CardLabel>
        <div className="mt-3 rounded-lg border border-white/7 bg-[#0d0d14] p-4">
          <div className="text-sm text-[#8ab4f8]">{title}</div>
          <div className="text-xs text-[#bdc1c6]">
            profileos.netlify.app/yourname
          </div>
          <div className="mt-1 text-xs text-[#9aa0a6]">{desc}</div>
        </div>
      </Card>

      <Card>
        <CardLabel>Meta Tags</CardLabel>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 text-xs text-white/60">Page title</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs text-white/60">Description</div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="h-20 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 resize-none"
            />
            <div className="mt-1 text-[10px] text-white/30">{desc.length}/300 characters</div>
          </div>
          <div>
            <div className="mb-1.5 text-xs text-white/60">Keywords (comma separated)</div>
            <input
              defaultValue="profile, portfolio, social links"
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>OpenGraph</CardLabel>
          <div className="mt-3 space-y-4">
            <div>
              <div className="mb-1.5 text-xs text-white/60">OG Image</div>
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-3 py-2 transition-all hover:border-[#c4b5fd]/55">
                <span className="text-xs text-white/35"><strong className="text-[#c4b5fd]">Upload</strong> 1200×630px</span>
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs text-white/60">Embed color</div>
              <div className="flex items-center gap-2">
                <input type="color" defaultValue="#c4b5fd" className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
                <input defaultValue="#c4b5fd" className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-sm text-white/80" />
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Advanced</CardLabel>
          <div className="mt-3 space-y-3">
            <div>
              <div className="mb-1.5 text-xs text-white/60">Favicon</div>
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-3 py-2 transition-all hover:border-[#c4b5fd]/55">
                <span className="text-xs text-white/35"><strong className="text-[#c4b5fd]">Upload</strong> .ico / .png</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Animated tab title</span>
              <Toggle />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
