'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${location.origin}/api/auth/discord/callback` },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-profile-bg">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-white/7 bg-[#111118] p-8">
        <div className="text-center">
          <div className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#c4b5fd]">
            ProfileOS
          </div>
          <p className="mt-1 font-mono text-[10px] text-white/30">sign in to your control panel</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 font-mono text-[11px] text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 placeholder:text-white/25 focus:border-[#c4b5fd]/40 focus:outline-none focus:ring-1 focus:ring-[#c4b5fd]/20"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 placeholder:text-white/25 focus:border-[#c4b5fd]/40 focus:outline-none focus:ring-1 focus:ring-[#c4b5fd]/20"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="flex h-9 w-full items-center justify-center rounded-lg border border-[#c4b5fd] bg-[#c4b5fd] text-sm font-semibold text-[#1a0a3c] transition-all hover:bg-[#d8ccff] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/7" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#111118] px-2 text-white/30">or</span>
          </div>
        </div>

        <button
          onClick={handleDiscordLogin}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          <span>Continue with Discord</span>
        </button>
      </div>
    </div>
  );
}
