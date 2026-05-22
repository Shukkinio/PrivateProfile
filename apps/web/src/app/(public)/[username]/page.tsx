'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IntroScreen } from '@/components/public/intro-screen';
import { ProfileHeader } from '@/components/public/profile-header';
import { BackgroundEffects } from '@/components/public/background-effects';
import { MusicPlayer } from '@/components/public/music-player';
import { api } from '@/lib/api-client';

interface PublicProfile {
  username: string;
  profile: {
    displayName: string;
    bio: string;
    location: string;
    timezone: string;
    layoutType: string;
    theme: string;
    usernameEffect: string;
    bioEffect: string;
    introEnabled: boolean;
    introText: string;
    musicWidget: boolean;
    bgVideoUrl: string;
    bgEffects: string[];
    effectIntensity: number;
    blurAmount: number;
    brightness: number;
    saturation: number;
    glowIntensity: number;
    accentColor: string;
    embedColor: string;
    discordPresence: boolean;
    customCursor: boolean;
    cursorImage: string;
    seoTitle: string;
    seoDesc: string;
    animatedTitle: boolean;
  };
  links: { platform: string; url: string; label: string }[];
  tracks: { title: string; artist: string; url: string }[];
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const [data, setData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.get<PublicProfile>(`/profile/public?username=${params.username}`);
        setData(result);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-profile-bg">
        <div className="animate-pulse text-[#c4b5fd] text-sm">Loading profile...</div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-profile-bg gap-4">
        <div className="text-6xl">404</div>
        <div className="text-sm text-white/30">Profile not found</div>
        <a href="/" className="text-xs text-[#c4b5fd] hover:underline">Create your own ProfileOS</a>
      </div>
    );
  }

  const p = data.profile;

  if (p.introEnabled && !entered) {
    return <IntroScreen onEnter={() => setEntered(true)} text={p.introText || 'ProfileOS'} />;
  }

  return (
    <div className="relative min-h-screen bg-profile-bg" style={{ '--accent': p.accentColor } as React.CSSProperties}>
      {/* Background video */}
      {p.bgVideoUrl && (
        <video
          autoPlay muted loop playsInline
          className="fixed inset-0 z-0 h-full w-full object-cover"
          style={{
            filter: `blur(${p.blurAmount}px) brightness(${p.brightness}%) saturate(${p.saturation}%)`,
          }}
        >
          <source src={p.bgVideoUrl} />
        </video>
      )}

      {/* Background effects */}
      {p.bgEffects && p.bgEffects.length > 0 && (
        <BackgroundEffects effects={p.bgEffects} intensity={p.effectIntensity} />
      )}

      {/* Profile content */}
      <div className="relative z-10">
        <ProfileHeader
          username={data.username}
          displayName={p.displayName}
          bio={p.bio}
          location={p.location}
          layout={p.layoutType as 'centered-card' | 'fullscreen-hero' | 'split' | 'minimal' | 'floating-glass' | 'cyberpunk' | 'monochrome' | 'terminal'}
        />
      </div>

      {/* Links */}
      {data.links.length > 0 && (
        <div className="relative z-10 flex justify-center pb-32 px-4">
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {data.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/50 transition-all hover:border-[#c4b5fd]/30 hover:bg-[#c4b5fd]/5 hover:text-[#c4b5fd]"
                style={{ '--hover-color': p.accentColor } as React.CSSProperties}
              >
                <span className="text-xs">{link.platform[0].toUpperCase()}</span>
                <span className="text-[11px]">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* View counter */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
        <span className="font-mono text-[10px] text-white/40">live</span>
      </div>

      {/* Music player */}
      {p.musicWidget && data.tracks.length > 0 && <MusicPlayer />}
    </div>
  );
}
