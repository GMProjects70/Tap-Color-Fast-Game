import React, { useEffect, useState } from 'react';
import { AppIcon } from './AppIcon';
import { audioService } from '../services/audioService';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 120);
          return 100;
        }
        return prev + 12;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      onClick={() => {
        audioService.playClick();
        onComplete();
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-[#070a12] select-none cursor-pointer"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated App Icon */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-3xl bg-amber-500/20 blur-xl animate-pulse"></div>
          <AppIcon size={96} className="shadow-2xl" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-game drop-shadow-md">
          TAP COLOR <span className="text-amber-400">FAST</span>
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-sm md:text-base font-semibold text-slate-300 tracking-wide">
          Find It. Tap It. Beat Your Best!
        </p>

        {/* Progress bar */}
        <div className="w-56 h-2 bg-slate-800 rounded-full mt-10 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-3 font-mono-num">
          Tap anywhere to start
        </p>
      </div>

      {/* Brand Footer */}
      <div className="text-center pb-4">
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          GM Projects
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          v1.0.0 · com.tapcolorfast.gmp
        </p>
      </div>
    </div>
  );
};
