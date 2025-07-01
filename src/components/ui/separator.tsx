import React from 'react';

interface SeparatorProps {
  className?: string;
}

export function Separator({ className = '' }: SeparatorProps) {
  return (
    <hr className={`border-0 h-px bg-gray-200 dark:bg-gray-700 ${className}`} />
  );
}
