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
  low: 'bg-background-dark light-mode:bg-background-light border-border-dark light-mode:border-border-light',
  medium: 'bg-panel-dark light-mode:bg-panel-light border-border-dark light-mode:border-border-light',
  high: 'bg-[#1C2E4A] light-mode:bg-white border-primary/30',
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
        'rounded-xl border shadow-xl transition-colors duration-200',
        intensityClasses[intensity],
        paddingClasses[padding],
        hover && 'hover:border-primary/50 hover:shadow-2xl',
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
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm',
        'bg-panel-dark light-mode:bg-panel-light border-border-dark light-mode:border-border-light',
        'hover:border-primary/50 hover:shadow-md',
        selected && 'border-primary ring-1 ring-primary/20 bg-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
}
