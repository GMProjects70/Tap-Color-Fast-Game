import React, { useState } from 'react';
import { Star, Lock, ArrowLeft, Trophy } from 'lucide-react';
import { audioService } from '../services/audioService';

interface LevelSelectModalProps {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onBack,
}) => {
  const TOTAL_LEVELS = 200;
  const CHAPTER_SIZE = 25;
  const TOTAL_CHAPTERS = Math.ceil(TOTAL_LEVELS / CHAPTER_SIZE);

  // Default to chapter of current unlocked level
  const defaultChapter = Math.min(
    TOTAL_CHAPTERS - 1,
    Math.floor((unlockedLevel - 1) / CHAPTER_SIZE)
  );
  const [selectedChapter, setSelectedChapter] = useState(defaultChapter);

  // Total stars collected
  const totalStars = Object.values(levelStars).reduce((sum, s) => sum + s, 0);
  const maxPossibleStars = TOTAL_LEVELS * 3;

  const startLevel = selectedChapter * CHAPTER_SIZE + 1;
  const endLevel = Math.min(TOTAL_LEVELS, (selectedChapter + 1) * CHAPTER_SIZE);
  const levelsInChapter = Array.from(
    { length: endLevel - startLevel + 1 },
    (_, i) => startLevel + i
  );

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

        <div className="text-center">
          <h2 className="text-lg font-bold font-game tracking-tight">Select Level</h2>
          <p className="text-xs text-slate-400">200 Challenges</p>
        </div>

        {/* Stars counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono-num">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{totalStars} / {maxPossibleStars}</span>
        </div>
      </div>

      {/* Chapter Tabs Horizontal Scroller */}
      <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-slate-800/60 bg-slate-950/80">
        {Array.from({ length: TOTAL_CHAPTERS }, (_, idx) => {
          const chapStart = idx * CHAPTER_SIZE + 1;
          const chapEnd = (idx + 1) * CHAPTER_SIZE;
          const isSelected = selectedChapter === idx;
          const isUnlocked = unlockedLevel >= chapStart;

          return (
            <button
              key={idx}
              onClick={() => {
                audioService.playClick();
                setSelectedChapter(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isUnlocked
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-500 opacity-60'
              }`}
            >
              Lvl {chapStart}–{chapEnd}
            </button>
          );
        })}
      </div>

      {/* Levels Grid Container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-5 gap-3 pb-6">
          {levelsInChapter.map((lvl) => {
            const isUnlocked = lvl <= unlockedLevel;
            const isCurrent = lvl === unlockedLevel;
            const stars = levelStars[lvl] || 0;

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    audioService.playClick();
                    onSelectLevel(lvl);
                  } else {
                    audioService.playWrong();
                  }
                }}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-105 border-2 border-white'
                    : isUnlocked
                    ? 'bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold border border-slate-700 active:scale-95'
                    : 'bg-slate-900/60 text-slate-600 border border-slate-800/80 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-base font-bold font-mono-num">{lvl}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s <= stars
                              ? isCurrent
                                ? 'fill-slate-950 text-slate-950'
                                : 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Lock className="w-5 h-5 text-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
