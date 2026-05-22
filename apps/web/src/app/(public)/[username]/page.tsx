'use client';

import { useState } from 'react';
import { IntroScreen } from '@/components/public/intro-screen';
import { ProfileHeader } from '@/components/public/profile-header';
import { BackgroundEffects } from '@/components/public/background-effects';
import { MusicPlayer } from '@/components/public/music-player';

export default function PublicProfilePage() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <IntroScreen onEnter={() => setEntered(true)} text="ProfileOS" />;
  }

  return (
    <div className="relative min-h-screen bg-profile-bg">
      {/* Background effects */}
      <BackgroundEffects effects={['particles', 'stars']} intensity={40} />

      {/* Profile content */}
      <ProfileHeader
        username="yourname"
        displayName="Your Name"
        bio="Building the future of digital identity. Designer & developer."
        location="San Francisco, CA"
        layout="centered-card"
      />

      {/* Links section */}
      <div className="relative z-10 flex justify-center pb-32">
        <div className="flex gap-3">
          {[
            { label: 'GitHub', url: '#' },
            { label: 'Twitter / X', url: '#' },
            { label: 'YouTube', url: '#' },
            { label: 'Discord', url: '#' },
            { label: 'Spotify', url: '#' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/50 transition-all hover:border-[#c4b5fd]/30 hover:bg-[#c4b5fd]/5 hover:text-[#c4b5fd]"
            >
              <span className="text-xs">{link.label[0]}</span>
              <span className="text-[11px]">{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Floating view counter */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
        <span className="font-mono text-[10px] text-white/40">48,291 views</span>
      </div>

      {/* Music player */}
      <MusicPlayer />
    </div>
  );
}
