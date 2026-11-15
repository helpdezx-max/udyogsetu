import React from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-industrial-300',
      className
    )}
  >
    {icon && (
      <div className="w-12 h-12 rounded-full bg-industrial-100 flex items-center justify-center text-industrial-500 mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-industrial-900 mb-1">{title}</h3>
    {description && <p className="text-sm text-industrial-500 max-w-sm mb-5">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);
