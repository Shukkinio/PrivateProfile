'use client';

import { create } from 'zustand';
import type { UserProfile, AnalyticsData } from 'types';

interface ProfileState {
  profile: UserProfile | null;
  analytics: AnalyticsData | null;
  isLoading: boolean;
  isDirty: boolean;
  previewMode: 'desktop' | 'mobile';
  sidebarCollapsed: boolean;
  activeSection: string;

  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setAnalytics: (data: AnalyticsData) => void;
  setLoading: (loading: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveSection: (section: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  analytics: null,
  isLoading: true,
  isDirty: false,
  previewMode: 'desktop',
  sidebarCollapsed: false,
  activeSection: 'dashboard',

  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...partial } : null,
      isDirty: true,
    })),
  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (isLoading) => set({ isLoading }),
  setDirty: (isDirty) => set({ isDirty }),
  setPreviewMode: (previewMode) => set({ previewMode }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setActiveSection: (activeSection) => set({ activeSection }),
}));
