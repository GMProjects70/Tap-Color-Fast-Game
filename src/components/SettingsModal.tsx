import React, { useState } from 'react';
import { 
  ArrowLeft, Volume2, Music, Smartphone, HelpCircle, 
  Trash2, Shield, Eye, AlertTriangle 
} from 'lucide-react';
import { audioService } from '../services/audioService';
import { GameSettings } from '../types/game';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onOpenTutorial: () => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onOpenTutorial,
  onResetData,
  onBack,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    audioService.setSoundEnabled(next);
    audioService.playClick();
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const toggleMusic = () => {
    const next = !settings.musicEnabled;
    audioService.setMusicEnabled(next);
    audioService.playClick();
    onUpdateSettings({ ...settings, musicEnabled: next });
  };

  const toggleVibration = () => {
    const next = !settings.vibrationEnabled;
    audioService.setVibrationEnabled(next);
    audioService.playClick();
    onUpdateSettings({ ...settings, vibrationEnabled: next });
  };

  const toggleColorBlind = () => {
    audioService.playClick();
    onUpdateSettings({ ...settings, colorBlindLabels: !settings.colorBlindLabels });
  };

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
        <h2 className="text-lg font-bold font-game tracking-tight">Settings</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-6">
        {/* COLOR ASSIST ENGINE */}
        <div>
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5 px-1">
            Gameplay Assistance
          </h3>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Color Assist Mode</div>
                  <div className="text-xs text-slate-400">Shows shape symbols & names inside boxes</div>
                </div>
              </div>
              <button
                onClick={() => {
                  audioService.playClick();
                  onUpdateSettings({ ...settings, colorAssist: !settings.colorAssist });
                }}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  settings.colorAssist ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.colorAssist ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* AUDIO & HAPTICS */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
            Audio & Vibration
          </h3>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80">
            {/* Sound Effects */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Sound Effects</div>
                  <div className="text-xs text-slate-400">Pops, chimes, and buzzer</div>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Background Music */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Background Music</div>
                  <div className="text-xs text-slate-400">Procedural ambient synth</div>
                </div>
              </div>
              <button
                onClick={toggleMusic}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Haptic Vibration</div>
                  <div className="text-xs text-slate-400">Tactile tap feedback</div>
                </div>
              </div>
              <button
                onClick={toggleVibration}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  settings.vibrationEnabled ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ACCESSIBILITY */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
            Accessibility
          </h3>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Color Blind Labels</div>
                  <div className="text-xs text-slate-400">Show color text inside all boxes</div>
                </div>
              </div>
              <button
                onClick={toggleColorBlind}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  settings.colorBlindLabels ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.colorBlindLabels ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* GAME HELP & SUPPORT */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
            Help & Info
          </h3>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80">
            <button
              onClick={() => {
                audioService.playClick();
                onOpenTutorial();
              }}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">How to Play</div>
                  <div className="text-xs text-slate-400">Review game rules & mechanics</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                setShowPrivacyModal(true);
              }}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Privacy Policy</div>
                  <div className="text-xs text-slate-400">100% offline, zero data collection</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* DANGER ZONE / DATA RESET */}
        <div>
          <h3 className="text-xs font-semibold text-rose-400/90 uppercase tracking-wider mb-2.5 px-1">
            Data Management
          </h3>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <button
              onClick={() => {
                audioService.playClick();
                setShowResetConfirm(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Trash2 className="w-4 h-4" />
              Reset Game Data
            </button>
          </div>
        </div>

        {/* ABOUT & METADATA */}
        <div className="text-center py-2 text-slate-500 text-xs">
          <p className="font-semibold text-slate-400">Tap Color Fast</p>
          <p>Package ID: com.tapcolorfast.gmp</p>
          <p>Developer: GM Projects</p>
          <p>Version 1.0.0 (Release Build)</p>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Reset All Progress?</h3>
            <p className="text-xs text-slate-400 mb-6">
              This will erase all high scores, completed levels, and stars. This action cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  audioService.playClick();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  audioService.playWrong();
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 active:scale-95"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Privacy Policy</h3>
            <div className="text-xs text-slate-300 space-y-3 overflow-y-auto pr-1 flex-1">
              <p>
                <strong>Tap Color Fast</strong> by GM Projects respects your privacy completely.
              </p>
              <p>
                - <strong>No Personal Data:</strong> We do not collect, store, transmit, or share any personal information.
              </p>
              <p>
                - <strong>Offline Storage:</strong> Your game scores and level progress are stored exclusively on your local device.
              </p>
              <p>
                - <strong>No Ads or Trackers:</strong> This initial release contains zero advertisements, zero analytical telemetry trackers, and zero third-party profiling.
              </p>
              <p>
                Contact: gmprojects70@gmail.com
              </p>
            </div>
            <button
              onClick={() => {
                audioService.playClick();
                setShowPrivacyModal(false);
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
