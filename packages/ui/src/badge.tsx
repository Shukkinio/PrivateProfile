import { cn } from './utils';
import type { HTMLAttributes, ReactNode } from 'react';

type BadgeColor = 'purple' | 'teal' | 'amber' | 'green' | 'coral' | 'blue';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  color?: BadgeColor;
}

const colorMap: Record<BadgeColor, string> = {
  purple: 'bg-[#c4b5fd]/15 text-[#c4b5fd] border-[#c4b5fd]/20',
  teal: 'bg-[#2dd4bf]/12 text-[#2dd4bf] border-[#2dd4bf]/20',
  amber: 'bg-[#fbbf24]/12 text-[#fbbf24] border-[#fbbf24]/20',
  green: 'bg-[#34d399]/12 text-[#34d399] border-[#34d399]/20',
  coral: 'bg-[#fb7185]/12 text-[#fb7185] border-[#fb7185]/20',
  blue: 'bg-[#60a5fa]/12 text-[#60a5fa] border-[#60a5fa]/20',
};

export function Badge({ className, children, color = 'purple', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-[3px] font-mono text-[10px] font-medium border',
        colorMap[color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
