// components/SkeletonLoader.tsx
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] overflow-auto flex-col relative animate-pulse">
      <div className="resourceImage h-20 w-full rounded-lg bg-slate-300 mb-4"></div>
      <div className="bg-slate-300 h-6 w-1/2 mb-2 rounded"></div>
      <div className="bg-slate-300 h-4 w-3/4 mb-2 rounded"></div>
      <div className="bg-slate-300 h-4 w-full mb-2 rounded"></div>
      <div className="bg-slate-300 h-4 w-1/2 mb-8 rounded"></div>
      <div className="flex gap-1 mt-8 absolute bottom-4 w-full">
        <div className="bg-slate-300 h-10 w-1/3 rounded-lg"></div>
        <div className="bg-slate-300 h-10 w-1/3 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
