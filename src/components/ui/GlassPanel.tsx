import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  intensity?: 'low' | 'medium' | 'high';
}

const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

const intensityClasses = {
  low: 'bg-white/[0.02] border-white/[0.05]',
  medium: 'bg-white/[0.05] border-white/[0.1]',
  high: 'bg-white/[0.08] border-white/[0.15]',
};

export function GlassPanel({
  children,
  className,
  hover = false,
  padding = 'md',
  intensity = 'medium',
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl backdrop-blur-xl border shadow-lg',
        intensityClasses[intensity],
        paddingClasses[padding],
        hover && 'transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.2]',
        className
      )}
    >
      {children}
    </div>
  );
}

// Compact panel variant for list items
export function GlassCard({
  children,
  className,
  onClick,
  selected = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg border transition-all duration-200 cursor-pointer',
        'bg-white/[0.03] border-white/[0.08]',
        'hover:bg-white/[0.06] hover:border-white/[0.15]',
        selected && 'bg-primary/20 border-primary/50',
        className
      )}
    >
      {children}
    </div>
  );
}
