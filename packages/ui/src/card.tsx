import { cn } from './utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/7 bg-[#111118] p-4 transition-colors duration-200 hover:border-[#c4b5fd]/25',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mb-2.5 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

export function CardLabel({ className, children, ...props }: CardProps) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] uppercase tracking-wider text-white/35',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function CardValue({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('text-[22px] font-extrabold leading-none text-[#e8e6f0]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardDesc({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mt-1 text-[11px] text-white/30', className)} {...props}>
      {children}
    </div>
  );
}
