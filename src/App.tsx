import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameMode, GameScreen, GameColor, RoundStats, ComboPraise, 
  TargetItem, SpecialMechanic, DailyMission 
} from './types/game';
import { BASE_COLORS, getSmartDistinctColors, getRandomColor } from './constants/colors';
import { audioService } from './services/audioService';
import { storageService, ACHIEVEMENTS_LIST } from './services/storageService';
import { getLevelConfig, generateDailyChallenge } from './services/levelGenerator';

import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { GameHeader } from './components/GameHeader';
import { ColorGrid, GridTile } from './components/ColorGrid';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { AchievementsModal } from './components/AchievementsModal';

export default function App() {
  // Persistent State
  const [settings, setSettings] = useState(() => storageService.loadSettings());
  const [stats, setStats] = useState(() => storageService.loadStats());

  // Screen & Tab State
  const [screen, setScreen] = useState<GameScreen>('home');
  const [homeTab, setHomeTab] = useState<'core' | 'special'>('core');
  const [currentMode, setCurrentMode] = useState<GameMode>('classic');
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);

  // Gameplay State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [comboPraise, setComboPraise] = useState<ComboPraise | null>(null);
  const [correctTaps, setCorrectTaps] = useState<number>(0);
  const [wrongTaps, setWrongTaps] = useState<number>(0);
  const [lives, setLives] = useState<number>(3); // for endless & survival
  const [perfectStreak, setPerfectStreak] = useState<number>(0);
  const [sequenceStep, setSequenceStep] = useState<number>(0);

  // Adaptive Difficulty State
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [recentMistakes, setRecentMistakes] = useState<number>(0);

  // Challenge Counters
  const [roundDoubleCount, setRoundDoubleCount] = useState<number>(0);
  const [roundTripleCount, setRoundTripleCount] = useState<number>(0);

  // Target & Grid State
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [targetCountRemaining, setTargetCountRemaining] = useState<number>(5); // for levels
  const [gridSize, setGridSize] = useState<2 | 3 | 4 | 5>(3);
  const [gridTiles, setGridTiles] = useState<GridTile[]>([]);

  // Special mechanics
  const [mechanic, setMechanic] = useState<SpecialMechanic>('normal');
  const [stroopWord, setStroopWord] = useState<string | undefined>(undefined);
  const [stroopColorHex, setStroopColorHex] = useState<string | undefined>(undefined);
  const [isMemoryHidden, setIsMemoryHidden] = useState<boolean>(false);

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [maxTime, setMaxTime] = useState<number>(60);

  // PWA Install state
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Refs for loop management
  const timerRef = useRef<number | null>(null);
  const memoryTimerRef = useRef<number | null>(null);
  const isInputLockedRef = useRef<boolean>(false);

  // Audio & PWA setup
  useEffect(() => {
    audioService.setSoundEnabled(settings.soundEnabled);
    audioService.setMusicEnabled(settings.musicEnabled);
    audioService.setVibrationEnabled(settings.vibrationEnabled);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Daily Streak Check
  useEffect(() => {
    const today = storageService.getTodayKey();
    if (stats.lastPlayedDate !== today) {
      const updated = { ...stats, lastPlayedDate: today };
      if (!stats.lastPlayedDate) {
        updated.streakDays = 1;
      } else {
        const last = new Date(stats.lastPlayedDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          updated.streakDays = (stats.streakDays || 1) + 1;
        } else if (diffDays > 1) {
          updated.streakDays = 1;
        }
      }
      storageService.saveStats(updated);
      setStats(updated);
    }
  }, []);

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  const handleUpdateSettings = (newSettings: any) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleResetData = () => {
    const fresh = storageService.resetAllData();
    setStats(fresh);
  };

  /**
   * Evaluates and updates achievements and daily missions
   */
  const evaluateProgress = useCallback((
    currentStats: typeof stats,
    newTaps: number,
    newDoubleCount: number,
    newTripleCount: number,
    curCombo: number,
    isPerfectRound = false
  ) => {
    const today = storageService.getTodayKey();
    const updatedStats = { ...currentStats };
    const currentMissions = storageService.getDailyMissions(today, updatedStats);

    const updatedMissions: DailyMission[] = currentMissions.map((m) => {
      let currentVal = m.current;
      if (m.id === 'mission_single') currentVal = updatedStats.singleChallengesCompleted;
      else if (m.id === 'mission_double') currentVal = updatedStats.doubleChallengesCompleted;
      else if (m.id === 'mission_triple') currentVal = updatedStats.tripleChallengesCompleted;
      else if (m.id === 'mission_combo') currentVal = Math.max(m.current, curCombo);
      else if (m.id === 'mission_perfect' && isPerfectRound) currentVal = Math.max(m.current, 15);

      const completed = currentVal >= m.target;
      return { ...m, current: currentVal, completed };
    });

    updatedStats.dailyMissions[today] = updatedMissions;

    ACHIEVEMENTS_LIST.forEach((ach) => {
      if (!updatedStats.achievements[ach.id]) {
        let satisfied = false;
        if (ach.id === 'first_win' && updatedStats.totalGamesPlayed >= 1) satisfied = true;
        else if (ach.id === 'color_hunter' && updatedStats.totalCorrectTaps >= 100) satisfied = true;
        else if (ach.id === 'double_master' && updatedStats.doubleChallengesCompleted >= 50) satisfied = true;
        else if (ach.id === 'triple_master' && updatedStats.tripleChallengesCompleted >= 25) satisfied = true;
        else if (ach.id === 'combo_king' && updatedStats.maxCombo >= 10) satisfied = true;
        else if (ach.id === 'perfect_player' && updatedStats.perfectRunsCompleted >= 1) satisfied = true;
        else if (ach.id === 'speed_demon' && updatedStats.highScores.timeAttack > 0) satisfied = true;

        if (satisfied) {
          updatedStats.achievements[ach.id] = true;
          audioService.playAchievementUnlocked();
        }
      }
    });

    storageService.saveStats(updatedStats);
    setStats(updatedStats);
  }, []);

  /**
   * Helper to construct guaranteed-solvable grid
   */
  const generateGrid = useCallback((
    targetColors: GameColor[],
    size: 2 | 3 | 4 | 5,
    currentMechanic: SpecialMechanic
  ): GridTile[] => {
    const totalBoxes = size * size;
    const tiles: GridTile[] = [];

    const targetSlots: { index: number; color: GameColor }[] = [];
    const usedIndices = new Set<number>();

    targetColors.forEach((color) => {
      let randIdx: number;
      do {
        randIdx = Math.floor(Math.random() * totalBoxes);
      } while (usedIndices.has(randIdx));
      usedIndices.add(randIdx);
      targetSlots.push({ index: randIdx, color });
    });

    if (size >= 3 && targetColors.length === 1) {
      const extraCount = size === 3 ? 1 : 2;
      for (let k = 0; k < extraCount; k++) {
        let randIdx: number;
        do {
          randIdx = Math.floor(Math.random() * totalBoxes);
        } while (usedIndices.has(randIdx));
        usedIndices.add(randIdx);
        targetSlots.push({ index: randIdx, color: targetColors[0] });
      }
    }

    const targetIds = targetColors.map((t) => t.id);
    const nonTargetPool = BASE_COLORS.filter((c) => !targetIds.includes(c.id));

    for (let i = 0; i < totalBoxes; i++) {
      const targetMatch = targetSlots.find((ts) => ts.index === i);
      let color: GameColor;

      if (targetMatch) {
        color = targetMatch.color;
      } else {
        color = nonTargetPool[Math.floor(Math.random() * nonTargetPool.length)] || BASE_COLORS[0];
      }

      const isLocked = currentMechanic === 'locked' && !targetMatch && Math.random() < 0.18;
      const isDisappeared = currentMechanic === 'disappearing' && !targetMatch && Math.random() < 0.18;

      tiles.push({
        id: `tile-${i}-${Date.now()}-${Math.random()}`,
        color,
        isLocked,
        isDisappeared,
        isFound: false,
      });
    }

    return tiles;
  }, []);

  /**
   * Challenge Generator (Single, Double, Triple) with Adaptive Progression & Endless Timer
   */
  const createNextChallenge = useCallback((
    mode: GameMode,
    levelNum: number,
    streak: number,
    mistakes: number,
    curGridSize: 2 | 3 | 4 | 5
  ) => {
    let targetCount = 1;

    if (mode === 'levels') {
      const config = getLevelConfig(levelNum);
      targetCount = config.targetColors.length;
    } else if (mode === 'daily') {
      const dailyConfig = generateDailyChallenge(storageService.getTodayKey());
      targetCount = dailyConfig.targetColors.length;
    } else if (mode === 'survival' || mode === 'classic' || mode === 'endless') {
      if (mistakes >= 2) {
        targetCount = 1;
      } else if (streak >= 7 && curGridSize >= 3) {
        const roll = Math.random();
        if (roll < 0.4) targetCount = 3;
        else if (roll < 0.8) targetCount = 2;
        else targetCount = 1;
      } else if (streak >= 3) {
        targetCount = Math.random() < 0.5 ? 2 : 1;
      } else {
        targetCount = 1;
      }
    } else if (mode === 'colorCombo') {
      targetCount = 3;
    } else if (mode === 'memoryColor') {
      targetCount = Math.min(4, 2 + Math.floor(streak / 4));
    }

    const colors = getSmartDistinctColors(targetCount + 2).slice(0, targetCount);
    const newTargets: TargetItem[] = colors.map((color, idx) => ({
      id: `target-${idx}-${Date.now()}`,
      color,
      isCompleted: false,
    }));

    setTargets(newTargets);
    setSequenceStep(0);

    // Endless Mode Timer Requirement:
    // 1 target: 7 seconds
    // 2 targets: 9 seconds
    // 3 or more targets: 7 + (targetCount - 1) * 2 seconds (e.g. 3 -> 11s)
    if (mode === 'endless') {
      const endlessTimer = 7 + (newTargets.length - 1) * 2;
      setTimeRemaining(endlessTimer);
      setMaxTime(endlessTimer);
    }

    const newTiles = generateGrid(colors, curGridSize, mechanic);
    setGridTiles(newTiles);

    if (mode === 'memoryColor') {
      setIsMemoryHidden(false);
      if (memoryTimerRef.current) clearTimeout(memoryTimerRef.current);
      memoryTimerRef.current = window.setTimeout(() => {
        setIsMemoryHidden(true);
      }, 1600);
    }
  }, [generateGrid, mechanic]);

  /**
   * Start Round
   */
  const startRound = (mode: GameMode, levelNum = 1) => {
    setCurrentMode(mode);

    // Preserve home tab so when user exits, they stay on the same tab!
    if (mode === 'colorCombo' || mode === 'memoryColor' || mode === 'survival' || mode === 'perfectRun') {
      setHomeTab('special');
    } else if (mode === 'classic' || mode === 'levels' || mode === 'endless' || mode === 'timeAttack') {
      setHomeTab('core');
    }

    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setComboPraise(null);
    setCorrectTaps(0);
    setWrongTaps(0);
    setLives(3);
    setPerfectStreak(0);
    setConsecutiveCorrect(0);
    setRecentMistakes(0);
    setRoundDoubleCount(0);
    setRoundTripleCount(0);
    setIsMemoryHidden(false);
    isInputLockedRef.current = false;

    if (timerRef.current) clearInterval(timerRef.current);
    if (memoryTimerRef.current) clearTimeout(memoryTimerRef.current);

    let initialGridSize: 2 | 3 | 4 | 5 = 3;
    let initialTime = 60;

    if (mode === 'classic') {
      initialGridSize = 3;
      initialTime = 60;
      setMechanic('normal');
    } else if (mode === 'levels') {
      setCurrentLevelNumber(levelNum);
      const config = getLevelConfig(levelNum);
      initialGridSize = config.gridSize;
      initialTime = config.timeLimit;
      setTargetCountRemaining(config.targetCount);
      setMechanic(config.mechanic);
    } else if (mode === 'endless') {
      initialGridSize = 2;
      initialTime = 7; // Starts with 7s for first target
      setMechanic('normal');
    } else if (mode === 'timeAttack') {
      initialGridSize = 3;
      initialTime = 30; // 30s base
      setMechanic('fastShuffle');
    } else if (mode === 'daily') {
      const dailyConfig = generateDailyChallenge(storageService.getTodayKey());
      initialGridSize = dailyConfig.gridSize;
      initialTime = dailyConfig.timeLimit;
      setTargetCountRemaining(dailyConfig.targetCount);
      setMechanic(dailyConfig.mechanic);
    } else if (mode === 'colorCombo') {
      initialGridSize = 3;
      initialTime = 45;
      setMechanic('normal');
    } else if (mode === 'memoryColor') {
      initialGridSize = 3;
      initialTime = 40;
      setMechanic('memory');
    } else if (mode === 'survival') {
      initialGridSize = 3;
      initialTime = 999;
      setMechanic('normal');
    } else if (mode === 'perfectRun') {
      initialGridSize = 3;
      initialTime = 999;
      setMechanic('normal');
    }

    setGridSize(initialGridSize);
    setTimeRemaining(initialTime);
    setMaxTime(initialTime);

    createNextChallenge(mode, levelNum, 0, 0, initialGridSize);
    setScreen('playing');
  };

  /**
   * Master Timer
   */
  useEffect(() => {
    if (screen !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Untimed modes: only survival and perfectRun
    if (currentMode === 'survival' || currentMode === 'perfectRun') {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          // Endless Mode Timeout Logic:
          if (currentMode === 'endless') {
            audioService.playWrong();
            setCombo(0);
            setWrongTaps((w) => w + 1);
            setRecentMistakes((m) => m + 1);
            setConsecutiveCorrect(0);

            setLives((prevLives) => {
              const nextLives = prevLives - 1;
              if (nextLives <= 0) {
                if (timerRef.current) clearInterval(timerRef.current);
                handleGameOver();
                return 0;
              }
              // Still has lives: grant next challenge with fresh timer!
              createNextChallenge('endless', 1, 0, recentMistakes + 1, gridSize);
              return nextLives;
            });
            return 0;
          }

          if (timerRef.current) clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, currentMode, createNextChallenge, recentMistakes, gridSize]);

  /**
   * Trigger Combo Praise Message
   */
  const triggerComboPraise = (c: number) => {
    let text: ComboPraise | null = null;
    if (c === 3) text = 'NICE!';
    else if (c === 5) text = 'GREAT!';
    else if (c === 8) text = 'AMAZING!';
    else if (c === 12) text = 'PERFECT!';
    else if (c === 16) text = 'UNSTOPPABLE!';
    else if (c >= 20 && c % 5 === 0) text = 'COLOR GENIUS!';

    if (text) {
      setComboPraise(text);
      audioService.playComboFanfare();
      setTimeout(() => setComboPraise(null), 1200);
    }
  };

  /**
   * Handle Tile Tap
   */
  const handleTileTap = (tile: GridTile) => {
    if (screen !== 'playing' || isInputLockedRef.current || tile.isFound) return;

    let matchingTargetIndex = -1;

    if (currentMode === 'colorCombo' || currentMode === 'memoryColor') {
      const expectedTarget = targets[sequenceStep];
      if (expectedTarget && !expectedTarget.isCompleted && expectedTarget.color.id === tile.color.id) {
        matchingTargetIndex = sequenceStep;
      }
    } else {
      matchingTargetIndex = targets.findIndex(
        (t) => !t.isCompleted && t.color.id === tile.color.id
      );
    }

    if (matchingTargetIndex !== -1) {
      isInputLockedRef.current = true;
      setTimeout(() => {
        isInputLockedRef.current = false;
      }, 70);

      const updatedTargets = targets.map((t, idx) =>
        idx === matchingTargetIndex ? { ...t, isCompleted: true } : t
      );
      setTargets(updatedTargets);

      setGridTiles((prev) =>
        prev.map((t) => (t.id === tile.id ? { ...t, isFound: true } : t))
      );

      if (currentMode === 'colorCombo' || currentMode === 'memoryColor') {
        setSequenceStep((s) => s + 1);
      }

      const allCompleted = updatedTargets.every((t) => t.isCompleted);

      // Time Attack Mode Logic:
      // Sahi choice: +2 seconds added to timer!
      if (currentMode === 'timeAttack') {
        setTimeRemaining((prev) => Math.min(99, prev + 2));
      }

      if (!allCompleted) {
        audioService.playTargetStep();
        // DO NOT SHUFFLE THE GRID YET!
      } else {
        // CHALLENGE FULLY COMPLETED!
        const newCorrectTaps = correctTaps + 1;
        setCorrectTaps(newCorrectTaps);

        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);

        const newConsecutive = consecutiveCorrect + 1;
        setConsecutiveCorrect(newConsecutive);
        setRecentMistakes(0);

        if (currentMode === 'perfectRun') {
          setPerfectStreak((s) => s + 1);
        }

        let basePoints = 10;
        let challengeBonus = 0;

        if (targets.length === 2) {
          challengeBonus = 35;
          setRoundDoubleCount((c) => c + 1);
          setComboPraise('DOUBLE COMPLETE!');
          audioService.playDoubleComplete();
        } else if (targets.length === 3) {
          challengeBonus = 80;
          setRoundTripleCount((c) => c + 1);
          setComboPraise('TRIPLE COMPLETE!');
          audioService.playTripleComplete();
        } else {
          audioService.playCorrect(newCombo);
          triggerComboPraise(newCombo);
        }

        let comboBonus = 0;
        if (newCombo >= 10) comboBonus = 25;
        else if (newCombo >= 5) comboBonus = 10;
        else if (newCombo >= 3) comboBonus = 5;

        setScore((prev) => prev + basePoints + challengeBonus + comboBonus);
        setTimeout(() => setComboPraise(null), 1200);

        const updatedStats = { ...stats };
        if (targets.length === 1) updatedStats.singleChallengesCompleted += 1;
        else if (targets.length === 2) updatedStats.doubleChallengesCompleted += 1;
        else if (targets.length === 3) updatedStats.tripleChallengesCompleted += 1;
        updatedStats.totalCorrectTaps += 1;
        if (newCombo > updatedStats.maxCombo) updatedStats.maxCombo = newCombo;

        evaluateProgress(
          updatedStats,
          newCorrectTaps,
          roundDoubleCount + (targets.length === 2 ? 1 : 0),
          roundTripleCount + (targets.length === 3 ? 1 : 0),
          newCombo,
          false
        );

        if (currentMode === 'levels' || currentMode === 'daily') {
          const nextRemaining = targetCountRemaining - 1;
          setTargetCountRemaining(nextRemaining);

          if (nextRemaining <= 0) {
            handleLevelComplete();
            return;
          }
        }

        let nextGridSize = gridSize;
        if (currentMode === 'endless') {
          if (newCorrectTaps > 20) nextGridSize = 4;
          else if (newCorrectTaps > 8) nextGridSize = 3;
          setGridSize(nextGridSize);
        }

        // Shuffle and generate next challenge (Endless timer will reset according to new targets!)
        createNextChallenge(currentMode, currentLevelNumber, newConsecutive, 0, nextGridSize);
      }
    } else {
      // MISTAKE / WRONG SELECTION
      audioService.playWrong();
      setCombo(0);
      setWrongTaps((prev) => prev + 1);
      setConsecutiveCorrect(0);
      setRecentMistakes((m) => m + 1);

      if (currentMode === 'classic') {
        setScore((prev) => Math.max(0, prev - 5));
      } else if (currentMode === 'timeAttack') {
        // Time Attack Penalty: -5 seconds!
        setTimeRemaining((prev) => Math.max(0, prev - 5));
      } else if (currentMode === 'endless' || currentMode === 'survival') {
        const remainingLives = lives - 1;
        setLives(remainingLives);
        if (remainingLives <= 0) {
          handleGameOver();
          return;
        }
      } else if (currentMode === 'perfectRun') {
        handleGameOver();
        return;
      }

      setTargets((prev) => prev.map((t) => ({ ...t, isCompleted: false })));
      setGridTiles((prev) => prev.map((t) => ({ ...t, isFound: false })));
      setSequenceStep(0);
    }
  };

  /**
   * Level Complete Handler
   */
  const handleLevelComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const config = currentMode === 'daily'
      ? generateDailyChallenge(storageService.getTodayKey())
      : getLevelConfig(currentLevelNumber);

    let stars = 1;
    if (timeRemaining >= config.starTimeThresholds[0]) stars = 3;
    else if (timeRemaining >= config.starTimeThresholds[1]) stars = 2;

    const timeBonus = Math.round(timeRemaining * 15);
    const finalScore = score + timeBonus;
    setScore(finalScore);

    const updatedStats = { ...stats };
    updatedStats.totalGamesPlayed += 1;
    updatedStats.totalCorrectTaps += correctTaps;
    updatedStats.totalWrongTaps += wrongTaps;
    if (maxCombo > updatedStats.maxCombo) updatedStats.maxCombo = maxCombo;

    if (currentMode === 'levels') {
      const prevStars = updatedStats.levelProgress.levelStars[currentLevelNumber] || 0;
      if (stars > prevStars) {
        updatedStats.levelProgress.levelStars[currentLevelNumber] = stars;
      }
      updatedStats.levelProgress.levelScores[currentLevelNumber] = Math.max(
        updatedStats.levelProgress.levelScores[currentLevelNumber] || 0,
        finalScore
      );

      if (currentLevelNumber >= updatedStats.levelProgress.unlockedLevel && currentLevelNumber < 200) {
        updatedStats.levelProgress.unlockedLevel = currentLevelNumber + 1;
      }
    } else if (currentMode === 'daily') {
      const todayKey = storageService.getTodayKey();
      updatedStats.dailyHistory[todayKey] = {
        completed: true,
        score: finalScore,
      };
      if (finalScore > updatedStats.highScores.daily) {
        updatedStats.highScores.daily = finalScore;
      }
    }

    storageService.saveStats(updatedStats);
    setStats(updatedStats);

    setScreen('levelComplete');
  };

  /**
   * Game Over Handler
   */
  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    audioService.playGameOver();

    const updatedStats = { ...stats };
    let isNewBest = false;

    if (currentMode === 'classic' && score > updatedStats.highScores.classic) {
      updatedStats.highScores.classic = score;
      isNewBest = true;
    } else if (currentMode === 'endless' && score > updatedStats.highScores.endless) {
      updatedStats.highScores.endless = score;
      isNewBest = true;
    } else if (currentMode === 'timeAttack' && score > updatedStats.highScores.timeAttack) {
      updatedStats.highScores.timeAttack = score;
      isNewBest = true;
    } else if (currentMode === 'colorCombo' && score > updatedStats.highScores.colorCombo) {
      updatedStats.highScores.colorCombo = score;
      isNewBest = true;
    } else if (currentMode === 'memoryColor' && score > updatedStats.highScores.memoryColor) {
      updatedStats.highScores.memoryColor = score;
      isNewBest = true;
    } else if (currentMode === 'survival' && score > updatedStats.highScores.survival) {
      updatedStats.highScores.survival = score;
      isNewBest = true;
    } else if (currentMode === 'perfectRun' && perfectStreak > updatedStats.highScores.perfectRun) {
      updatedStats.highScores.perfectRun = perfectStreak;
      isNewBest = true;
      if (perfectStreak >= 10) {
        updatedStats.perfectRunsCompleted += 1;
      }
    }

    updatedStats.totalGamesPlayed += 1;
    updatedStats.totalCorrectTaps += correctTaps;
    updatedStats.totalWrongTaps += wrongTaps;
    if (maxCombo > updatedStats.maxCombo) updatedStats.maxCombo = maxCombo;

    evaluateProgress(
      updatedStats,
      correctTaps,
      roundDoubleCount,
      roundTripleCount,
      maxCombo,
      wrongTaps === 0 && correctTaps >= 10
    );

    setScreen('gameOver');
  };

  const totalAttempts = correctTaps + wrongTaps;
  const accuracy = totalAttempts > 0 ? Math.round((correctTaps / totalAttempts) * 100) : 100;

  const roundStats: RoundStats = {
    score,
    combo,
    maxRoundCombo: maxCombo,
    correctTaps,
    wrongTaps,
    accuracy,
    timeRemaining,
    isNewBest:
      currentMode === 'perfectRun'
        ? perfectStreak >= stats.highScores.perfectRun && perfectStreak > 0
        : score >= (stats.highScores[currentMode as keyof typeof stats.highScores] || 0) && score > 0,
    doubleChallengesDone: roundDoubleCount,
    tripleChallengesDone: roundTripleCount,
  };

  const currentModeBestScore =
    currentMode === 'perfectRun'
      ? stats.highScores.perfectRun
      : stats.highScores[currentMode as keyof typeof stats.highScores] || 0;

  return (
    <main className="w-full min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center font-game overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"></div>
      </div>

      {/* Mobile viewport frame */}
      <div className="relative w-full max-w-md h-screen max-h-[920px] flex flex-col bg-slate-950 md:rounded-3xl md:border md:border-slate-800 shadow-2xl overflow-hidden z-10">
        {/* SCREEN 1: SPLASH */}
        {screen === 'splash' && (
          <SplashScreen onComplete={() => setScreen('home')} />
        )}

        {/* SCREEN 2: HOME (Base for menus) */}
        {screen !== 'playing' && screen !== 'paused' && (
          <HomeScreen
            stats={stats}
            settings={settings}
            activeTab={homeTab}
            onTabChange={setHomeTab}
            onUpdateSettings={handleUpdateSettings}
            onSelectMode={(mode) => startRound(mode)}
            onOpenLevelSelect={() => setScreen('levelSelect')}
            onOpenSettings={() => setScreen('settings')}
            onOpenTutorial={() => setScreen('tutorial')}
            onOpenDaily={() => setScreen('dailyPreview')}
            onOpenDailyMissions={() => setScreen('dailyMissions')}
            onOpenAchievements={() => setScreen('achievements')}
            isInstallable={isInstallable}
            onInstallApp={handleInstallApp}
          />
        )}

        {/* SCREEN 3: PLAYING */}
        {(screen === 'playing' || screen === 'paused') && (
          <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden select-none">
            <GameHeader
              mode={currentMode}
              levelNumber={currentLevelNumber}
              score={score}
              combo={combo}
              comboPraise={comboPraise}
              timeRemaining={timeRemaining}
              maxTime={maxTime}
              lives={lives}
              targets={targets}
              targetCountRemaining={
                currentMode === 'levels' || currentMode === 'daily'
                  ? targetCountRemaining
                  : undefined
              }
              mechanic={mechanic}
              stroopWord={stroopWord}
              stroopColorHex={stroopColorHex}
              isMemoryHidden={isMemoryHidden}
              colorAssist={settings.colorAssist}
              colorBlindLabels={settings.colorBlindLabels}
              perfectStreak={perfectStreak}
              sequenceStep={sequenceStep}
              onPause={() => setScreen('paused')}
            />

            <ColorGrid
              tiles={gridTiles}
              gridSize={gridSize}
              onTileTap={handleTileTap}
              colorAssist={settings.colorAssist}
              colorBlindLabels={settings.colorBlindLabels}
              disabled={screen === 'paused'}
            />

            {/* Bottom guide text */}
            <div className="text-center pb-2 text-[11px] text-slate-400 font-medium">
              {currentMode === 'endless'
                ? `Timed: ${maxTime}s · Tap all targets before timeout!`
                : currentMode === 'timeAttack'
                ? '+2s on correct tap · -5s penalty on mistake!'
                : targets.length > 1
                ? `Tap all ${targets.length} targets · Board shuffles once all found!`
                : 'Tap matching color · Build combo for bonuses'}
            </div>
          </div>
        )}

        {/* MODAL: PAUSE */}
        {screen === 'paused' && (
          <PauseModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResume={() => setScreen('playing')}
            onRestart={() => startRound(currentMode, currentLevelNumber)}
            onHome={() => setScreen('home')}
          />
        )}

        {/* MODAL: GAME OVER */}
        {screen === 'gameOver' && (
          <GameOverModal
            stats={roundStats}
            bestScore={currentModeBestScore}
            mode={currentMode}
            onPlayAgain={() => startRound(currentMode, currentLevelNumber)}
            onHome={() => setScreen('home')}
          />
        )}

        {/* MODAL: LEVEL COMPLETE */}
        {screen === 'levelComplete' && (
          <LevelCompleteModal
            levelNumber={currentLevelNumber}
            stats={roundStats}
            starsEarned={stats.levelProgress.levelStars[currentLevelNumber] || 3}
            hasNextLevel={currentLevelNumber < 200 && currentMode === 'levels'}
            onNextLevel={() => startRound('levels', currentLevelNumber + 1)}
            onReplay={() => startRound(currentMode, currentLevelNumber)}
            onLevelSelect={() => setScreen('levelSelect')}
          />
        )}

        {/* SCREEN: LEVEL SELECT */}
        {screen === 'levelSelect' && (
          <LevelSelectModal
            unlockedLevel={stats.levelProgress.unlockedLevel}
            levelStars={stats.levelProgress.levelStars}
            onSelectLevel={(lvl) => startRound('levels', lvl)}
            onBack={() => setScreen('home')}
          />
        )}

        {/* SCREEN: SETTINGS */}
        {screen === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenTutorial={() => setScreen('tutorial')}
            onResetData={handleResetData}
            onBack={() => setScreen('home')}
          />
        )}

        {/* MODAL: DAILY MISSIONS */}
        {screen === 'dailyMissions' && (
          <DailyMissionsModal
            missions={storageService.getDailyMissions(storageService.getTodayKey(), stats)}
            onBack={() => setScreen('home')}
          />
        )}

        {/* MODAL: ACHIEVEMENTS */}
        {screen === 'achievements' && (
          <AchievementsModal stats={stats} onBack={() => setScreen('home')} />
        )}

        {/* MODAL: TUTORIAL */}
        {screen === 'tutorial' && (
          <TutorialModal
            onClose={() => {
              const updated = { ...stats, hasCompletedTutorial: true };
              storageService.saveStats(updated);
              setStats(updated);
              setScreen('home');
            }}
          />
        )}

        {/* MODAL: DAILY CHALLENGE PREVIEW */}
        {screen === 'dailyPreview' && (
          <DailyChallengeModal
            onStartDaily={() => startRound('daily')}
            onBack={() => setScreen('home')}
          />
        )}
      </div>
    </main>
  );
}
