import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
  rounded?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 64, className = '', rounded = true }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center p-1.5 shadow-xl transition-transform active:scale-95 ${
        rounded ? 'rounded-2xl' : 'rounded-none'
      } bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/60 ${className}`}
    >
      {/* 2x2 colorful tiles */}
      <div className="grid grid-cols-2 gap-1 w-full h-full p-1 rounded-xl bg-slate-950/60">
        <div className="rounded-lg bg-red-500 shadow-sm shadow-red-500/40 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
        </div>
        <div className="rounded-lg bg-blue-500 shadow-sm shadow-blue-500/40 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
        </div>
        <div className="rounded-lg bg-emerald-500 shadow-sm shadow-emerald-500/40 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
        </div>
        <div className="rounded-lg bg-amber-400 shadow-sm shadow-amber-400/40 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
        </div>
      </div>

      {/* Center rapid tap emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-6 h-6 rounded-full bg-slate-950/90 border border-amber-400/80 flex items-center justify-center shadow-lg">
          <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
