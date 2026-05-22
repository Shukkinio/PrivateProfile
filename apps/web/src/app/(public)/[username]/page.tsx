'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { SOCIAL_ICONS } from '@/lib/social-icons';

interface PublicProfile {
  username: string;
  profile: {
    displayName: string; bio: string; location: string;
    avatarUrl: string; accentColor: string; bgColor: string;
    bgVideoUrl: string; cursorImage: string; cursorSize: number;
    musicUrl: string; musicTitle: string; musicArtist: string;
    bgEffectType: string; usernameEffectType: string;
    profileOpacity: number; profileBlur: number;
    glowUsername: boolean; glowSocials: boolean; glowBadges: boolean;
    monochromeIcons: boolean; volumeControl: boolean;
    useDiscordAvatar: boolean; discordAvatarDecoration: boolean;
    swapBoxColors: boolean; animatedTitle: boolean;
    startMessage: string;
    startMessageFont: string;
    glowStyle: string;
    usernameGlowStyle: string;
    startMessageGlow: boolean;
    badges: string[];
  };
  links: { platform: string; url: string; label: string }[];
}

const EFFECT_STYLES: Record<string, string> = {
  plasma: 'bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-900',
  aurora: 'bg-gradient-to-br from-green-900 via-teal-800 to-blue-900',
  rain: 'bg-gradient-to-t from-slate-900 to-blue-950',
  snowflakes: 'bg-gradient-to-b from-slate-800 to-white/5',
  dither: 'bg-[#08080e]',
  'blurred-bg': '',
  particles: 'bg-[#0a0a12]',
  matrix: 'bg-[#0a0a0f]',
  'gradient-waves': 'bg-[#0a0a14]',
};

function getGlowStyle(style: string, accent: string, intensity = 1): React.CSSProperties {
  switch (style) {
    case 'radial':
      return {
        position: 'relative' as const,
        color: accent,
      };
    case 'box':
      return {
        color: accent,
        boxShadow: `0 0 30px ${accent}80, 0 0 60px ${accent}40, 0 0 100px ${accent}20`,
        padding: '0.25em 0.5em',
        borderRadius: '8px',
        display: 'inline-block',
      };
    case 'text-shadow':
    default:
      return {
        color: accent,
        textShadow: `0 0 20px ${accent}e0, 0 0 40px ${accent}90, 0 0 80px ${accent}50`,
      };
  }
}

function isImgUrl(url: string) { return url.match(/\.(png|jpg|jpeg|gif|webp|svg)/i); }

function SocialIcon({ id, size = 20 }: { id: string; size?: number }) {
  const svg = SOCIAL_ICONS[id];
  if (!svg) return <span className="text-xs font-bold">{id[0]?.toUpperCase()}</span>;
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="white" className="shrink-0">{svg}</svg>;
}

function genFingerprint(): string {
  try {
    const raw = [
      navigator.userAgent,
      navigator.platform,
      String(screen.width),
      String(screen.height),
      navigator.language,
    ].join('|');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const c = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + c;
      hash |= 0;
    }
    return hash.toString(36);
  } catch {
    return '';
  }
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const [data, setData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [entered, setEntered] = useState(false);
  const [volume, setVolume] = useState(30);
  const [playing, setPlaying] = useState(false);
  const [hoverVolume, setHoverVolume] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [viewStats, setViewStats] = useState<{totalViews: number; uniqueVisitors: number} | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fpRef = useRef('');
  useEffect(() => { fpRef.current = genFingerprint(); }, []);

  useEffect(() => {
    api.get<PublicProfile>(`/profile/public?username=${params.username}`)
      .then(setData).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.username]);

  const hasBgVideo = data?.profile?.bgVideoUrl?.match(/\.(mp4|webm)$/i);
  const audioSrc = hasBgVideo ? null : (data?.profile?.musicUrl || null);

  const handleEnter = useCallback(() => {
    if (entered) return;
    setEntered(true);
    if (hasBgVideo && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else if (!hasBgVideo && audioRef.current && audioSrc) {
      audioRef.current.muted = false;
      audioRef.current.volume = volume / 100;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: params.username, fingerprint: fpRef.current }),
    }).catch(() => {});
  }, [entered, params.username, hasBgVideo, audioSrc, volume]);

  // Cursor follower
  useEffect(() => {
    if (!data?.profile?.cursorImage) return;
    const handler = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.id = 'cursor-hide';
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);
    return () => {
      window.removeEventListener('mousemove', handler);
      document.body.style.cursor = '';
      const s = document.getElementById('cursor-hide');
      if (s) s.remove();
    };
  }, [data?.profile?.cursorImage]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasBgVideo && videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
      else { videoRef.current.pause(); setPlaying(false); }
    } else if (audioRef.current) {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
    }
  };

  useEffect(() => {
    if (audioRef.current && !audioRef.current.muted) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Fetch view stats after entering
  useEffect(() => {
    if (!entered || !data) return;
    const username = params.username;
    if (username) {
      api.get<{totalViews: number; uniqueVisitors: number}>(`/views?username=${username}`)
        .then(setViewStats).catch(() => {});
    }
  }, [entered, data, params.username]);

  const trackLabel = data?.profile?.musicTitle
    ? `${data.profile.musicTitle}${data.profile.musicArtist ? ` \u2014 ${data.profile.musicArtist}` : ''}`
    : null;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="animate-pulse text-lg" style={{ color: '#c4b5fd' }}>Loading...</div>
    </div>
  );

  if (notFound || !data) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0f]">
      <div className="text-6xl text-white/10">404</div>
      <div className="text-base text-white/30">Profile not found</div>
    </div>
  );

  const p = data.profile;
  const accent = p.accentColor || '#c4b5fd';
  const bg = p.bgColor || '#0a0a0f';
  const opacity = (p.profileOpacity ?? 100) / 100;
  const cursorSize = p.cursorSize || 32;
  const glowStyle = getGlowStyle(p.glowStyle || 'text-shadow', accent);
  const glowStyleRadial = p.glowStyle === 'radial';

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: bg }}>

      <style>{`
        @keyframes rainbow { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
        @keyframes shuffle { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        @keyframes typewriter { from{width:0} to{width:100%} }
        @keyframes fuzzy { 0%,100%{opacity:1;filter:blur(0)} 50%{opacity:0.4;filter:blur(2px)} }
        @keyframes dither-noise { 0%{background-position:0 0} 100%{background-position:4px 4px} }
        @keyframes rain-fall { 0%{transform:translateY(-10vh)} 100%{transform:translateY(110vh)} }
        @keyframes particle-float { 0%{transform:translateY(100vh) translateX(0) scale(0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-10vh) translateX(50px) scale(1);opacity:0} }
        @keyframes matrix-fall { 0%{transform:translateY(-10vh)} 100%{transform:translateY(110vh)} }
        @keyframes wave-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes glitch-1 { 0%,100%{clip-path:inset(0 0 0 0);transform:translate(0)} 20%{clip-path:inset(20% 0 60% 0);transform:translate(-3px,2px)} 40%{clip-path:inset(40% 0 40% 0);transform:translate(3px,-1px)} 60%{clip-path:inset(60% 0 20% 0);transform:translate(-2px,1px)} 80%{clip-path:inset(10% 0 70% 0);transform:translate(2px,-2px)} }
        @keyframes glitch-2 { 0%,100%{clip-path:inset(0 0 0 0);transform:translate(0)} 20%{clip-path:inset(30% 0 50% 0);transform:translate(2px,-2px)} 40%{clip-path:inset(50% 0 30% 0);transform:translate(-3px,1px)} 60%{clip-path:inset(10% 0 60% 0);transform:translate(3px,2px)} 80%{clip-path:inset(70% 0 10% 0);transform:translate(-2px,-1px)} }
        @keyframes neon-pulse { 0%,100%{text-shadow:0 0 7px ${accent},0 0 10px ${accent},0 0 21px ${accent},0 0 42px ${accent},0 0 82px ${accent},0 0 92px ${accent}} 50%{text-shadow:0 0 4px ${accent},0 0 7px ${accent},0 0 13px ${accent},0 0 26px ${accent},0 0 40px ${accent},0 0 52px ${accent}} }
        @keyframes fire { 0%,100%{text-shadow:0 -5px 10px #ff4500,0 -10px 20px #ff4500,0 -15px 30px #ff4500,0 -20px 40px #ff8c00,0 -30px 50px #ffd700;color:#ff4500} 25%{text-shadow:0 -5px 10px #ff6347,0 -10px 20px #ff6347,0 -15px 30px #ff4500,0 -20px 40px #ff8c00,0 -30px 50px #ffd700;color:#ff6347} 50%{text-shadow:0 -5px 10px #ff4500,0 -10px 20px #ff8c00,0 -15px 30px #ffd700,0 -20px 40px #ff4500,0 -30px 50px #ff6347;color:#ff8c00} 75%{text-shadow:0 -5px 10px #ff8c00,0 -10px 20px #ff4500,0 -15px 30px #ff6347,0 -20px 40px #ffd700,0 -30px 50px #ff4500;color:#ff6347} }
        @keyframes radial-pulse { 0%,100%{filter:blur(30px);opacity:0.4} 50%{filter:blur(50px);opacity:0.7} }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
        input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: ${accent}; margin-top: -5px; box-shadow: 0 0 10px ${accent}60; }
        input[type=range]::-moz-range-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); }
        input[type=range]::-moz-range-thumb { height: 16px; width: 16px; border-radius: 50%; background: ${accent}; border: none; box-shadow: 0 0 10px ${accent}60; }
      `}</style>

      {p.startMessageGlow && (
        <style>{`
          @keyframes start-message-glow { 0%,100%{text-shadow:0 0 20px ${accent}50} 50%{text-shadow:0 0 60px ${accent}90,0 0 100px ${accent}60} }
        `}</style>
      )}

      {/* ─── FULL CONTENT (always rendered, pointer-events disabled when overlay active) ─── */}
      <div className={`flex min-h-screen flex-col items-center justify-center px-6 ${!entered ? 'pointer-events-none select-none' : ''} ${EFFECT_STYLES[p.bgEffectType] || ''}`}
        style={{ backgroundColor: bg }}>

        {/* Background video — muted, no autoplay until user clicks */}
        {p.bgVideoUrl && (
          p.bgVideoUrl.match(/\.(mp4|webm)$/i)
            ? <video ref={videoRef} muted loop playsInline className="fixed inset-0 h-full w-full object-cover"><source src={p.bgVideoUrl} /></video>
            : <img src={p.bgVideoUrl} className="fixed inset-0 h-full w-full object-cover" />
        )}

        {/* Dither overlay */}
        {p.bgEffectType === 'dither' && (
          <div className="fixed inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkYPj/n4EBCxg5OTn/MzIyYkgwMTH9Z2BgAABJNQX/i2iv9AAAAABJRU5ErkJggg==")', backgroundRepeat: 'repeat', animation: 'dither-noise 0.3s steps(2) infinite' }} />
        )}

        {/* Rain overlay */}
        {p.bgEffectType === 'rain' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-15">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="absolute w-px bg-blue-300" style={{
                left: `${Math.random() * 100}%`, height: `${15 + Math.random() * 40}px`,
                animation: `rain-fall ${0.8 + Math.random() * 1.5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }} />
            ))}
          </div>
        )}

        {/* Snowflakes overlay */}
        {p.bgEffectType === 'snowflakes' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 bg-white rounded-full" style={{
                left: `${Math.random() * 100}%`,
                animation: `rain-fall ${3 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 6}s`,
              }} />
            ))}
          </div>
        )}

        {/* Particles overlay */}
        {p.bgEffectType === 'particles' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="absolute rounded-full" style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? accent : i % 3 === 1 ? '#fff' : '#c4b5fd',
                opacity: 0.3 + Math.random() * 0.5,
                animation: `particle-float ${10 + Math.random() * 20}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
              }} />
            ))}
          </div>
        )}

        {/* Matrix overlay */}
        {p.bgEffectType === 'matrix' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.12] font-mono text-xs leading-none text-green-500"
            style={{ color: '#22c55e' }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="absolute" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                writingMode: 'vertical-rl',
                animation: `matrix-fall ${3 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.3 + Math.random() * 0.7,
              }}>
                {Array.from({ length: 8 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
              </div>
            ))}
          </div>
        )}

        {/* Gradient Waves overlay */}
        {p.bgEffectType === 'gradient-waves' && (
          <div className="fixed inset-0 pointer-events-none opacity-30"
            style={{
              background: `linear-gradient(135deg, ${accent}40, #6366f140, #06b6d440, ${accent}40, #8b5cf640)`,
              backgroundSize: '400% 400%',
              animation: 'wave-shift 8s ease infinite',
            }} />
        )}

        {/* Custom cursor */}
        {p.cursorImage && (
          <div className="fixed z-[9999] pointer-events-none" style={{
            left: cursorPos.x - cursorSize / 2,
            top: cursorPos.y - cursorSize / 2,
            width: cursorSize,
            height: cursorSize,
          }}>
            <img src={p.cursorImage} className="w-full h-full object-contain" />
          </div>
        )}

        {/* Volume control — horizontal layout */}
        {hasBgVideo && p.volumeControl && (
          <div className="fixed top-5 left-5 z-50"
            onMouseEnter={() => setHoverVolume(true)}
            onMouseLeave={() => setHoverVolume(false)}>
            <div className="flex flex-row items-center gap-3 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/15 px-4 py-2 min-w-[48px]"
              style={{ borderColor: accent + '25' }}>
              <span className="text-base text-white/60 select-none"
                onClick={togglePlay}>
                {playing ? '🔊' : '🔇'}
              </span>
              {hoverVolume && (
                <>
                  <input type="range" min={0} max={100} value={volume}
                    onChange={(e) => { e.stopPropagation(); setVolume(Number(e.target.value)); }}
                    className="w-24 h-1.5 rounded-full bg-white/10 cursor-pointer" />
                  <span className="text-[10px] font-mono text-white/40">{volume}%</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Audio element for separate music track (no bg video) — initially muted */}
        {!hasBgVideo && audioSrc && <audio ref={audioRef} loop src={audioSrc} muted />}

        {/* Player bar — bottom */}
        {(hasBgVideo || audioSrc) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-lg"
            style={{ borderColor: accent + '25' }}>
            <button onClick={togglePlay} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: accent + '20', color: accent }}>
              {playing ? '⏸' : '▶'}
            </button>
            <span className="text-xs text-white/50 max-w-[160px] truncate">
              {hasBgVideo ? 'Background audio' : (trackLabel || 'Unknown track')}
            </span>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
          style={{ opacity, filter: p.profileBlur ? `blur(${p.profileBlur}px)` : undefined }}>

          {/* Avatar glow */}
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/5 text-4xl mb-4 overflow-hidden"
            style={{
              color: accent,
              boxShadow: p.glowUsername ? `0 0 40px ${accent}70, 0 0 80px ${accent}30` : '0 0 10px rgba(255,255,255,0.05)',
              border: '3px solid rgba(255,255,255,0.1)',
            }}>
            {p.avatarUrl
              ? <img src={p.avatarUrl} className="h-full w-full object-cover" />
              : p.displayName[0]?.toUpperCase() || '?'}
          </div>

          {/* Badges glow */}
          {p.badges && p.badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {p.badges.map((badge, i) => (
                <img key={i} src={badge} className="h-8 w-8 rounded object-cover"
                  style={{
                    filter: p.monochromeIcons ? 'grayscale(100%)' : undefined,
                    boxShadow: p.glowBadges ? `0 0 15px ${accent}70, 0 0 30px ${accent}30` : undefined,
                  }} />
              ))}
            </div>
          )}

          {/* Name with glow style and effects */}
          {glowStyleRadial && p.glowUsername && (
            <div className="relative mb-2">
              <div className="absolute -inset-10 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, ${accent}60 0%, transparent 70%)`,
                  animation: 'radial-pulse 3s ease-in-out infinite',
                }} />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-2 transition-all"
            style={{
              ...(p.glowUsername ? glowStyle : { color: accent }),
              animation: p.usernameEffectType === 'rainbow' ? 'rainbow 2s linear infinite' :
                          p.usernameEffectType === 'shuffle' ? 'shuffle 0.2s ease-in-out infinite' :
                          p.usernameEffectType === 'fuzzy' ? 'fuzzy 1.5s ease-in-out infinite' :
                          p.usernameEffectType === 'glitch' ? 'glitch-1 0.5s ease-in-out infinite' :
                          p.usernameEffectType === 'neon-pulse' ? 'neon-pulse 2s ease-in-out infinite' :
                          p.usernameEffectType === 'fire' ? 'fire 1.5s ease-in-out infinite' : undefined,
              display: p.usernameEffectType === 'typewriter' ? 'inline-block' : undefined,
              overflow: p.usernameEffectType === 'typewriter' ? 'hidden' : undefined,
              whiteSpace: p.usernameEffectType === 'typewriter' ? 'nowrap' : undefined,
              maxWidth: p.usernameEffectType === 'typewriter' ? '100%' : undefined,
            }}>
            {p.displayName}
          </h1>

          {p.bio && <p className="text-base text-white/50 mb-2 max-w-sm">{p.bio}</p>}
          {p.location && <div className="text-sm text-white/30 mb-6">📍 {p.location}</div>}

          {/* Links */}
          {data.links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">
              {data.links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl border transition-all duration-150"
                  style={{
                    width: 52, height: 52,
                    borderColor: accent + '30',
                    backgroundColor: accent + '0a',
                    boxShadow: p.glowSocials ? `0 0 20px ${accent}50, 0 0 40px ${accent}20` : undefined,
                    filter: p.monochromeIcons ? 'grayscale(100%)' : undefined,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent + '20'; e.currentTarget.style.borderColor = accent + '60'; if (p.glowSocials) e.currentTarget.style.boxShadow = `0 0 30px ${accent}70, 0 0 60px ${accent}30`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent + '0a'; e.currentTarget.style.borderColor = accent + '30'; if (p.glowSocials) e.currentTarget.style.boxShadow = `0 0 20px ${accent}50, 0 0 40px ${accent}20`; }}
                  title={link.label}>
                  {isImgUrl(link.url) ? (
                    <img src={link.url} className="h-6 w-6 rounded object-cover" />
                  ) : (
                    <SocialIcon id={link.platform} size={22} />
                  )}
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col items-center gap-1">
            <div className="text-xs text-white/12">ProfileOS</div>
            {viewStats && (
              <div className="flex items-center gap-3 text-[10px] text-white/20 font-mono">
                <span>{viewStats.totalViews.toLocaleString()} views</span>
                <span className="w-px h-3 bg-white/10" />
                <span>{viewStats.uniqueVisitors.toLocaleString()} unique</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── START MESSAGE BLUR OVERLAY ─── */}
      {!entered && (
        <div onClick={handleEnter}
          className="fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center px-6"
          style={{ backgroundColor: bg + '00' }}>
          {/* Backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-2xl bg-black/40" />

          {/* Start message content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {p.avatarUrl && (
              <div className="h-24 w-24 rounded-full overflow-hidden opacity-50 grayscale ring-2 ring-white/10">
                <img src={p.avatarUrl} className="w-full h-full object-cover" />
              </div>
            )}
            <div
              className="text-5xl md:text-7xl font-bold tracking-wider text-center leading-tight transition-all"
              style={{
                color: accent,
                fontFamily: p.startMessageFont || undefined,
                animation: p.startMessageGlow ? 'start-message-glow 2s ease-in-out infinite' : undefined,
                textShadow: p.startMessageGlow ? `0 0 40px ${accent}80, 0 0 80px ${accent}40` : undefined,
              }}>
              {p.startMessage || 'Click anywhere to enter'}
            </div>
            <div className="text-sm text-white/30 animate-pulse mt-4">Click anywhere to continue</div>
          </div>
        </div>
      )}
    </div>
  );
}
