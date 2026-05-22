'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

// --- types ---
interface Profile {
  displayName: string; bio: string; location: string;
  avatarUrl: string; bgColor: string; accentColor: string;
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
  links: LinkItem[];
}

interface LinkItem { platform: string; url: string; label: string; hidden: boolean; }

const DEFAULT: Profile = {
  displayName: 'User', bio: '', location: '', avatarUrl: '',
  bgColor: '#0a0a0f', accentColor: '#c4b5fd', bgVideoUrl: '', cursorImage: '', cursorSize: 32,
  musicUrl: '', musicTitle: '', musicArtist: '',
  bgEffectType: '', usernameEffectType: '',
  startMessage: 'Click anywhere to enter',
  startMessageFont: '',
  glowStyle: 'text-shadow',
  usernameGlowStyle: 'text-shadow',
  startMessageGlow: false,
  profileOpacity: 100, profileBlur: 0,
  glowUsername: true, glowSocials: true, glowBadges: true,
  monochromeIcons: false, volumeControl: true,
  useDiscordAvatar: false, discordAvatarDecoration: false,
  swapBoxColors: false, animatedTitle: false,
  badges: [], links: [],
};

function SocialIcon({ id, size = 18 }: { id: string; size?: number }) {
  const svg = SOCIAL_ICONS[id];
  if (!svg) return <span className="text-xs font-bold">{id[0]?.toUpperCase()}</span>;
  const color = SOCIALS.find(s => s.id === id)?.color || '#888';
  return <svg viewBox="0 0 24 24" width={size} height={size} fill={color} className="shrink-0">{svg}</svg>;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  youtube: <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.5.7c-1 .2-1.7 1-2 2C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1 1.7 2 2 1.7.7 9.5.7 9.5.7s7.8 0 9.5-.7c1-.3 1.7-1 2-2C24 16 24 12 24 12s0-4-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/>,
  twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>,
  instagram: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>,
  tiktok: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>,
  snapchat: <path d="M12 2.5c-5.52 0-10 3.38-10 7.54 0 1.64.64 3.14 1.7 4.36-.22.67-.53 1.5-.71 2.09-.12.39-.24.8-.13 1.15.16.52.76.81 1.37.81.28 0 .59-.05.92-.12.56-.12 1.27-.27 1.9-.39.32-.06.64-.04.88.08.94.48 2.21.88 3.67 1.07.18.16.29.38.3.62 0 .78-.23 1.4-.6 1.84-.26.32-.6.48-.95.48-.44 0-.82-.21-1.06-.56-.96-1.4-2.8-.47-2.8.61 0 .68.71 1.24 1.6 1.53.93.31 2.01.47 3.03.47 1.02 0 2.1-.16 3.03-.47.89-.29 1.6-.85 1.6-1.53 0-1.08-1.84-2.01-2.8-.61-.24.35-.62.56-1.06.56-.35 0-.69-.16-.95-.48-.37-.44-.6-1.06-.6-1.84 0-.24.12-.46.3-.62 1.46-.19 2.73-.59 3.67-1.07.24-.12.56-.14.88-.08.63.12 1.34.27 1.9.39.33.07.64.12.92.12.61 0 1.21-.29 1.37-.81.11-.35-.01-.76-.13-1.15-.18-.59-.49-1.42-.71-2.09 1.06-1.22 1.7-2.72 1.7-4.36 0-4.16-4.48-7.54-10-7.54z"/>,
  facebook: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
  discord: <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>,
  github: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>,
  twitch: <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>,
  reddit: <path d="M12 0A12 12 0 0012 24 12 12 0 0012 0zm5.38 6.67a1.72 1.72 0 011.59 1.73c0 .69-.4 1.28-.98 1.57.07.14.11.3.11.47 0 .8-.66 1.45-1.47 1.45-.23 0-.44-.05-.64-.14a5.53 5.53 0 01-3.8 1.57l.83 3.63 2.87.69c.52-.45 1.18-.73 1.92-.73A2.7 2.7 0 0120 16.42a2.7 2.7 0 01-2.7 2.7c-.93 0-1.76-.48-2.24-1.2l-3.12-.75c-.17-.04-.32-.17-.37-.34l-1.05-4.53c-.57-.22-1.06-.61-1.39-1.11-.2.09-.42.14-.65.14-.8 0-1.46-.65-1.46-1.45 0-.17.04-.33.1-.47-.57-.3-.97-.88-.97-1.57 0-.75.47-1.39 1.15-1.63.15-.06.3-.08.46-.08.37 0 .7.15.95.39a5.4 5.4 0 013.04-1.04l.67-3.02c.03-.14.14-.24.28-.26l4.21-.44c.06-.45.44-.8.9-.8.52 0 .94.42.94.94 0 .5-.39.92-.88.94l-.64 2.88c.29.02.57.07.84.15.22-.2.5-.33.83-.33zm-1.14 6.66a.84.84 0 00-.84.84c0 .47.37.84.84.84.46 0 .84-.37.84-.84a.84.84 0 00-.84-.84zM8.03 13.33a.84.84 0 00-.84.84c0 .47.37.84.84.84.46 0 .84-.37.84-.84a.84.84 0 00-.84-.84zm3.41 1.8c-.4 0-.73.32-.73.73 0 .4.32.73.73.73.4 0 .73-.32.73-.73 0-.4-.33-.73-.73-.73zm-.6.2c.12-.15.36-.15.48 0l.36.44c.1.13.1.3 0 .43l-.36.44-.48-.44h.48l.16-.2-.16-.2zm.12 0l-.48.44.48.44.16-.2-.16-.2.48.44.48-.44-.48-.44.16.2-.16.2h.48l-.16-.2.48-.44-.48-.44-.48.44.16.2-.16-.2z"/>,
  linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>,
  pinterest: <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.782c0-1.67.968-2.914 2.172-2.914 1.027 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.378 11.985-11.987C23.97 5.367 18.627.002 12.017.002z"/>,
  telegram: <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>,
  whatsapp: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>,
  spotify: <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>,
  soundcloud: <path d="M11.56 8.873v8.736h11.459c.852 0 1.543-.69 1.543-1.543v-5.65c0-.852-.69-1.543-1.543-1.543h-.315c-.306-2.553-2.213-4.747-4.973-5.247 0 0-.001 0-.002 0-.077-.015-.156-.022-.236-.022-.427 0-.825.097-1.183.271v.034a2.29 2.29 0 00-.496-.34c0 .002 0 .005-.001.007l-.002-.001c-.003-.002-.005-.003-.008-.005l.002.002c-.207-.098-.431-.15-.663-.15-.39 0-.754.12-1.055.327h-.001l-.012.008c.005-.003.01-.007.015-.01-.277.199-.506.456-.675.752-1.1 1.352-.932 3.522-.932 5.035zm-3.508 7.232H5.64V9.478h2.412v6.627zm-3.181 0H2.574v-5.337h2.297v5.337zm-3.1 0H0v-4.391h1.771v4.39z"/>,
  steam: <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.18l1.87-6.344c-.25-.126-.472-.302-.654-.522l-1.928 1.11a3.96 3.96 0 01-1.898.496 3.99 3.99 0 01-3.988-3.988 3.99 3.99 0 013.988-3.988c.705 0 1.395.187 1.998.54l1.745-1.004c.15-.12.316-.218.49-.294L9.94 4.12A12.06 12.06 0 0012 0zm-.544 10.63a1.58 1.58 0 00-.856.748l-2.425 1.396a2.63 2.63 0 00-.832-.14 2.63 2.63 0 00-2.628 2.628 2.63 2.63 0 002.628 2.628 2.63 2.63 0 002.628-2.628c0-.364-.076-.71-.21-1.027l2.454-1.414c.175.064.36.098.554.098a1.399 1.399 0 001.399-1.398 1.399 1.399 0 00-1.399-1.398c-.558 0-1.04.327-1.26.792-.138.025-.27.069-.394.132l-2.429 1.397a.686.686 0 01-.168.022.693.693 0 01-.693-.693.693.693 0 01.693-.693h.004s.035.003.036.003l2.262-1.302zm.346 1.704c.045.12.07.25.07.385a1.05 1.05 0 01-1.05 1.048 1.05 1.05 0 01-1.048-1.049 1.05 1.05 0 011.049-1.048c.098 0 .192.015.281.041l1.867-1.074a2.32 2.32 0 00-1.411-.487 2.32 2.32 0 00-2.321 2.322 2.32 2.32 0 002.321 2.321 2.32 2.32 0 002.321-2.321c0-.41-.108-.806-.307-1.148l-1.822 1.04zM12 2.77a9.23 9.23 0 019.23 9.23 9.23 9.23 0 01-9.23 9.23c-2.78 0-5.326-1.13-7.106-3.018l2.435-1.337h.001a3.11 3.11 0 003.097-3.097 3.108 3.108 0 00-1.612-2.723l.965-3.273A5.47 5.47 0 0112 2.77z"/>,
  medium: <path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 00-.143.362v9.067a.376.376 0 00.143.362l1.257 1.234v.271h-6.322v-.27l1.302-1.264c.128-.128.128-.165.128-.361V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 00.233.707l1.694 2.054v.271H3.815v-.27l1.694-2.054a.82.82 0 00.218-.707V8.303a.625.625 0 00-.203-.528L4.019 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456v.271z"/>,
  devto: <path d="M7.42 10.702c-.111-.127-.268-.19-.504-.19H5.91v2.972h1.005c.241 0 .415-.062.52-.185a.755.755 0 00.167-.518v-1.56a.709.709 0 00-.182-.519zM0 0v24h24V0H0zm7.864 13.205c-.217.26-.56.39-1.025.39H5.052V9.392h1.787c.453 0 .792.13 1.015.383.219.253.332.606.332 1.054v1.293c0 .447-.111.802-.322 1.083zm3.154-1.748c-.206-.173-.462-.259-.763-.259-.457 0-.734.222-.738.541h1.497c-.005-.12-.04-.213-.112-.281l.151.003h.005l.053-.003.053-.003a1.22 1.22 0 00-.154-.002h-.13l-.13-.002c.152.02.27.065.367.15.063.055.126.13.164.215a.262.262 0 01.02-.04c.015-.027.03-.054.051-.08.063-.076.14-.13.236-.165l.125-.049.118-.019c.112-.02.227-.02.34-.003.133.02.25.056.354.113l.004.002.003.002.09.005.12.02.101.034.069.045a.994.994 0 01.313.4c.038.088.058.19.058.308v1.357h-1.36v-.805a.47.47 0 00-.136-.352c.103.11.155.253.155.427v.73h1.296v-.863c0-.188-.038-.34-.119-.46-.081-.11-.2-.196-.335-.262zm3.504 2.127a1.4 1.4 0 01-.466.09c-.186 0-.347-.03-.488-.08a.786.786 0 01-.342-.246.556.556 0 01-.131-.38v-.005c0-.199.07-.355.212-.47.144-.115.343-.172.597-.172.154 0 .273.026.358.08l-.008.005.008.002.065.022.048.028a.36.36 0 01.122.12c.036.052.062.11.077.176.016.075.023.16.023.256v.005c0 .25-.08.426-.241.537l.231-.145-.231.145a.39.39 0 01-.032.02l.024-.015a.417.417 0 01-.311.08c.024-.003.058-.008.105-.015.072-.01.142-.025.21-.045zm.03-1.369c-.183-.153-.445-.23-.784-.23-.307 0-.563.057-.768.172l-.045.023v.06l.044-.015.016-.005.045-.015a1.84 1.84 0 01.17-.048c.065-.015.14-.028.224-.038v.007l.068-.006.058-.005.07-.003c.089-.003.18-.001.272.007l.089.01.06.008.062.012.112.025.084.025.065.024.07.03c.058.028.108.06.152.099l.036.017v.023a.091.091 0 01-.03-.007.523.523 0 00-.304-.068c-.037.003-.074.008-.11.015l-.103.022-.111.03a.873.873 0 00-.17.065c-.141.07-.24.168-.288.292a.3.3 0 00-.014.03c-.064.166-.04.322.072.47.108.15.282.225.52.225.141 0 .265-.024.37-.07a.61.61 0 00.253-.189.505.505 0 00.107-.32v-.013h-1.278v-.501h1.737v.245a.79.79 0 01-.034.234.842.842 0 01-.106.235l.066-.096a.675.675 0 01-.092.107.666.666 0 01-.13.09l-.078.036-.094.028-.105.018-.111.003a.309.309 0 01-.103-.016.408.408 0 01-.08-.035.503.503 0 01-.065-.052.425.425 0 01-.065-.052l.049.045.054.048a.425.425 0 00.054.025c.016.008.032.016.048.023.205.086.423.085.653-.005v.03l.132-.05.105-.058.083-.07.065-.084.046-.1.028-.116.011-.133V12.38a.5.5 0 00-.023-.165.456.456 0 00-.076-.138.385.385 0 00-.125-.106zM11.977 7.856A4.115 4.115 0 0012 7.839c-.008 0-.015.005-.023.017z"/>,
  dribbble: <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>,
  behance: <path d="M5.252 3.648c.627.424 1.005 1.018 1.197 1.814.188.786.282 1.732.282 2.836 0 .698-.11 1.354-.33 1.967-.22.613-.565 1.144-1.033 1.593-.232.227-.728.541-1.487.942l1.662 1.272c1.527 1.164 2.29 2.601 2.29 4.311 0 1.233-.431 2.308-1.292 3.225-.862.917-1.95 1.6-3.267 2.05C4.165 23.291 3.955 23.3 0 23.3V.016c2.804 0 4.503.144 5.252.648zm-1.03 9.418c.625-.36 1.086-.795 1.38-1.305.295-.509.443-1.156.443-1.94 0-.86-.138-1.622-.414-2.287-.276-.666-.7-1.04-1.275-1.124-.216-.033-.55-.048-1.003-.048v6.94c.568 0 .97-.077 1.204-.236zm.742 7.592c.39-.36.684-.826.884-1.395.2-.57.3-1.141.3-1.714 0-.452-.048-.813-.145-1.082-.137-.385-.367-.763-.691-1.135-.324-.372-.644-.606-.96-.703-.256-.08-.566-.118-.93-.118V21.1c.285 0 .595-.024.93-.071.334-.047.72-.25 1.157-.608l.455-.371zm11.118-6.218h9.944v.6c0 1.975.06 3.285.18 3.93H14.31c-.09-.63-.136-1.5-.136-2.607 0-.886.206-1.745.617-2.575.412-.83.997-1.388 1.755-2.111.558-.53.933-.902 1.125-1.115.192-.213.356-.452.493-.718.136-.266.204-.563.204-.89 0-.483-.144-.884-.432-1.204-.288-.32-.662-.48-1.122-.48-.398 0-.746.12-1.044.36-.298.24-.55.603-.757 1.088-.207.485-.364.854-.47 1.107l-3.73-1.325c.53-1.433 1.462-2.46 2.794-3.08 1.334-.62 2.841-.93 4.522-.93 1.528 0 2.83.245 3.906.735 1.076.49 1.905 1.177 2.487 2.062.582.885.873 1.945.873 3.18 0 1.088-.206 1.946-.618 2.574-.41.628-1.298 1.504-2.66 2.628l-2.072 1.713c-.287.234-.53.5-.73.795-.2.296-.3.655-.3 1.077 0 .155.007.301.02.44 0 .146.01.29.03.43zm-.148-4.384c.34-.31.5-.755.5-1.335 0-.695-.12-1.224-.36-1.587-.24-.362-.584-.543-1.033-.543-.8 0-1.363.36-1.69 1.078-.326.718-.49 1.472-.49 2.26 0 .56.068 1.054.205 1.483 0 .01.005.02.01.03l.016.06c.067.215.16.393.28.532.018.02.036.04.055.058.43.468 1.02.702 1.77.702.464 0 .84-.153 1.127-.458.287-.305.43-.74.43-1.305 0-.49-.16-.91-.48-1.26l-.14-.17-.02-.04c-.044-.097-.078-.168-.1-.21l-.075-.145zm-4.456 7.944h7.37v2.344h-7.37v-2.344z"/>,
  paypal: <path d="M7.076 21.337H2.47a.642.642 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.514c-.6 0-1.106.427-1.203 1.037l-1.235 8.969z"/>,
  etsy: <path d="M8.564 2.245c.18-.727.332-1.335.815-1.896.482-.561 1.114-.86 1.86-.86.798 0 1.456.289 1.956.866.5.578.76 1.34.76 2.286 0 .894-.247 1.545-.76 2.094-.514.548-1.138.822-1.97.822-.77 0-1.422-.285-1.914-.856-.492-.57-.757-1.327-.757-2.264 0-.618.103-1.166.31-1.645l-.3.453zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>,
  amazon: <path d="M13.05 11.94c.56.41.93.84 1.12 1.31.19.47.28 1.08.28 1.84 0 1.16-.36 2.12-1.07 2.89-.71.77-1.68 1.15-2.89 1.15-1.1 0-2-.35-2.71-1.06-.71-.71-1.06-1.65-1.06-2.82 0-1.07.32-1.93.96-2.57.64-.64 1.49-.96 2.57-.96.76 0 1.41.2 1.96.6.55.4.95.93 1.19 1.58l-.7.33c-.22-.5-.49-.87-.82-1.12-.33-.25-.73-.38-1.2-.38-.78 0-1.41.28-1.9.85-.49.57-.73 1.34-.73 2.32 0 .92.22 1.65.66 2.17.44.52 1.03.78 1.77.78.75 0 1.34-.28 1.77-.85.43-.57.64-1.31.64-2.23 0-.56-.09-1.04-.27-1.45-.18-.41-.44-.75-.79-1.03l.5-.6zm2.74 2.73c-.02-.39-.07-.73-.15-1.02l.68-.22c.1.33.17.68.21 1.05.04.37.06.76.06 1.16 0 .83-.14 1.54-.42 2.14-.28.6-.68 1.07-1.2 1.41-.52.34-1.15.54-1.88.6l-.12-.68c.58-.07 1.07-.24 1.47-.51.4-.27.7-.63.9-1.08.2-.45.3-.98.3-1.6 0-.33-.02-.64-.05-.93l.1-.04z"/>,
};

const SOCIALS = [
  { id: 'youtube', label: 'YouTube', color: '#FF0000' },
  { id: 'twitter', label: 'X / Twitter', color: '#1DA1F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', color: '#000000' },
  { id: 'snapchat', label: 'Snapchat', color: '#FFFC00' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'discord', label: 'Discord', color: '#5865F2' },
  { id: 'github', label: 'GitHub', color: '#333' },
  { id: 'twitch', label: 'Twitch', color: '#9146FF' },
  { id: 'reddit', label: 'Reddit', color: '#FF4500' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'pinterest', label: 'Pinterest', color: '#BD081C' },
  { id: 'telegram', label: 'Telegram', color: '#26A5E4' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { id: 'spotify', label: 'Spotify', color: '#1DB954' },
  { id: 'soundcloud', label: 'SoundCloud', color: '#FF3300' },
  { id: 'steam', label: 'Steam', color: '#171A21' },
  { id: 'medium', label: 'Medium', color: '#000000' },
  { id: 'devto', label: 'Dev.to', color: '#0A0A0A' },
  { id: 'dribbble', label: 'Dribbble', color: '#EA4C89' },
  { id: 'behance', label: 'Behance', color: '#1769FF' },
  { id: 'paypal', label: 'PayPal', color: '#00457C' },
  { id: 'etsy', label: 'Etsy', color: '#F16521' },
  { id: 'amazon', label: 'Amazon', color: '#FF9900' },
  { id: 'website', label: 'Website', color: '#6366f1' },
];

const EFFECTS = ['dither', 'plasma', 'aurora', 'rain', 'snowflakes', 'blurred-bg', 'particles', 'matrix', 'gradient-waves'];
const USERNAME_EFFECTS = ['fuzzy', 'shuffle', 'typewriter', 'rainbow', 'glitch', 'neon-pulse', 'fire'];

const FONTS = [
  { value: '', label: 'Default (Syne)' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Cinzel', label: 'Cinzel' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Inter', label: 'Inter' },
  { value: 'DM Serif Display', label: 'DM Serif Display' },
  { value: 'Unbounded', label: 'Unbounded' },
  { value: 'Instrument Serif', label: 'Instrument Serif' },
  { value: 'Newsreader', label: 'Newsreader' },
  { value: 'Sora', label: 'Sora' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

const GLOW_STYLES = [
  { value: 'text-shadow', label: 'Text Shadow' },
  { value: 'radial', label: 'Radial Glow' },
  { value: 'box', label: 'Box Glow' },
];
const SIDEBAR_GROUPS = [
  { label: 'Overview', icon: '▦', items: [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'analytics', label: 'Analytics', icon: '◉' },
    { id: 'badges', label: 'Badges', icon: '⊞' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]},
  { label: 'Customize', icon: '◌', items: [
    { id: 'customize', label: 'Customize', icon: '◌' },
  ]},
  { label: 'Links', icon: '⊹', items: [
    { id: 'links', label: 'Links', icon: '⊹' },
  ]},
];

// --- UploadZone component ---
function UploadZone({ accept, label, hint, icon, currentUrl, onUpload }: {
  accept: string; label: string; hint: string; icon: string;
  currentUrl: string; onUpload: (url: string, name?: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) { toast.error('File too large (max 50MB)'); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', accept.includes('video') ? 'background' : accept.includes('audio') ? 'music' : 'images');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onUpload(data.url, data.originalName);
      toast.success('Uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={async (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) await upload(f); }}
      className={`dash-btn flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-4 text-center transition-all duration-300 h-28 ${
        dragging ? 'border-[#c4b5fd] bg-[#c4b5fd]/10' : 'border-white/8 hover:border-[#c4b5fd]/25 hover:bg-[#c4b5fd]/3'
      }`}>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await upload(f); }} />
      {uploading ? <div className="text-xs text-[#c4b5fd] animate-pulse">Uploading...</div>
      : currentUrl ? <div className="flex flex-col items-center gap-1">
          {accept.includes('video') ? <video src={currentUrl} className="h-12 rounded object-cover" />
          : accept.includes('audio') ? <div className="text-sm text-[#c4b5fd]">♫</div>
          : <img src={currentUrl} className="h-10 w-10 rounded object-cover" />}
          <div className="text-[10px] text-white/30">Click to replace</div>
        </div>
      : <><div className="text-lg">{icon}</div><div className="text-xs font-medium text-white/60">{label}</div><div className="text-[9px] text-white/25">{hint}</div></>}
    </div>
  );
}

// --- Drag Link Item ---
function DragLink({ link, i, onRemove, onMove }: {
  link: LinkItem; i: number; onRemove: (i: number) => void;
  onMove: (from: number, to: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const from = Number(e.dataTransfer.getData('text/plain')); if (from !== i) onMove(from, i); }}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all ${
        dragOver ? 'border-[#c4b5fd] bg-[#c4b5fd]/10' : 'border-white/7 bg-[#0d0d14]'
      }`}>
      <span className="cursor-grab text-xs text-white/20">⠿</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: SOCIALS.find(s => s.id === link.platform)?.color || '#c4b5fd' }}>
        {link.url.match(/\.(png|jpg|jpeg|gif|webp)/i)
          ? <img src={link.url} className="h-full w-full rounded-md object-cover" />
          : <SocialIcon id={SOCIALS.find(s => s.id === link.platform)?.id || 'website'} size={16} />
        }
      </span>
      <div className="flex-1 min-w-0">
        {link.url.match(/\.(png|jpg|jpeg|gif|webp)/i) ? (
          <img src={link.url} className="h-8 rounded object-contain" />
        ) : (
          <>
            <div className="text-sm text-white/80 truncate">{link.label || link.platform}</div>
            <div className="text-[10px] text-white/30 truncate">{link.url}</div>
          </>
        )}
      </div>
      <button onClick={() => onRemove(i)} className="text-xs text-white/20 hover:text-red-400 transition-colors px-2">✕</button>
    </div>
  );
}

// --- Main Dashboard ---
export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Profile>(DEFAULT);
  const [newLink, setNewLink] = useState({ platform: '', url: '', label: '' });
  const [views, setViews] = useState<{totalViews:number;uniqueVisitors:number;viewsToday:number;viewsWeek:number;viewsMonth:number}|null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>({
    'Overview': true, 'Customize': true, 'Links': true
  });

  // Load profile
  useEffect(() => {
    api.get<{ profile: Profile; links: LinkItem[] }>('/profile')
      .then((data) => {
        const p = data.profile || {} as Profile;
        setDraft({
          ...DEFAULT,
          ...p,
          badges: p.badges ? (typeof p.badges === 'string' ? JSON.parse(p.badges as string) : p.badges) : [],
          links: data.links || [],
        });
      }).catch(() => setDraft(DEFAULT))
      .finally(() => setLoading(false));
  }, []);

  // fetch view stats
  useEffect(() => {
    if (loading) return;
    const uname = draft.displayName.toLowerCase().replace(/\s+/g, '_');
    if (uname) api.get<typeof views>(`/views?username=${uname}`).then(setViews).catch(() => {});
  }, [loading, draft.displayName]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/profile', {
        displayName: draft.displayName, bio: draft.bio, location: draft.location,
        avatarUrl: draft.avatarUrl, bgColor: draft.bgColor, accentColor: draft.accentColor,
        bgVideoUrl: draft.bgVideoUrl, cursorImage: draft.cursorImage, cursorSize: draft.cursorSize,
        musicUrl: draft.musicUrl, musicTitle: draft.musicTitle, musicArtist: draft.musicArtist,
        bgEffectType: draft.bgEffectType, usernameEffectType: draft.usernameEffectType,
        profileOpacity: draft.profileOpacity, profileBlur: draft.profileBlur,
        glowUsername: draft.glowUsername, glowSocials: draft.glowSocials, glowBadges: draft.glowBadges,
        monochromeIcons: draft.monochromeIcons, volumeControl: draft.volumeControl,
        useDiscordAvatar: draft.useDiscordAvatar, discordAvatarDecoration: draft.discordAvatarDecoration,
        swapBoxColors: draft.swapBoxColors, animatedTitle: draft.animatedTitle,
        startMessage: draft.startMessage,
        startMessageFont: draft.startMessageFont || '',
        glowStyle: draft.glowStyle || 'text-shadow',
        usernameGlowStyle: draft.usernameGlowStyle || 'text-shadow',
        startMessageGlow: draft.startMessageGlow ?? false,
        badges: JSON.stringify(draft.badges),
        links: draft.links,
      });
      toast.success('Saved!');
    } catch (e) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const update = (k: string, v: unknown) => setDraft({ ...draft, [k]: v });
  const handleLogout = async () => { await createClient().auth.signOut(); router.push('/login'); };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0f]"
      style={{ background: 'radial-gradient(ellipse at center, rgba(196,181,253,0.05) 0%, transparent 60%), #0a0a0f' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border border-[#c4b5fd]/20 animate-pulse" style={{ animation: 'dash-save-pulse 2s ease-in-out infinite' }} />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-t border-[#c4b5fd]/60 animate-spin" />
        </div>
        <div className="text-sm text-[#c4b5fd]/60 tracking-wider animate-pulse">Loading dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(196,181,253,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.03) 0%, transparent 50%), #0a0a0f' }}>
      <style>{`
        @keyframes dash-glow { 0%,100% { box-shadow: 0 0 8px rgba(196,181,253,0.08), 0 0 16px rgba(196,181,253,0.04); } 50% { box-shadow: 0 0 20px rgba(196,181,253,0.15), 0 0 40px rgba(196,181,253,0.06); } }
        @keyframes dash-border-shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes dash-slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dash-neon-toggle { 0%,100% { box-shadow: 0 0 4px rgba(196,181,253,0.3); } 50% { box-shadow: 0 0 12px rgba(196,181,253,0.6), 0 0 24px rgba(196,181,253,0.2); } }
        @keyframes dash-save-pulse { 0%,100% { box-shadow: 0 0 8px rgba(196,181,253,0.3); } 50% { box-shadow: 0 0 24px rgba(196,181,253,0.6), 0 0 48px rgba(196,181,253,0.15); } }
        .dash-card { background: rgba(17,17,24,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); animation: dash-slide-in 0.4s ease-out both; }
        .dash-card:hover { border-color: rgba(196,181,253,0.2); box-shadow: 0 0 20px rgba(196,181,253,0.06), 0 8px 32px rgba(0,0,0,0.3); transform: translateY(-1px); }
        .dash-btn { position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .dash-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.06), transparent); transform: translateX(-100%); transition: transform 0.6s; }
        .dash-btn:hover::after { transform: translateX(100%); }
        .dash-glow-active { animation: dash-neon-toggle 2s ease-in-out infinite; }
        .dash-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
        .dash-input:focus { border-color: rgba(196,181,253,0.3); box-shadow: 0 0 0 3px rgba(196,181,253,0.06), 0 0 15px rgba(196,181,253,0.04); outline: none; }
        .dash-input:hover { border-color: rgba(255,255,255,0.12); }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; height: 6px; }
        input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); transition: background 0.3s; }
        input[type=range]:hover::-webkit-slider-runnable-track { background: rgba(255,255,255,0.1); }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #c4b5fd; margin-top: -5px; box-shadow: 0 0 10px rgba(196,181,253,0.3); transition: all 0.3s; }
        input[type=range]:hover::-webkit-slider-thumb { box-shadow: 0 0 20px rgba(196,181,253,0.5); transform: scale(1.1); }
        input[type=range]::-moz-range-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); }
        input[type=range]:hover::-moz-range-track { background: rgba(255,255,255,0.1); }
        input[type=range]::-moz-range-thumb { height: 16px; width: 16px; border-radius: 50%; background: #c4b5fd; border: none; box-shadow: 0 0 10px rgba(196,181,253,0.3); }
        .scroll-fancy { scrollbar-width: thin; scrollbar-color: rgba(196,181,253,0.15) transparent; }
        .scroll-fancy::-webkit-scrollbar { width: 4px; }
        .scroll-fancy::-webkit-scrollbar-track { background: transparent; }
        .scroll-fancy::-webkit-scrollbar-thumb { background: rgba(196,181,253,0.15); border-radius: 99px; }
        .scroll-fancy::-webkit-scrollbar-thumb:hover { background: rgba(196,181,253,0.3); }
        .sidebar-item { position: relative; overflow: hidden; }
        .sidebar-item::before { content: ''; position: absolute; left: 0; top: 50%; translate: 0 -50%; width: 2px; height: 0; background: #c4b5fd; border-radius: 0 2px 2px 0; transition: height 0.3s ease; }
        .sidebar-item-active::before { height: 60%; }
        .sidebar-item-active { background: rgba(196,181,253,0.08) !important; border-color: rgba(196,181,253,0.15) !important; }
      `}</style>
      {/* ─── Sidebar ─── */}
      <aside className="flex w-[200px] shrink-0 flex-col border-r border-white/5 bg-[#0d0d14]/90 backdrop-blur-xl relative">
        <div className="relative border-b border-white/5 px-5 py-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c4b5fd]/5 via-transparent to-transparent" />
          <div className="relative">
            <div className="text-sm font-bold tracking-[0.12em] uppercase" style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ProfileOS</div>
            <div className="mt-0.5 text-[10px] text-white/25 tracking-wider">control panel</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 scroll-fancy">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.label} className="mb-2">
              <button onClick={() => setSidebarOpen({ ...sidebarOpen, [group.label]: !sidebarOpen[group.label] })}
                className="flex w-full items-center gap-1.5 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/20 transition-colors hover:text-white/40">
                <span className={`text-[8px] transition-all duration-300 ${sidebarOpen[group.label] ? 'rotate-90 text-[#c4b5fd]/60' : ''}`}>▶</span>
                {group.icon} {group.label}
              </button>
              {sidebarOpen[group.label] && group.items.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`sidebar-item flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-300 mb-0.5 ${
                    tab === item.id
                      ? 'sidebar-item-active border-[#c4b5fd]/15 text-[#c4b5fd]'
                      : 'border-transparent text-white/40 hover:bg-[#c4b5fd]/6 hover:text-white/75'
                  }`}>
                  <span className={`text-sm transition-all duration-300 ${tab === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
                  {item.label}
                  {tab === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c4b5fd] animate-pulse" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/5 p-3">
          <button onClick={handleLogout}
            className="dash-btn w-full rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300">
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0d0d14]/80 backdrop-blur-xl px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c4b5fd]/3 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-sm font-bold capitalize flex items-center gap-2">
              {tab}
              <span className="w-1.5 h-1.5 rounded-full bg-[#c4b5fd]/40 animate-pulse" />
            </div>
            <div className="text-[10px] text-white/25 tracking-wider">
              {tab === 'dashboard' && 'Profile overview'} {tab === 'analytics' && 'View stats'}
              {tab === 'badges' && 'Badge management'} {tab === 'settings' && 'Account settings'}
              {tab === 'customize' && 'Appearance customization'} {tab === 'links' && 'Social media links'}
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            <button onClick={() => window.open(`/${draft.displayName.toLowerCase().replace(/\s+/g, '_')}`, '_blank')}
              className="dash-btn rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/50 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/15 transition-all duration-300">
              👁 Preview
            </button>
            <button onClick={save} disabled={saving}
              className="dash-btn rounded-lg border border-[#c4b5fd] bg-[#c4b5fd] px-3.5 py-2 text-xs font-semibold text-[#1a0a3c] hover:bg-[#d8ccff] disabled:opacity-50 transition-all duration-300"
              style={{ animation: saving ? undefined : 'dash-save-pulse 3s ease-in-out infinite' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 scroll-fancy">
          {/* ═══ DASHBOARD ═══ */}
          {tab === 'dashboard' && (
            <div className="max-w-xl space-y-4">
              <div className="dash-card rounded-xl border border-[#c4b5fd]/12 px-[18px] py-3.5" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1 font-mono text-[9px] font-medium uppercase tracking-wider text-white/25">total views</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-[28px] font-extrabold text-[#c4b5fd]">{views?.totalViews?.toLocaleString() || 0}</span>
                      <span className="text-xs text-white/30">all time</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#34d399]">
                    <span className="h-[7px] w-[7px] rounded-full bg-[#34d399] animate-pulse" />{views?.uniqueVisitors || 0} unique
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '100ms' }}>
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Links</div>
                  <div className="text-2xl font-bold text-[#e8e6f0]">{draft.links.length}</div>
                </div>
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '200ms' }}>
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Badges</div>
                  <div className="text-2xl font-bold text-[#e8e6f0]">{draft.badges.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ANALYTICS ═══ */}
          {tab === 'analytics' && (
            <div className="max-w-xl space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '0ms' }}>
                  <div className="text-[10px] text-white/35 mb-1">Today</div>
                  <div className="text-xl font-bold text-[#c4b5fd]">{views?.viewsToday || 0}</div>
                </div>
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '50ms' }}>
                  <div className="text-[10px] text-white/35 mb-1">This Week</div>
                  <div className="text-xl font-bold text-[#34d399]">{views?.viewsWeek || 0}</div>
                </div>
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '100ms' }}>
                  <div className="text-[10px] text-white/35 mb-1">This Month</div>
                  <div className="text-xl font-bold text-[#fbbf24]">{views?.viewsMonth || 0}</div>
                </div>
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '150ms' }}>
                  <div className="text-[10px] text-white/35 mb-1">Unique Visitors</div>
                  <div className="text-xl font-bold text-white/80">{views?.uniqueVisitors || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ BADGES ═══ */}
          {tab === 'badges' && (
            <div className="max-w-xl space-y-4">
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '0ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Your Badges</div>
                <p className="text-xs text-white/30 mb-4">Upload GIFs that appear under your avatar on your profile.</p>
                <UploadZone accept="image/gif,image/png,image/webp" label="Upload Badge" hint="GIF / PNG (max 2MB)" icon="⊞"
                  currentUrl="" onUpload={async (url) => {
                    update('badges', [...draft.badges, url]);
                  }} />
                {draft.badges.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {draft.badges.map((badge, i) => (
                      <div key={i} className="relative group">
                        <img src={badge} className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                        <button onClick={() => update('badges', draft.badges.filter((_, idx) => idx !== i))}
                          className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ SETTINGS ═══ */}
          {tab === 'settings' && (
            <div className="max-w-xl space-y-4">
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '0ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Account</div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-xs text-white/40">Display Name</div>
                    <input value={draft.displayName} onChange={(e) => update('displayName', e.target.value)}
                      className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80" />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/40">Start Message</div>
                    <input value={draft.startMessage} onChange={(e) => update('startMessage', e.target.value)}
                      placeholder="Click anywhere to enter"
                      className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80" />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/40">Start Message Font</div>
                    <div className="flex gap-2">
                      <select value={draft.startMessageFont || ''} onChange={(e) => update('startMessageFont', e.target.value)}
                        className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none focus:border-[#c4b5fd]/40">
                        {FONTS.map((f) => <option key={f.value} value={f.value} style={{ color: '#e8e6f0', background: '#1a1a2e', fontFamily: f.value || undefined }}>{f.label}</option>)}
                      </select>
                      <input value={draft.startMessageFont || ''} onChange={(e) => update('startMessageFont', e.target.value)}
                        placeholder="Custom font name..."
                        className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none focus:border-[#c4b5fd]/40 font-mono" />
                    </div>
                    {draft.startMessageFont && (
                      <div className="mt-1 text-xs text-white/30" style={{ fontFamily: draft.startMessageFont }}>
                        Preview: {draft.startMessage || 'Click anywhere to enter'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/40">Username</div>
                    <div className="h-9 flex items-center rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/60">
                      {draft.displayName.toLowerCase().replace(/\s+/g, '_')}
                    </div>
                    <div className="text-[10px] text-white/20 mt-0.5">Your profile: /{draft.displayName.toLowerCase().replace(/\s+/g, '_')}</div>
                  </div>
                </div>
              </div>
              <div className="dash-card rounded-xl border-red-500/10 p-4" style={{ animationDelay: '100ms' }}>
                <div className="mb-2 text-xs font-semibold text-red-400/80 uppercase tracking-wider">Danger Zone</div>
                <p className="text-xs text-white/30 mb-3">Permanently deletes your profile and all data.</p>
                <button className="dash-btn rounded-lg border border-red-500/25 bg-red-500/8 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all duration-300">Delete Account</button>
              </div>
            </div>
          )}

          {/* ═══ CUSTOMIZE ═══ */}
          {tab === 'customize' && (
            <div className="max-w-2xl space-y-4">
              {/* Media Uploads */}
              <div className="grid grid-cols-2 gap-3">
                <UploadZone accept="video/mp4,video/webm" label="Background" hint="MP4 / WebM" icon="▶"
                  currentUrl={draft.bgVideoUrl} onUpload={(url) => update('bgVideoUrl', url)} />
                <UploadZone accept="audio/mpeg,audio/ogg,audio/wav" label="Audio" hint="MP3 / OGG" icon="♫"
                  currentUrl={draft.musicUrl} onUpload={(url, name) => {
                    update('musicUrl', url);
                    if (name) {
                      const clean = name.replace(/\.(mp3|ogg|wav|flac)$/i, '');
                      update('musicTitle', clean);
                    }
                  }} />
                <UploadZone accept="image/*" label="Profile Avatar" hint="PNG / JPG / GIF" icon="◒"
                  currentUrl={draft.avatarUrl} onUpload={(url) => update('avatarUrl', url)} />
                <UploadZone accept="image/*,.gif,.cur" label="Custom Cursor" hint=".cur / .png / .gif" icon="◂"
                  currentUrl={draft.cursorImage} onUpload={(url) => update('cursorImage', url)} />
              </div>

              {/* Music details */}
              {(draft.musicUrl) && (
                <div className="dash-card rounded-xl p-4" style={{ animationDelay: '100ms' }}>
                  <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Audio Details</div>
                  <div className="flex gap-2">
                    <input value={draft.musicTitle} onChange={(e) => update('musicTitle', e.target.value)}
                      placeholder="Track title" className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none focus:border-[#c4b5fd]/40" />
                    <input value={draft.musicArtist} onChange={(e) => update('musicArtist', e.target.value)}
                      placeholder="Artist" className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none focus:border-[#c4b5fd]/40" />
                  </div>
                </div>
              )}

              {/* General Customization */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '150ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">General</div>
                <div className="space-y-3">
                  <input value={draft.bio} onChange={(e) => update('bio', e.target.value)}
                    placeholder="Description / Bio" className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80" />

                  {/* Discord Presence */}
                  <div className="flex items-center justify-between rounded-lg border border-white/6 bg-[#0d0d14]/80 px-3 py-2.5 backdrop-blur-sm">
                    <div className="text-xs text-white/70">Discord Presence</div>
                    <button onClick={() => update('useDiscordAvatar', !draft.useDiscordAvatar)}
                      className={`h-5 w-9 rounded-full transition-all duration-300 ${draft.useDiscordAvatar ? 'bg-[#c4b5fd] dash-glow-active' : 'bg-white/8'}`}>
                      <div className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ${draft.useDiscordAvatar ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5 ml-0.5`} />
                    </button>
                  </div>

                  {/* Background Effects */}
                  <div>
                    <div className="mb-1.5 text-xs text-white/50">Background Effect</div>
                    <select value={draft.bgEffectType} onChange={(e) => update('bgEffectType', e.target.value)}
                      className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80">
                      <option value="" style={{ color: '#888', background: '#1a1a2e' }}>None</option>
                      {EFFECTS.map((e) => <option key={e} value={e} style={{ color: '#e8e6f0', background: '#1a1a2e' }}>{e}</option>)}
                    </select>
                  </div>

                  {/* Username Effects */}
                  <div>
                    <div className="mb-1.5 text-xs text-white/50">Username Effect</div>
                    <select value={draft.usernameEffectType} onChange={(e) => update('usernameEffectType', e.target.value)}
                      className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80">
                      <option value="" style={{ color: '#888', background: '#1a1a2e' }}>None</option>
                      {USERNAME_EFFECTS.map((e) => <option key={e} value={e} style={{ color: '#e8e6f0', background: '#1a1a2e' }}>{e}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sliders */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '200ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Adjustments</div>
                <div className="space-y-4">
                  {[
                    { key: 'profileOpacity', label: 'Profile Opacity', min: 0, max: 100, suffix: '%' },
                    { key: 'profileBlur', label: 'Profile Blur', min: 0, max: 20, suffix: 'px' },
                    { key: 'cursorSize', label: 'Cursor Size', min: 16, max: 64, suffix: 'px' },
                  ].map((s) => (
                    <div key={s.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">{s.label}</span>
                        <span className="font-mono text-[10px] text-[#c4b5fd]">{(draft as any)[s.key]}{s.suffix}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max}
                        value={(draft as any)[s.key]}
                        onChange={(e) => update(s.key, Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-[#c4b5fd] cursor-pointer" />
                    </div>
                  ))}

                  <input value={draft.location} onChange={(e) => update('location', e.target.value)}
                    placeholder="Location (e.g. San Francisco, CA)" className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80" />
                </div>
              </div>

              {/* Glow Settings */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '250ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Glow Settings</div>
                <div className="space-y-2">
                  {[
                    { key: 'glowUsername', label: 'Username Glow' },
                    { key: 'glowSocials', label: 'Socials Glow' },
                    { key: 'glowBadges', label: 'Badges Glow' },
                  ].map((g) => (
                    <div key={g.key} className="flex items-center justify-between rounded-lg border border-white/6 bg-[#0d0d14]/80 px-3 py-2.5 backdrop-blur-sm">
                      <span className="text-xs text-white/70">{g.label}</span>
                      <button onClick={() => update(g.key, !(draft as any)[g.key])}
                        className={`h-5 w-9 rounded-full transition-all duration-300 ${(draft as any)[g.key] ? 'bg-[#c4b5fd] dash-glow-active' : 'bg-white/8'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ${(draft as any)[g.key] ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5 ml-0.5`} />
                      </button>
                    </div>
                  ))}
                  <div>
                    <div className="mb-1.5 text-xs text-white/50 mt-3">Username Glow Style</div>
                    <select value={draft.glowStyle || 'text-shadow'} onChange={(e) => update('glowStyle', e.target.value)}
                      className="dash-input h-9 w-full rounded-lg px-3 text-sm text-white/80">
                      {GLOW_STYLES.map((s) => <option key={s.value} value={s.value} style={{ color: '#e8e6f0', background: '#1a1a2e' }}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/6 bg-[#0d0d14]/80 px-3 py-2.5 backdrop-blur-sm">
                    <span className="text-xs text-white/70">Start Message Glow</span>
                    <button onClick={() => update('startMessageGlow', !draft.startMessageGlow)}
                      className={`h-5 w-9 rounded-full transition-all duration-300 ${draft.startMessageGlow ? 'bg-[#c4b5fd] dash-glow-active' : 'bg-white/8'}`}>
                      <div className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ${draft.startMessageGlow ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5 ml-0.5`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Toggles */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '300ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Other</div>
                <div className="space-y-2">
                  {[
                    { key: 'monochromeIcons', label: 'Monochrome Icons' },
                    { key: 'volumeControl', label: 'Volume Control' },
                    { key: 'discordAvatarDecoration', label: 'Discord Avatar Decoration' },
                    { key: 'swapBoxColors', label: 'Swap Box Colors' },
                    { key: 'animatedTitle', label: 'Animated Title' },
                  ].map((t) => (
                    <div key={t.key} className="flex items-center justify-between rounded-lg border border-white/6 bg-[#0d0d14]/80 px-3 py-2.5 backdrop-blur-sm">
                      <span className="text-xs text-white/70">{t.label}</span>
                      <button onClick={() => update(t.key, !(draft as any)[t.key])}
                        className={`h-5 w-9 rounded-full transition-all duration-300 ${(draft as any)[t.key] ? 'bg-[#c4b5fd] dash-glow-active' : 'bg-white/8'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ${(draft as any)[t.key] ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5 ml-0.5`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '350ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Colors</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50 w-20">Background</span>
                    <input type="color" value={draft.bgColor} onChange={(e) => update('bgColor', e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
                    <input value={draft.bgColor} onChange={(e) => update('bgColor', e.target.value)}
                      className="dash-input h-9 flex-1 rounded-lg px-3 font-mono text-sm text-white/80" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/50 w-20">Accent</span>
                      <input type="color" value={draft.accentColor} onChange={(e) => update('accentColor', e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
                      <input value={draft.accentColor} onChange={(e) => update('accentColor', e.target.value)}
                        className="dash-input h-9 flex-1 rounded-lg px-3 font-mono text-sm text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ LINKS ═══ */}
          {tab === 'links' && (
            <div className="max-w-2xl space-y-4">
              {/* Social Media Grid */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '0ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Add Social Media</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {SOCIALS.map((s) => {
                    const added = draft.links.some(l => l.platform === s.id);
                    return (
                      <button key={s.id} onClick={() => {
                        if (added) return;
                        const url = window.prompt(`Enter your ${s.label} URL:`);
                        if (url) {
                          setDraft({ ...draft, links: [...draft.links, { platform: s.id, url, label: s.label, hidden: false }] });
                        }
                      }}
                        className={`dash-btn flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-all duration-300 ${
                          added ? 'border-[#c4b5fd]/25 bg-[#c4b5fd]/8 opacity-60' : 'border-white/6 bg-[#0d0d14]/80 hover:border-[#c4b5fd]/20 hover:bg-[#c4b5fd]/4'
                        }`}>
                        <span className="flex h-7 w-7 items-center justify-center rounded-md text-white"
                          style={{ backgroundColor: s.color }}>
                          <SocialIcon id={s.id} size={16} />
                        </span>
                        <span className="text-[8px] text-white/50 truncate w-full">{s.label}</span>
                        {added && <span className="text-[7px] text-[#c4b5fd]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom URL */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '100ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Add Custom URL</div>
                <div className="flex gap-2">
                  <input value={newLink.platform} onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    placeholder="Label" className="dash-input h-9 w-28 rounded-lg px-3 text-sm text-white/80" />
                  <input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://..." className="dash-input h-9 flex-1 rounded-lg px-3 text-sm text-white/80" />
                  <UploadZone accept="image/*" label="Image" hint="" icon="◒"
                    currentUrl="" onUpload={(url) => {
                      const name = url.split('/').pop() || 'image';
                      if (url) setDraft({ ...draft, links: [...draft.links, { platform: 'image', url, label: name, hidden: false }] });
                    }} />
                  <button onClick={() => {
                    if (!newLink.url) return;
                    setDraft({ ...draft, links: [...draft.links, { ...newLink, hidden: false }] });
                    setNewLink({ platform: '', url: '', label: '' });
                  }} className="dash-btn h-9 rounded-lg bg-[#c4b5fd] px-4 text-xs font-semibold text-[#1a0a3c] hover:bg-[#d8ccff] transition-all duration-300">Add</button>
                </div>
              </div>

              {/* Links List (drag-to-reorder) */}
              <div className="dash-card rounded-xl p-4" style={{ animationDelay: '200ms' }}>
                <div className="mb-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Your Links ({draft.links.length}) <span className="text-[9px] text-white/20 font-normal">— drag to reorder</span>
                </div>
                {draft.links.length === 0 ? (
                  <div className="py-6 text-center text-sm text-white/20">No links yet. Click a social icon above or add a custom URL.</div>
                ) : (
                  <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                    {draft.links.map((link, i) => (
                      <DragLink key={i} link={link} i={i}
                        onRemove={(idx) => update('links', draft.links.filter((_, j) => j !== idx))}
                        onMove={(from, to) => {
                          const arr = [...draft.links];
                          const [moved] = arr.splice(from, 1);
                          arr.splice(to, 0, moved);
                          update('links', arr);
                        }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
