'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ProfileContext, type ProfileData, type LinkData, type TrackData } from '@/hooks/use-profile';
import { api } from '@/lib/api-client';

const DEFAULT_PROFILE: ProfileData = {
  displayName: 'User',
  bio: '',
  location: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  layoutType: 'centered-card',
  theme: 'neon-void',
  usernameEffect: 'gradient',
  bioEffect: 'fade-in',
  introEnabled: true,
  introText: 'ProfileOS',
  customCursor: false,
  cursorImage: '',
  discordPresence: true,
  musicWidget: false,
  bgVideoUrl: '',
  bgEffects: [],
  effectIntensity: 50,
  blurAmount: 0,
  brightness: 100,
  saturation: 100,
  glowIntensity: 50,
  accentColor: '#c4b5fd',
  embedColor: '#c4b5fd',
  favicon: '',
  seoTitle: '',
  seoDesc: '',
  seoImage: '',
  animatedTitle: false,
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<{ profile: ProfileData; links: LinkData[]; tracks: TrackData[] }>('/profile');
      if (data.profile) {
        setProfile({ ...DEFAULT_PROFILE, ...data.profile });
      } else {
        setProfile(DEFAULT_PROFILE);
      }
      setLinks(data.links || []);
      setTracks(data.tracks || []);
    } catch {
      setProfile(DEFAULT_PROFILE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveProfile = useCallback(async (data: Partial<ProfileData>) => {
    setSaving(true);
    try {
      const merged = { ...profile, ...data };
      await api.put('/profile', merged);
      setProfile(merged as ProfileData);
    } finally {
      setSaving(false);
    }
  }, [profile]);

  const saveLinks = useCallback(async (newLinks: LinkData[]) => {
    setSaving(true);
    try {
      await api.put('/links', { links: newLinks });
      setLinks(newLinks);
    } finally {
      setSaving(false);
    }
  }, []);

  const saveTracks = useCallback(async (newTracks: TrackData[]) => {
    setSaving(true);
    try {
      await api.put('/profile', { tracks: newTracks });
      setTracks(newTracks);
    } finally {
      setSaving(false);
    }
  }, []);

  const publish = useCallback(async () => {
    setSaving(true);
    try {
      await api.post('/profile/publish');
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, links, tracks, loading, saving, saveProfile, saveLinks, saveTracks, publish, refresh }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
