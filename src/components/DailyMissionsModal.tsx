import React from 'react';
import { ArrowLeft, CheckCircle2, Trophy, Award, Gift } from 'lucide-react';
import { audioService } from '../services/audioService';
import { DailyMission } from '../types/game';

interface DailyMissionsModalProps {
  missions: DailyMission[];
  onBack: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  missions,
  onBack,
}) => {
  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-white select-none animate-pop-in">
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
        <div className="text-center">
          <h2 className="text-lg font-bold font-game tracking-tight">Daily Missions</h2>
          <p className="text-xs text-slate-400">Resets every 24 hours</p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono-num">
          <Trophy className="w-3.5 h-3.5" />
          <span>{completedCount}/{missions.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-3">
        {missions.map((mission) => {
          const progressPercent = Math.min(100, Math.round((mission.current / mission.target) * 100));

          return (
            <div
              key={mission.id}
              className={`p-4 rounded-2xl border transition-all ${
                mission.completed
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-sm font-bold text-white font-game flex items-center gap-1.5">
                    {mission.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span>{mission.title}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {mission.description}
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-amber-400 font-mono-num text-xs font-bold shrink-0 flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  <span>+{mission.rewardPoints}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative mt-3">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    mission.completed
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono-num mt-1.5">
                <span>Progress</span>
                <span className={mission.completed ? 'text-emerald-400 font-bold' : ''}>
                  {mission.current} / {mission.target} ({progressPercent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
