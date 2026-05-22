'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username || email.split('@')[0] } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setError('');
        setMode('login');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message === 'Invalid login credentials'
          ? 'Invalid credentials. Need an account? Switch to Sign up.'
          : signInError.message
        );
      } else {
        router.push('/dashboard');
      }
    }
    setLoading(false);
  };

  const handleDiscordLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${location.origin}/api/auth/discord/callback` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-profile-bg">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-white/7 bg-[#111118] p-8">
        <div className="text-center">
          <div className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#c4b5fd]">
            ProfileOS
          </div>
          <p className="mt-1 font-mono text-[10px] text-white/30">
            {mode === 'login' ? 'sign in to your control panel' : 'create your account'}
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 font-mono text-[11px] text-red-400">
            {error}
          </div>
        )}

        <div className="flex rounded-lg border border-white/10 p-0.5">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
              mode === 'login' ? 'bg-[#c4b5fd]/10 text-[#c4b5fd]' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
              mode === 'register' ? 'bg-[#c4b5fd]/10 text-[#c4b5fd]' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 placeholder:text-white/25 focus:border-[#c4b5fd]/40 focus:outline-none focus:ring-1 focus:ring-[#c4b5fd]/20"
            />
          )}
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
            {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account'}
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
          disabled={loading}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          Continue with Discord
        </button>
      </div>
    </div>
  );
}
