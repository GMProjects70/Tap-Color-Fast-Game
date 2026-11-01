import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, Grid, Trophy } from 'lucide-react';
import { audioService } from '../services/audioService';
import { RoundStats } from '../types/game';

interface LevelCompleteModalProps {
  levelNumber: number;
  stats: RoundStats;
  starsEarned: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  stats,
  starsEarned,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  useEffect(() => {
    audioService.playLevelVictory();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#FACC15', '#EC4899'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center flex flex-col">
        {/* Level Tag */}
        <div className="inline-flex items-center justify-center gap-1.5 self-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>LEVEL {levelNumber} COMPLETED!</span>
        </div>

        {/* 3 Stars display */}
        <div className="flex justify-center items-center gap-3 my-4">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= starsEarned;
            return (
              <div
                key={starIdx}
                className={`transition-all duration-500 ${
                  isEarned ? 'scale-110' : 'scale-90 opacity-30'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    isEarned
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      : 'text-slate-600 fill-slate-800'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Round Score */}
        <div className="text-3xl font-black text-white font-mono-num mb-1">
          {stats.score.toLocaleString()}
        </div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-5">
          Points Earned
        </div>

        {/* Stats card */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-left mb-6">
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[11px] text-slate-400 block font-medium">Time Remaining</span>
            <span className="text-sm font-bold text-slate-100 font-mono-num">
              {stats.timeRemaining.toFixed(1)}s
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[11px] text-slate-400 block font-medium">Accuracy</span>
            <span className="text-sm font-bold text-emerald-400 font-mono-num">
              {stats.accuracy}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {hasNextLevel && (
            <button
              onClick={() => {
                audioService.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>Next Level</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          <div className="flex gap-2.5">
            <button
              onClick={() => {
                audioService.playClick();
                onReplay();
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Replay
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                onLevelSelect();
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Grid className="w-4 h-4" />
              All Levels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
