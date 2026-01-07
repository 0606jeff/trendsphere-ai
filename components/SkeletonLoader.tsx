import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="h-32 bg-slate-800 rounded-2xl mb-8 border border-slate-700/50"></div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 bg-slate-800 rounded-xl border border-slate-700/50 p-6 flex flex-col">
            <div className="w-12 h-12 bg-slate-700 rounded-lg mb-4"></div>
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700/50 rounded w-2/3 mb-6"></div>
            <div className="mt-auto h-20 bg-slate-700/30 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
