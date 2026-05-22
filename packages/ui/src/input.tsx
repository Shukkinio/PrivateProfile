import { cn } from './utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 placeholder:text-white/25 focus-visible:outline-none focus-visible:border-[#c4b5fd]/40 focus-visible:ring-1 focus-visible:ring-[#c4b5fd]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
