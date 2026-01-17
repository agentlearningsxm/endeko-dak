import { cn } from '../../lib/utils';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-white/[0.05] border border-white/[0.1]',
            'text-white placeholder:text-white/30',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'transition-all duration-200',
            icon && 'pl-10',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <textarea
        className={cn(
          'w-full px-3 py-2 rounded-lg resize-none',
          'bg-white/[0.05] border border-white/[0.1]',
          'text-white placeholder:text-white/30',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          'transition-all duration-200',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <select
        className={cn(
          'w-full px-3 py-2 rounded-lg appearance-none',
          'bg-white/[0.05] border border-white/[0.1]',
          'text-white',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          'transition-all duration-200',
          'cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-background">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
