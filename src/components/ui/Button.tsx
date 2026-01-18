import { cn } from '../../lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost' | 'danger' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const variantClasses = {
  default:
    'bg-background-dark light-mode:bg-white border-border-dark light-mode:border-border-light text-foreground hover:border-primary/50',
  primary:
    'bg-primary border-primary text-white hover:bg-primary-hover hover:border-primary-hover',
  ghost:
    'bg-transparent border-transparent text-muted-dark light-mode:text-muted-light hover:text-foreground hover:bg-white/5 light-mode:hover:bg-black/5',
  danger:
    'bg-error/10 border-error/50 text-error hover:bg-error/20',
  custom: '',
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
        'text-muted-dark light-mode:text-muted-light hover:text-foreground hover:bg-white/5 light-mode:hover:bg-black/5',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
