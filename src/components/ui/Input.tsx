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
        <label className="block text-sm font-bold text-muted-dark light-mode:text-muted-light uppercase tracking-wider">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark light-mode:text-muted-light">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'matte-input',
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
        <label className="block text-sm font-bold text-muted-dark light-mode:text-muted-light uppercase tracking-wider">{label}</label>
      )}
      <textarea
        className={cn(
          'matte-input resize-none',
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
        <label className="block text-sm font-bold text-muted-dark light-mode:text-muted-light uppercase tracking-wider">{label}</label>
      )}
      <select
        className={cn(
          'matte-input appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-background-dark light-mode:bg-white text-foreground">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
