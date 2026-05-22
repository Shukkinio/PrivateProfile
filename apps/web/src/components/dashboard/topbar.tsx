'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const sectionTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: 'Manage your profile settings and view stats' },
  preview: { title: 'Live Preview', sub: 'See real-time changes across devices' },
  analytics: { title: 'Analytics', sub: 'Track views, clicks, and audience insights' },
  avatar: { title: 'Avatar & Bio', sub: 'Customize your profile identity' },
  discord: { title: 'Discord', sub: 'Connect and customize Discord presence' },
  location: { title: 'Location', sub: 'Set your location and timezone' },
  links: { title: 'Links', sub: 'Manage your social and custom links' },
  colors: { title: 'Colors & Glow', sub: 'Customize your profile color scheme' },
  background: { title: 'Background', sub: 'Set video, effects, and overlays' },
  effects: { title: 'Effects', sub: 'Configure visual effects and animations' },
  fonts: { title: 'Fonts', sub: 'Choose typography for your profile' },
  music: { title: 'Music', sub: 'Upload and manage your playlist' },
  'audio-widget': { title: 'Audio Widget', sub: 'Configure the live music player' },
  images: { title: 'Image Host', sub: 'Upload and manage your images' },
  'pro-effects': { title: 'Pro Effects', sub: 'Advanced visual effects (PRO)' },
  seo: { title: 'SEO & Metadata', sub: 'Control how your profile appears in search' },
  settings: { title: 'Settings', sub: 'Account and profile preferences' },
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const section = pathname.replace('/dashboard', '').replace('/', '') || 'dashboard';
  const info = sectionTitles[section] || sectionTitles.dashboard;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-[53px] shrink-0 items-center justify-between border-b border-white/7 bg-profile-surface px-6">
      <div>
        <h1 className="text-[15px] font-bold text-profile-text">{info.title}</h1>
        <p className="font-mono text-[10px] text-white/30">{info.sub}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => window.open('/', '_blank')}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-[7px] text-xs font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          <span>👁</span> Preview
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-[#c4b5fd] bg-[#c4b5fd] px-3.5 py-[7px] text-xs font-semibold text-[#1a0a3c] transition-all hover:bg-[#d8ccff]">
          <span>🚀</span> Publish
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-[7px] text-xs font-semibold text-white/60 transition-all hover:bg-red-500/20 hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
