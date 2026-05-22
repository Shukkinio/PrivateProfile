'use client';

import { cn } from './utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'relative h-[19px] w-[34px] shrink-0 rounded-full border transition-all duration-200',
        checked
          ? 'border-[#c4b5fd] bg-[#c4b5fd]'
          : 'border-white/15 bg-white/6',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'absolute top-[2px] left-[2px] h-[13px] w-[13px] rounded-full transition-all duration-200',
          checked ? 'left-[17px] bg-[#1a0a3c]' : 'bg-white/45',
        )}
      />
    </button>
  ),
);
Toggle.displayName = 'Toggle';

export { Toggle };
