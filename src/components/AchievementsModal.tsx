import React from 'react';
import { ArrowLeft, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { audioService } from '../services/audioService';
import { ACHIEVEMENTS_LIST } from '../services/storageService';
import { PlayerStats } from '../types/game';

interface AchievementsModalProps {
  stats: PlayerStats;
  onBack: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ stats, onBack }) => {
  const getProgress = (id: string, target: number): { current: number; isUnlocked: boolean } => {
    let current = 0;
    if (id === 'first_win') current = stats.totalGamesPlayed;
    else if (id === 'color_hunter') current = stats.totalCorrectTaps;
    else if (id === 'double_master') current = stats.doubleChallengesCompleted;
    else if (id === 'triple_master') current = stats.tripleChallengesCompleted;
    else if (id === 'combo_king') current = stats.maxCombo;
    else if (id === 'perfect_player') current = stats.perfectRunsCompleted;
    else if (id === 'speed_demon') current = stats.highScores.timeAttack > 0 ? 1 : 0;

    const isUnlocked = !!stats.achievements[id] || current >= target;
    return { current: Math.min(target, current), isUnlocked };
  };

  const unlockedCount = ACHIEVEMENTS_LIST.filter(
    (ach) => getProgress(ach.id, ach.target).isUnlocked
  ).length;

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
          <h2 className="text-lg font-bold font-game tracking-tight">Achievements</h2>
          <p className="text-xs text-slate-400">Master every color skill</p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono-num">
          <Trophy className="w-3.5 h-3.5" />
          <span>{unlockedCount}/{ACHIEVEMENTS_LIST.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-3">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const { current, isUnlocked } = getProgress(ach.id, ach.target);
          const percent = Math.min(100, Math.round((current / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-r from-amber-950/30 to-slate-900/80 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white font-game flex items-center gap-1.5">
                      <span>{ach.title}</span>
                      {isUnlocked && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded uppercase">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {ach.description}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono-num font-bold text-slate-300">
                  {current}/{ach.target}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden relative mt-2">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isUnlocked ? 'bg-amber-400' : 'bg-slate-600'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
