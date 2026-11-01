import React from 'react';
import { Volume2, VolumeX, RotateCcw, Play, Home } from 'lucide-react';
import { audioService } from '../services/audioService';
import { GameSettings } from '../types/game';

interface PauseModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  onUpdateSettings,
  onResume,
  onRestart,
  onHome,
}) => {
  const toggleSound = () => {
    const updated = !settings.soundEnabled;
    audioService.setSoundEnabled(updated);
    audioService.playClick();
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center">
        <h2 className="text-2xl font-black text-white font-game tracking-wider mb-1">
          GAME PAUSED
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Take a breath, then jump right back in!
        </p>

        <div className="space-y-3">
          {/* Resume */}
          <button
            onClick={() => {
              audioService.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Play className="w-5 h-5 fill-current" />
            Resume Game
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              audioService.playClick();
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Round
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {settings.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                Sound: ON
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                Sound: OFF
              </>
            )}
          </button>

          {/* Home */}
          <button
            onClick={() => {
              audioService.playClick();
              onHome();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4" />
            Quit to Home
          </button>
        </div>
      </div>
    </div>
  );
};
