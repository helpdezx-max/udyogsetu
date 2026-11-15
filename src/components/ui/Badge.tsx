import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'verified' | 'safety' | 'warning' | 'danger' | 'outline' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-brand-50 text-brand-700 border border-brand-200',
    secondary: 'bg-industrial-100 text-industrial-800 border border-industrial-200',
    verified: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium',
    safety: 'bg-amber-50 text-amber-800 border border-amber-300 font-medium',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'bg-transparent text-industrial-700 border border-industrial-300',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-sm px-3 py-1 rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
