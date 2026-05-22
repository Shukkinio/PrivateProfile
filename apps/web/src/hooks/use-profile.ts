'use client';

import { createContext, useContext } from 'react';

export interface ProfileData {
  id?: string;
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
  customCursor: boolean;
  cursorImage: string;
  discordPresence: boolean;
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
  favicon: string;
  seoTitle: string;
  seoDesc: string;
  seoImage: string;
  animatedTitle: boolean;
  [key: string]: unknown;
}

export interface LinkData {
  id?: string;
  platform: string;
  url: string;
  label: string;
  hidden: boolean;
  order: number;
}

export interface TrackData {
  id?: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  order: number;
}

export interface ProfileContextType {
  profile: ProfileData | null;
  links: LinkData[];
  tracks: TrackData[];
  loading: boolean;
  saving: boolean;
  saveProfile: (data: Partial<ProfileData>) => Promise<void>;
  saveLinks: (links: LinkData[]) => Promise<void>;
  saveTracks: (tracks: TrackData[]) => Promise<void>;
  publish: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  links: [],
  tracks: [],
  loading: true,
  saving: false,
  saveProfile: async () => {},
  saveLinks: async () => {},
  saveTracks: async () => {},
  publish: async () => {},
  refresh: async () => {},
});

export function useProfile() {
  return useContext(ProfileContext);
}
