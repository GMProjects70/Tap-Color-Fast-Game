import React, { useState } from 'react';
import { audioService } from '../services/audioService';
import { BASE_COLORS } from '../constants/colors';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [practiceSuccess, setPracticeSuccess] = useState(false);

  const steps = [
    {
      title: '1. Watch The Target',
      description: 'Look at the TARGET COLOR box displayed at the top of your screen.',
      targetColor: BASE_COLORS[2], // Emerald Green
      instruction: 'Target: GREEN',
      practice: false,
    },
    {
      title: '2. Spot The Matching Box',
      description: 'Quickly scan the grid below to find the box that matches the target color.',
      targetColor: BASE_COLORS[0], // Red
      instruction: 'Tap the RED box below to try!',
      practice: true,
      correctId: 'red',
      boxes: [BASE_COLORS[1], BASE_COLORS[0], BASE_COLORS[3], BASE_COLORS[4]],
    },
    {
      title: '3. Speed & Combos',
      description: 'Tap consecutive correct boxes without making mistakes to build huge combos (+5, +10, +25 bonus points!).',
      targetColor: BASE_COLORS[3], // Yellow
      instruction: 'Accuracy + Speed = High Score!',
      practice: false,
    },
    {
      title: '4. Special Mechanics',
      description: 'As you level up, watch for word tricks, fast shuffles, and memory targets! Stay sharp!',
      targetColor: BASE_COLORS[4], // Purple
      instruction: 'Ready to play like a Color Master?',
      practice: false,
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    audioService.playClick();
    if (step < steps.length - 1) {
      setStep(step + 1);
      setPracticeSuccess(false);
    } else {
      onClose();
    }
  };

  const handlePracticeTap = (colorId: string) => {
    if (colorId === current.correctId) {
      audioService.playCorrect(3);
      setPracticeSuccess(true);
    } else {
      audioService.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col text-center">
        {/* Step indicator */}
        <div className="flex justify-center items-center gap-1.5 mb-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step Title */}
        <h3 className="text-xl font-bold text-white font-game mb-2">
          {current.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {current.description}
        </p>

        {/* Visual Target Card */}
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 mb-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Preview
          </div>
          <div
            className="w-full h-16 rounded-xl flex items-center justify-center shadow-md transition-transform"
            style={{ backgroundColor: current.targetColor.hex }}
          >
            <span
              className="text-lg font-black font-game tracking-wider drop-shadow-sm"
              style={{ color: current.targetColor.textColor }}
            >
              {current.targetColor.shortName}
            </span>
          </div>

          {current.practice && (
            <div className="mt-4">
              <div className="text-xs text-amber-300 font-medium mb-2">
                {practiceSuccess ? 'Awesome! Practice Completed!' : current.instruction}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {current.boxes?.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handlePracticeTap(b.id)}
                    className="h-14 rounded-xl flex items-center justify-center font-bold text-sm shadow active:scale-95 transition-transform"
                    style={{ backgroundColor: b.hex, color: b.textColor }}
                  >
                    {b.shortName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
          >
            {step === steps.length - 1 ? "Let's Play!" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
