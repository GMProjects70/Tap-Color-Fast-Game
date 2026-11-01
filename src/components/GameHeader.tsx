import React from 'react';
import { Pause, Heart, Zap, Check, ShieldCheck, Flame } from 'lucide-react';
import { audioService } from '../services/audioService';
import { GameMode, SpecialMechanic, TargetItem } from '../types/game';
import { ColorSymbol } from './ColorSymbol';

interface GameHeaderProps {
  mode: GameMode;
  levelNumber?: number;
  score: number;
  combo: number;
  comboPraise: string | null;
  timeRemaining: number;
  maxTime: number;
  lives?: number; // for endless & survival
  targets: TargetItem[]; // 1, 2, or 3 targets
  targetCountRemaining?: number;
  mechanic: SpecialMechanic;
  stroopWord?: string;
  stroopColorHex?: string;
  isMemoryHidden?: boolean;
  colorAssist: boolean;
  colorBlindLabels: boolean;
  perfectStreak?: number;
  sequenceStep?: number;
  onPause: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  mode,
  levelNumber,
  score,
  combo,
  comboPraise,
  timeRemaining,
  maxTime,
  lives,
  targets,
  targetCountRemaining,
  mechanic,
  stroopWord,
  stroopColorHex,
  isMemoryHidden,
  colorAssist,
  colorBlindLabels,
  perfectStreak = 0,
  sequenceStep = 0,
  onPause,
}) => {
  const timePercent = Math.max(0, Math.min(100, (timeRemaining / maxTime) * 100));

  const modeTitle =
    mode === 'classic'
      ? 'CLASSIC 60s'
      : mode === 'levels'
      ? `LEVEL ${levelNumber}`
      : mode === 'endless'
      ? 'ENDLESS'
      : mode === 'timeAttack'
      ? 'TIME ATTACK'
      : mode === 'daily'
      ? 'DAILY CHALLENGE'
      : mode === 'colorCombo'
      ? 'COLOR COMBO'
      : mode === 'memoryColor'
      ? 'MEMORY COLOR'
      : mode === 'survival'
      ? 'SURVIVAL'
      : 'PERFECT RUN';

  const uncompletedCount = targets.filter((t) => !t.isCompleted).length;

  return (
    <div className="w-full flex flex-col gap-2 pt-1 select-none">
      {/* TOP STATUS BAR */}
      <div className="flex items-center justify-between px-1">
        {/* Left: Pause & Mode Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioService.playClick();
              onPause();
            }}
            aria-label="Pause"
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition shadow-sm"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>

          <div>
            <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              {modeTitle}
            </div>

            {targetCountRemaining !== undefined ? (
              <div className="text-xs font-semibold text-slate-300">
                Remaining: <span className="text-white font-mono-num font-bold">{targetCountRemaining}</span>
              </div>
            ) : mode === 'perfectRun' ? (
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono-num">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Streak: {perfectStreak}</span>
              </div>
            ) : mode === 'colorCombo' ? (
              <div className="text-xs font-semibold text-purple-400 font-mono-num">
                Step: {sequenceStep + 1} / {targets.length}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: Lives / Streak & Score */}
        <div className="flex items-center gap-3">
          {(mode === 'endless' || mode === 'survival') && lives !== undefined && (
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-5 h-5 transition-transform ${
                    heartIndex <= lives
                      ? 'fill-rose-500 text-rose-500 scale-100'
                      : 'fill-slate-800 text-slate-700 scale-90'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              SCORE
            </div>
            <div className="text-xl font-black text-white font-mono-num leading-tight">
              {score.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* TIMER BAR (Timed modes including Endless with 7s/9s/11s per-round timer) */}
      {mode !== 'survival' && mode !== 'perfectRun' && (
        <div className="w-full px-1">
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-100 rounded-full ${
                timePercent > 40
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                  : timePercent > 20
                  ? 'bg-amber-500'
                  : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono-num mt-1">
            <span>TIMER</span>
            <span className={timeRemaining <= 5 ? 'text-rose-400 font-bold animate-pulse' : ''}>
              {timeRemaining.toFixed(1)}s
            </span>
          </div>
        </div>
      )}

      {/* TARGET CARD DISPLAY */}
      <div className="w-full px-1 my-1">
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-3 shadow-lg flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Combo Praise Animated Pill */}
          {comboPraise && (
            <div className="absolute top-1 right-2 animate-bounce px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider shadow-md z-20">
              {comboPraise}
            </div>
          )}

          {/* Header indicator */}
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-1">
              {combo > 1 && (
                <span className="flex items-center gap-0.5 text-amber-400 font-mono-num">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  {combo}x COMBO
                </span>
              )}
            </div>
            <div>
              {targets.length > 1 ? (
                <span className="text-amber-300 font-mono-num font-bold">
                  TARGETS: {uncompletedCount}
                </span>
              ) : (
                <span>TARGET COLOR</span>
              )}
            </div>
          </div>

          {/* MEMORY MODE HIDDEN VIEW */}
          {isMemoryHidden ? (
            <div className="w-full py-3.5 rounded-xl bg-slate-800/80 border border-dashed border-slate-600 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-300 font-game animate-pulse">
                ? TAP THE SEQUENCE FROM MEMORY !
              </span>
            </div>
          ) : mechanic === 'colorWord' && stroopWord && stroopColorHex ? (
            /* STROOP WORD */
            <div
              className="w-full py-3 px-4 rounded-xl flex items-center justify-center shadow-md border border-white/20 bg-slate-950"
            >
              <span
                className="font-black text-lg font-game tracking-wider"
                style={{ color: stroopColorHex }}
              >
                {stroopWord}
              </span>
            </div>
          ) : (
            /* MULTI-TARGET ROW (SINGLE, DOUBLE, TRIPLE) */
            <div className={`w-full grid gap-2 ${
              targets.length === 1 ? 'grid-cols-1' : targets.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {targets.map((target, idx) => {
                if (target.isCompleted) {
                  return (
                    <div
                      key={target.id || idx}
                      className="py-2.5 px-2 rounded-xl bg-slate-950/80 border border-emerald-500/50 flex items-center justify-center gap-1.5 text-emerald-400 transition-all animate-pop-in"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span className="text-xs font-bold font-game uppercase tracking-wider">
                        DONE
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={target.id || idx}
                    style={{ backgroundColor: target.color.hex }}
                    className="py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-white/25 transition-transform"
                  >
                    {/* Unique Color Symbol */}
                    <ColorSymbol
                      symbol={target.color.symbol}
                      color={target.color.textColor}
                      size={18}
                    />

                    {/* Color Name */}
                    <span
                      className="font-black text-xs md:text-sm font-game tracking-wider drop-shadow-sm truncate"
                      style={{ color: target.color.textColor }}
                    >
                      {target.color.shortName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Color Assist text hint */}
          {colorAssist && !isMemoryHidden && (
            <div className="text-[10px] text-slate-400 mt-1.5 font-medium flex items-center justify-center gap-1">
              <span>Symbols active:</span>
              <span className="text-slate-300 font-semibold">
                {targets.filter(t => !t.isCompleted).map(t => `${t.color.shortName} (${t.color.symbol})`).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
