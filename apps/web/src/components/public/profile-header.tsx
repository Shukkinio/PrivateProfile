'use client';

import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  avatar?: string;
  username: string;
  displayName?: string;
  bio?: string;
  location?: string;
  layout?: 'centered-card' | 'fullscreen-hero' | 'split' | 'minimal' | 'floating-glass' | 'cyberpunk' | 'monochrome' | 'terminal';
}

export function ProfileHeader({
  avatar,
  username,
  displayName,
  bio,
  location,
  layout = 'centered-card',
}: ProfileHeaderProps) {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  if (layout === 'fullscreen-hero') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-[#c4b5fd]/30 shadow-[0_0_40px_rgba(196,181,253,0.15)]">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c4b5fd]/20 to-purple-900/20 text-4xl">
              {displayName?.[0] || username[0]}
            </div>
          </div>
        </motion.div>
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-5xl font-extrabold tracking-tight">
          <span className="text-gradient">{displayName || username}</span>
        </motion.h1>
        {location && (
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-2 flex items-center gap-1.5 text-sm text-white/40">
            <span>📍</span> {location}
          </motion.div>
        )}
        {bio && (
          <motion.p custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mt-4 max-w-md text-center text-base text-white/50 leading-relaxed">
            {bio}
          </motion.p>
        )}
      </div>
    );
  }

  if (layout === 'minimal') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border border-white/10">
            <div className="flex h-full w-full items-center justify-center bg-white/5 text-lg text-white/60">
              {displayName?.[0] || username[0]}
            </div>
          </div>
        </motion.div>
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mt-4 text-2xl font-light tracking-wide text-white/80">
          {displayName || username}
        </motion.h1>
        {bio && (
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-3 max-w-sm text-center text-sm font-light text-white/30 leading-relaxed">
            {bio}
          </motion.p>
        )}
      </div>
    );
  }

  if (layout === 'terminal') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 font-mono">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-lg rounded-xl border border-[#34d399]/20 bg-black/60 p-6 backdrop-blur"
        >
          <div className="flex items-center gap-2 border-b border-[#34d399]/10 pb-3 text-[10px] text-[#34d399]/50">
            <span className="h-2 w-2 rounded-full bg-red-500/50" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
            <span className="h-2 w-2 rounded-full bg-[#34d399]/50" />
            <span className="ml-2">profile@os:~/profile</span>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="text-[#34d399]">$</span> cat profile.json
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span className="text-white/70">{'{'}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="ml-4">
              <span className="text-blue-400/60">"name"</span>: <span className="text-[#34d399]">"{displayName || username}"</span>
            </motion.div>
            {bio && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="ml-4">
                <span className="text-blue-400/60">"bio"</span>: <span className="text-[#34d399]">"{bio}"</span>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <span className="text-white/70">{'}'}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              <span className="text-[#34d399]">$</span> <span className="animate-pulse">▊</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default: centered-card
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
        style={{
          boxShadow: '0 0 40px rgba(196, 181, 253, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#c4b5fd]/20"
          style={{ boxShadow: '0 0 30px rgba(196, 181, 253, 0.1)' }}
        >
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c4b5fd]/15 to-purple-900/15 text-3xl">
            {displayName?.[0] || username[0]}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-center text-2xl font-bold"
        >
          <span className="text-gradient">{displayName || username}</span>
        </motion.h1>

        {location && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-1.5 flex items-center justify-center gap-1 text-sm text-white/40"
          >
            <span>📍</span> {location}
          </motion.div>
        )}

        {bio && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-sm text-white/50 leading-relaxed"
          >
            {bio}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex justify-center gap-3"
        >
          {['GitHub', 'Twitter', 'YouTube'].map((link) => (
            <a
              key={link}
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs text-white/40 transition-all hover:border-[#c4b5fd]/30 hover:text-[#c4b5fd] hover:bg-[#c4b5fd]/5"
            >
              {link[0]}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
