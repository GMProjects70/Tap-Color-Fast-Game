import React from 'react';
import { 
  Play, Volume2, VolumeX, Settings, HelpCircle, 
  Flame, Award, Layers, Infinity as InfinityIcon, Zap, Calendar, 
  Download, Trophy, Target, ShieldCheck, Shuffle, Brain, HeartPulse
} from 'lucide-react';
import { AppIcon } from './AppIcon';
import { audioService } from '../services/audioService';
import { GameMode, PlayerStats, GameSettings } from '../types/game';

interface HomeScreenProps {
  stats: PlayerStats;
  settings: GameSettings;
  activeTab: 'core' | 'special';
  onTabChange: (tab: 'core' | 'special') => void;
  onUpdateSettings: (settings: GameSettings) => void;
  onSelectMode: (mode: GameMode) => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenDaily: () => void;
  onOpenDailyMissions: () => void;
  onOpenAchievements: () => void;
  isInstallable: boolean;
  onInstallApp: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  settings,
  activeTab,
  onTabChange,
  onUpdateSettings,
  onSelectMode,
  onOpenLevelSelect,
  onOpenSettings,
  onOpenTutorial,
  onOpenDaily,
  onOpenDailyMissions,
  onOpenAchievements,
  isInstallable,
  onInstallApp,
}) => {
  const toggleSound = () => {
    const updated = !settings.soundEnabled;
    audioService.setSoundEnabled(updated);
    audioService.playClick();
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  const completedLevelCount = Object.keys(stats.levelProgress.levelStars).length;
  const unlockedAchievementsCount = Object.values(stats.achievements || {}).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 max-w-md mx-auto w-full select-none text-white overflow-y-auto no-scrollbar pb-5">
      {/* Top utility bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Daily Missions */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenDailyMissions();
            }}
            aria-label="Daily Missions"
            className="h-9 px-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-white active:scale-95 transition"
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Missions</span>
          </button>

          {/* Achievements */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenAchievements();
            }}
            aria-label="Achievements"
            className="h-9 px-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-white active:scale-95 transition"
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="font-mono-num font-bold text-[11px]">{unlockedAchievementsCount}/7</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Install PWA Button if available */}
          {isInstallable && (
            <button
              onClick={() => {
                audioService.playClick();
                onInstallApp();
              }}
              className="h-9 px-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          {/* Tutorial / Help */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenTutorial();
            }}
            aria-label="Tutorial"
            className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-cyan-400 hover:text-white active:scale-95 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Brand Header & Hero Identity */}
      <div className="flex flex-col items-center justify-center py-3 text-center">
        <div className="relative mb-2.5 animate-float">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 blur-lg rounded-3xl opacity-75"></div>
          <AppIcon size={76} className="relative z-10" />
        </div>

        <h1 className="text-3xl font-black font-game tracking-tight text-white drop-shadow-md">
          TAP COLOR <span className="text-amber-400">FAST</span>
        </h1>
        <p className="text-xs font-semibold text-slate-300 tracking-wide mt-0.5">
          Find It. Tap It. Beat Your Best!
        </p>

        {/* Stats Pill Strip */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
          <div className="flex items-center gap-1 font-mono-num">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-white font-bold">{stats.streakDays || 1}d</span>
            <span>Streak</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 font-mono-num">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">{stats.highScores.classic.toLocaleString()}</span>
            <span>Best</span>
          </div>
          <span>·</span>
          <div className="font-mono-num">
            <span className="text-emerald-400 font-bold">{stats.totalCorrectTaps}</span>
            <span> Found</span>
          </div>
        </div>
      </div>

      {/* PRIMARY PLAY BUTTON */}
      <div className="py-1.5">
        <button
          onClick={() => {
            audioService.playClick();
            onSelectMode('classic');
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-lg font-game shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all hover:brightness-105"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>PLAY CLASSIC 60s</span>
        </button>
      </div>

      {/* GAME MODES WITH ENLARGED CATEGORY BUTTONS */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Game Modes
          </div>

          {/* TWO PROMINENT ENLARGED BUTTONS */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              onClick={() => {
                audioService.playClick();
                onTabChange('core');
              }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-black tracking-wider transition-all min-w-[90px] text-center ${
                activeTab === 'core'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => {
                audioService.playClick();
                onTabChange('special');
              }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-black tracking-wider transition-all min-w-[90px] text-center ${
                activeTab === 'special'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Special
            </button>
          </div>
        </div>

        {activeTab === 'core' ? (
          <div className="grid grid-cols-2 gap-2.5">
            {/* Mode A: Classic Mode */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('classic');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Classic 60s</div>
              <div className="text-[11px] text-slate-400">Multi-target reaction</div>
              <div className="text-[10px] text-amber-400 font-mono-num font-semibold mt-1">
                Best: {stats.highScores.classic.toLocaleString()}
              </div>
            </button>

            {/* Mode B: Level Mode */}
            <button
              onClick={() => {
                audioService.playClick();
                onOpenLevelSelect();
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1.5 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">200 Levels</div>
              <div className="text-[11px] text-slate-400">Lvl {stats.levelProgress.unlockedLevel} / 200</div>
              <div className="text-[10px] text-emerald-400 font-mono-num font-semibold mt-1">
                {completedLevelCount} Completed
              </div>
            </button>

            {/* Mode C: Endless Mode (with 7s / 9s / 11s timer) */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('endless');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-1.5 group-hover:scale-105 transition-transform">
                <InfinityIcon className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Endless</div>
              <div className="text-[11px] text-slate-400">Timed 7s+ · 3 Lives</div>
              <div className="text-[10px] text-rose-400 font-mono-num font-semibold mt-1">
                Best: {stats.highScores.endless.toLocaleString()}
              </div>
            </button>

            {/* Mode D: Time Attack (+2s on win, -5s on mistake) */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('timeAttack');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-1.5 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Time Attack</div>
              <div className="text-[11px] text-slate-400">+2s Correct · -5s Miss</div>
              <div className="text-[10px] text-purple-400 font-mono-num font-semibold mt-1">
                Best: {stats.highScores.timeAttack.toLocaleString()}
              </div>
            </button>
          </div>
        ) : (
          /* SPECIAL GAMEPLAY MODES */
          <div className="grid grid-cols-2 gap-2.5">
            {/* Mode 1: Color Combo Sequence Mode */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('colorCombo');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1.5 group-hover:scale-105 transition-transform">
                <Shuffle className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Color Combo</div>
              <div className="text-[11px] text-slate-400">Chain sequences</div>
              <div className="text-[10px] text-cyan-400 font-mono-num font-semibold mt-1">
                Best: {stats.highScores.colorCombo.toLocaleString()}
              </div>
            </button>

            {/* Mode 2: Memory Color Mode */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('memoryColor');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-1.5 group-hover:scale-105 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Memory Color</div>
              <div className="text-[11px] text-slate-400">Memorize & tap</div>
              <div className="text-[10px] text-indigo-400 font-mono-num font-semibold mt-1">
                Best: {stats.highScores.memoryColor.toLocaleString()}
              </div>
            </button>

            {/* Mode 3: Survival Mode */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('survival');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-1.5 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Survival</div>
              <div className="text-[11px] text-slate-400">Adaptive ramp</div>
              <div className="text-[10px] text-rose-400 font-mono-num font-semibold mt-1">
                Best: {stats.highScores.survival.toLocaleString()}
              </div>
            </button>

            {/* Mode 4: Perfect Run Mode */}
            <button
              onClick={() => {
                audioService.playClick();
                onSelectMode('perfectRun');
              }}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-game">Perfect Run</div>
              <div className="text-[11px] text-slate-400">1 mistake = Over</div>
              <div className="text-[10px] text-amber-400 font-mono-num font-semibold mt-1">
                Streak: {stats.highScores.perfectRun.toLocaleString()}
              </div>
            </button>
          </div>
        )}

        {/* Daily Challenge Card */}
        <button
          onClick={() => {
            audioService.playClick();
            onOpenDaily();
          }}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900/80 border border-blue-500/30 text-left flex items-center justify-between transition-all active:scale-[0.98] hover:border-blue-500/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-game">Daily Challenge</div>
              <div className="text-[11px] text-slate-400">Unique daily trophy challenge</div>
            </div>
          </div>
          <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
            Play Daily
          </div>
        </button>
      </div>

      {/* Clean Brand signature */}
      <div className="text-center pt-3 text-[11px] text-slate-500">
        GM Projects · <span className="text-slate-400">Tap Color Fast</span> · v1.0.0
      </div>
    </div>
  );
};
