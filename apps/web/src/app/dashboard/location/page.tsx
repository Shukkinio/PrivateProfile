'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { useState } from 'react';

export default function LocationPage() {
  const [location, setLocation] = useState('San Francisco, CA');
  const [timezone, setTimezone] = useState('America/Los_Angeles');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Location Settings</CardLabel>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 text-xs text-white/60">Location text</div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs text-white/60">Timezone</div>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
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
        <CardLabel>Display Options</CardLabel>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#e8e6f0]">Show location badge</div>
              <div className="text-[10px] text-white/30">Animated badge with location icon</div>
            </div>
            <Toggle checked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#e8e6f0]">Show local time</div>
              <div className="text-[10px] text-white/30">Real-time clock based on timezone</div>
            </div>
            <Toggle checked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#e8e6f0]">Show timezone</div>
              <div className="text-[10px] text-white/30">Display timezone name/abbreviation</div>
            </div>
            <Toggle />
          </div>
        </div>
      </Card>

      <Card>
        <CardLabel>Preview</CardLabel>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c4b5fd]/15 text-[11px]">📍</span>
          <div>
            <span className="text-xs text-white/70">{location}</span>
            <span className="ml-2 text-[10px] text-white/30">
              {new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
