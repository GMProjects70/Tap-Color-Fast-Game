import React from 'react';
import { ArrowLeft, Calendar, Trophy, CheckCircle2, Play } from 'lucide-react';
import { audioService } from '../services/audioService';
import { generateDailyChallenge } from '../services/levelGenerator';
import { storageService } from '../services/storageService';

interface DailyChallengeModalProps {
  onStartDaily: () => void;
  onBack: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  onStartDaily,
  onBack,
}) => {
  const todayKey = storageService.getTodayKey();
  const stats = storageService.loadStats();
  const todayRecord = stats.dailyHistory[todayKey];
  const challenge = generateDailyChallenge(todayKey);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <button
          onClick={() => {
            audioService.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-700/60 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold font-game tracking-tight">Daily Challenge</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-sm mx-auto w-full flex flex-col justify-between">
        <div className="space-y-4 pt-2">
          {/* Calendar Badge */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 py-1.5 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit mx-auto">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>

          {/* Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl">
            <div className="flex justify-center items-center gap-2 mb-4">
              {challenge.targetColors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="font-black text-sm font-game" style={{ color: color.textColor }}>
                    {color.shortName}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-black text-white font-game mb-1">
              {challenge.targetColors.length > 1
                ? `Targets: ${challenge.targetColors.map((c) => c.shortName).join(' + ')}`
                : `Target: ${challenge.targetColors[0].name}`}
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Find {challenge.targetCount} matching sets before the 45s timer runs out! Dynamic rapid shuffles active.
            </p>

            {todayRecord?.completed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <div className="flex items-center justify-center gap-2 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  Completed for Today!
                </div>
                <div className="text-xs text-emerald-200/80">
                  Daily Score: <span className="font-mono-num font-bold text-emerald-100">{todayRecord.score.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Daily Status:</span>
                <span className="font-bold text-amber-400">Available Now</span>
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="pb-6">
          <button
            onClick={() => {
              audioService.playClick();
              onStartDaily();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Play className="w-5 h-5 fill-current" />
            {todayRecord?.completed ? 'Play Again (Practice)' : 'Start Daily Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};
