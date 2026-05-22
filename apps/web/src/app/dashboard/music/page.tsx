'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { UploadZone } from '@/components/dashboard/upload-zone';
import { useProfile } from '@/hooks/use-profile';
import { toast } from 'sonner';

export default function MusicPage() {
  const { tracks, saveTracks, saving } = useProfile();

  const removeTrack = async (i: number) => {
    const updated = tracks.filter((_, idx) => idx !== i);
    await saveTracks(updated);
    toast.success('Track removed');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Music Playlist</CardLabel>
        <div className="mt-3">
          <UploadZone
            folder="music"
            accept="audio/mpeg,audio/ogg,audio/wav"
            label="Upload MP3 / OGG / WAV"
            hint="Files play in order · max 20MB each"
            icon="♫"
            onUpload={(url, mime) => {
              const title = url.split('/').pop()?.split('.')[0] || 'Track';
              const newTrack = {
                title,
                artist: 'Unknown',
                url,
                duration: 0,
                order: tracks.length,
              };
              saveTracks([...tracks, newTrack]);
              toast.success('Track added to playlist!');
            }}
          />
        </div>

        <div className="mt-4 space-y-1">
          {tracks.length === 0 && (
            <div className="py-6 text-center text-[11px] text-white/20">No tracks yet. Upload some music.</div>
          )}
          {tracks.map((track, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-white/7 bg-[#0d0d14] p-2.5">
              <span className="w-4 text-center text-[10px] text-white/30">{i + 1}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#c4b5fd]/12 text-[11px] text-[#c4b5fd]">▶</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e8e6f0]">{track.title}</div>
                <div className="text-[10px] text-white/30">{track.artist}</div>
              </div>
              <button onClick={() => removeTrack(i)} className="text-[10px] text-white/20 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Playback Settings</CardLabel>
          <div className="mt-3 space-y-3">
            {['Autoplay', 'Shuffle', 'Loop all', 'Crossfade', 'Persistent playback'].map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span className="text-xs text-white/60">{s}</span>
                <Toggle checked={s === 'Autoplay' || s === 'Loop all'} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel>Tracks</CardLabel>
          <div className="mt-3 flex items-center justify-center h-20 text-[11px] text-white/30">
            {tracks.length} track{tracks.length !== 1 ? 's' : ''} in playlist
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
