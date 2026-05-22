// Layout types
export type ProfileLayout =
  | 'centered-card'
  | 'fullscreen-hero'
  | 'split'
  | 'minimal'
  | 'floating-glass'
  | 'cyberpunk'
  | 'monochrome'
  | 'terminal';

// Theme presets
export type ThemePreset =
  | 'neon-void'
  | 'monochrome'
  | 'dracula'
  | 'glass'
  | 'cyberpunk'
  | 'minimal-white'
  | 'terminal';

// Background effects
export type BgEffect =
  | 'particles'
  | 'stars'
  | 'snow'
  | 'rain'
  | 'sakura'
  | 'smoke'
  | 'matrix'
  | 'glow-waves'
  | 'floating-orbs';

// Link platform types
export type LinkPlatform =
  | 'discord'
  | 'github'
  | 'twitch'
  | 'youtube'
  | 'tiktok'
  | 'telegram'
  | 'spotify'
  | 'custom';

// Username effects
export type UsernameEffect =
  | 'gradient'
  | 'rgb-glow'
  | 'shimmer'
  | 'glitch'
  | 'typewriter'
  | 'wave'
  | 'fire'
  | 'rainbow-pulse';

// Bio effects
export type BioEffect = 'fade-in' | 'stagger-reveal' | 'cursor-typing';

export interface ProfileLink {
  id: string;
  platform: LinkPlatform;
  url: string;
  label: string;
  hidden: boolean;
  order: number;
}

export interface ProfileSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  embedColor: string;
  animatedTitle: boolean;
}

export interface ProfileSettings {
  introEnabled: boolean;
  introText: string;
  layout: ProfileLayout;
  theme: ThemePreset;
  usernameEffect: UsernameEffect;
  bioEffect: BioEffect;
  customCursor: boolean;
  discordPresence: boolean;
  musicWidget: boolean;
  backgroundVideo: boolean;
  backgroundEffects: BgEffect[];
  effectIntensity: number;
  blurAmount: number;
  brightness: number;
  saturation: number;
  glowIntensity: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  timezone: string;
  links: ProfileLink[];
  settings: ProfileSettings;
  seo: ProfileSEO;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  liveViewers: number;
  viewsToday: number;
  viewsWeek: number;
  viewsMonth: number;
}
