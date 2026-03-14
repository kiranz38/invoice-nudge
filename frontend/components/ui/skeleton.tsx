import React from 'react';
import clsx from 'clsx';

interface SkeletonLineProps {
  className?: string;
}

const SkeletonLine: React.FC<SkeletonLineProps> = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-200 h-4 rounded', className)} />
);

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-100 rounded-lg p-4', className)}>
    <SkeletonLine className="h-6 w-1/3" />
    <SkeletonLine className="h-4 mt-3 w-full" />
    <SkeletonLine className="h-4 mt-2 w-2/3" />
  </div>
);

const SkeletonTable: React.FC<{ rows: number; cols: number; className?: string }> = ({ rows, cols, className }) => (
  <div className={clsx('animate-pulse', className)}>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-4 py-2">
        {Array.from({ length: cols }, (_, j) => (
          <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export { SkeletonLine, SkeletonCard, SkeletonTable };