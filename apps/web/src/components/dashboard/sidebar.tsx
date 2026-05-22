'use client';

import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: '▦', label: 'Dashboard' },
      { id: 'preview', icon: '◈', label: 'Live Preview' },
      { id: 'analytics', icon: '◉', label: 'Analytics', badge: 'LIVE' },
    ],
  },
  {
    label: 'Identity',
    items: [
      { id: 'avatar', icon: '◒', label: 'Avatar & Bio' },
      { id: 'discord', icon: '◇', label: 'Discord' },
      { id: 'location', icon: '♢', label: 'Location' },
      { id: 'links', icon: '⊹', label: 'Links' },
    ],
  },
  {
    label: 'Appearance',
    items: [
      { id: 'colors', icon: '◌', label: 'Colors & Glow' },
      { id: 'background', icon: '◇', label: 'Background' },
      { id: 'effects', icon: '✦', label: 'Effects' },
      { id: 'fonts', icon: 'T', label: 'Fonts' },
    ],
  },
  {
    label: 'Media',
    items: [
      { id: 'music', icon: '♫', label: 'Music', badge: '3' },
      { id: 'audio-widget', icon: '▶', label: 'Audio Widget' },
      { id: 'images', icon: '⊞', label: 'Image Host' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { id: 'pro-effects', icon: '✦', label: 'Pro Effects', badge: 'PRO', badgeColor: 'new' },
      { id: 'seo', icon: '◎', label: 'SEO & Meta' },
      { id: 'settings', icon: '⚙', label: 'Settings' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.replace('/dashboard', '').replace('/', '') || 'dashboard';

  const navigate = (id: string) => {
    router.push(id === 'dashboard' ? '/dashboard' : `/dashboard/${id}`);
  };

  return (
    <aside className="flex w-[200px] shrink-0 flex-col border-r border-white/7 bg-profile-surface">
      <div className="border-b border-white/6 px-[18px] py-5">
        <div className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#c4b5fd]">
          ProfileOS
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-white/30">v0.1 · control panel</div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-medium uppercase tracking-wider text-white/25">
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-2 py-[7px] text-[12.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'border-[#c4b5fd]/18 bg-[#c4b5fd]/12 text-[#c4b5fd]'
                      : 'border-transparent text-white/45 hover:bg-[#c4b5fd]/8 hover:text-white/80'
                  }`}
                >
                  <span className="text-[14px]">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto rounded-full px-[6px] py-[2px] font-mono text-[9px] font-medium ${
                        item.badgeColor === 'new'
                          ? 'bg-[#34d399]/20 text-[#34d399]'
                          : 'bg-[#c4b5fd]/20 text-[#c4b5fd]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
