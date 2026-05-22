'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Toggle } from 'ui';

interface FeatureCardProps {
  icon: string;
  iconColor: 'purple' | 'teal' | 'amber' | 'green' | 'coral' | 'blue';
  title: string;
  description: string;
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  className?: string;
  compact?: boolean;
  badge?: string;
  badgeColor?: string;
}

const iconBgMap = {
  purple: 'bg-[#c4b5fd]/12 text-[#c4b5fd]',
  teal: 'bg-[#2dd4bf]/12 text-[#2dd4bf]',
  amber: 'bg-[#fbbf24]/12 text-[#fbbf24]',
  green: 'bg-[#34d399]/12 text-[#34d399]',
  coral: 'bg-[#fb7185]/12 text-[#fb7185]',
  blue: 'bg-[#60a5fa]/12 text-[#60a5fa]',
};

export function FeatureCard({
  icon,
  iconColor,
  title,
  description,
  checked,
  onToggle,
  className,
  compact,
  badge,
  badgeColor,
}: FeatureCardProps) {
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          'flex flex-col items-start gap-2 rounded-xl border border-white/7 bg-[#111118] p-3.5 transition-colors duration-200 hover:border-[#c4b5fd]/25 hover:bg-[#13131c]',
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[14px]',
              iconBgMap[iconColor],
            )}
          >
            {icon}
          </div>
          <span className="text-xs font-bold text-[#e8e6f0]">{title}</span>
        </div>
        {badge && (
          <span
            className={cn(
              'rounded-md border px-2 py-[2px] font-mono text-[10px] font-medium',
              badgeColor === 'teal'
                ? 'border-[#2dd4bf]/20 bg-[#2dd4bf]/12 text-[#2dd4bf]'
                : 'border-[#c4b5fd]/20 bg-[#c4b5fd]/15 text-[#c4b5fd]',
            )}
          >
            {badge}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        'flex items-start gap-3 rounded-xl border border-white/7 bg-[#111118] p-3.5 transition-all duration-200 hover:border-[#c4b5fd]/25 hover:bg-[#13131c]',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-base',
          iconBgMap[iconColor],
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-bold text-[#e8e6f0]">{title}</div>
        <div className="text-[11px] leading-relaxed text-white/30">{description}</div>
      </div>
      {onToggle && (
        <Toggle checked={checked} onCheckedChange={onToggle} />
      )}
    </motion.div>
  );
}
