import React, { useState } from 'react';
import { RotateCcw, Home, Share2, Award, CheckCircle2, XCircle, Zap, Check } from 'lucide-react';
import { audioService } from '../services/audioService';
import { RoundStats, GameMode } from '../types/game';

interface GameOverModalProps {
  stats: RoundStats;
  bestScore: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  bestScore,
  mode,
  onPlayAgain,
  onHome,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    audioService.playClick();
    const modeName =
      mode === 'classic'
        ? 'Classic Mode'
        : mode === 'levels'
        ? 'Level Mode'
        : mode === 'endless'
        ? 'Endless Mode'
        : mode === 'timeAttack'
        ? 'Time Attack'
        : mode === 'daily'
        ? 'Daily Challenge'
        : mode === 'colorCombo'
        ? 'Color Combo'
        : mode === 'memoryColor'
        ? 'Memory Color'
        : mode === 'survival'
        ? 'Survival'
        : 'Perfect Run';

    const shareText = `I scored ${stats.score.toLocaleString()} points in Tap Color Fast (${modeName}) with ${stats.accuracy}% accuracy! Can you beat my score? #TapColorFast`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Tap Color Fast - High Score!',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-pop-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center flex flex-col">
        {/* Header Badge */}
        <div className="inline-flex items-center justify-center gap-1.5 self-center px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300 mb-3">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>ROUND OVER</span>
        </div>

        {/* Big Score readout */}
        <div className="text-4xl font-black text-white font-mono-num tracking-tight mb-1">
          {stats.score.toLocaleString()}
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Final Score
        </div>

        {stats.isNewBest && (
          <div className="mb-4 py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
            NEW PERSONAL BEST!
          </div>
        )}

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-left mb-5">
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[11px] text-slate-400 block font-medium">Best Record</span>
            <span className="text-base font-bold text-amber-400 font-mono-num">
              {bestScore.toLocaleString()}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[11px] text-slate-400 block font-medium">Accuracy</span>
            <span className="text-base font-bold text-emerald-400 font-mono-num">
              {stats.accuracy}%
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Correct / Miss</span>
              <span className="text-sm font-bold text-slate-200 font-mono-num">
                {stats.correctTaps} / {stats.wrongTaps}
              </span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0" />
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Max Combo</span>
              <span className="text-sm font-bold text-purple-400 font-mono-num">
                {stats.maxRoundCombo}x
              </span>
            </div>
            <Zap className="w-4 h-4 text-purple-400/80 shrink-0" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              audioService.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            Play Again
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  Share Score
                </>
              )}
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                onHome();
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Home className="w-4 h-4" />
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
