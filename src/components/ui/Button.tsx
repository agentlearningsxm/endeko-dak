import { cn } from '../../lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const variantClasses = {
  default:
    'bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1] hover:border-white/[0.2]',
  primary:
    'bg-primary border-primary text-white hover:bg-primary-hover hover:border-primary-hover',
  ghost:
    'bg-transparent border-transparent text-white/70 hover:bg-white/[0.05] hover:text-white',
  danger:
    'bg-error/20 border-error/50 text-error hover:bg-error/30',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  icon: 'p-2',
};

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg border',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Icon button variant
export function IconButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        'p-2 rounded-lg transition-all duration-200',
        'text-white/50 hover:text-white hover:bg-white/[0.1]',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
