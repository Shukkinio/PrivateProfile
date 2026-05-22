'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel, Toggle } from 'ui';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardLabel>Account</CardLabel>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 text-xs text-white/60">Email</div>
            <input defaultValue="user@example.com" className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80" />
          </div>
          <div>
            <div className="mb-1.5 text-xs text-white/60">Username</div>
            <input defaultValue="yourname" className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80" />
          </div>
          <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white">
            Change Password
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>Preferences</CardLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Auto-publish changes</span>
              <Toggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Email notifications</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Analytics tracking</span>
              <Toggle checked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Public profile</span>
              <Toggle checked />
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Danger Zone</CardLabel>
          <div className="mt-3 space-y-3">
            <button className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20">
              Export Profile Data
            </button>
            <button className="w-full rounded-lg border border-red-500/30 bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/25">
              Delete Account
            </button>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
