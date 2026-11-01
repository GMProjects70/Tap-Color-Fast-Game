/**
 * TAP COLOR FAST - Upgraded Type Definitions
 * Package: com.tapcolorfast.gmp
 * Developer: GM Projects
 */

export type GameMode = 
  | 'classic'      // 60s countdown
  | 'levels'       // 200 progressive levels
  | 'endless'      // 3 lives survival
  | 'timeAttack'   // 30s blitz
  | 'daily'        // Daily Challenge
  | 'colorCombo'   // Sequence combo mode (e.g. Red -> Blue -> Green -> Yellow)
  | 'memoryColor'  // Sequence memorization then tap in order
  | 'survival'     // 3 lives with adaptive difficulty ramp
  | 'perfectRun';  // 1 mistake ends run, test max streak!

export type GameScreen = 
  | 'splash'
  | 'home'
  | 'playing'
  | 'paused'
  | 'levelComplete'
  | 'gameOver'
  | 'levelSelect'
  | 'settings'
  | 'tutorial'
  | 'dailyPreview'
  | 'dailyMissions'
  | 'achievements';

export type ColorSymbolType = 
  | 'circle'    // RED
  | 'diamond'   // BLUE
  | 'triangle'  // GREEN
  | 'star'      // YELLOW
  | 'hexagon'   // PURPLE
  | 'square'    // ORANGE
  | 'heart'     // PINK
  | 'wave'      // CYAN
  | 'dot';      // fallback / subtle

export interface GameColor {
  id: string;
  name: string;        // e.g. "CRIMSON RED"
  shortName: string;   // e.g. "RED"
  hex: string;         // e.g. "#EF4444"
  textColor: string;   // light or dark text for contrast
  symbol: ColorSymbolType; // unique visual shape for identification
  category?: 'primary' | 'vibrant' | 'pastel' | 'neon' | 'subtle';
}

export type ChallengeType = 'single' | 'double' | 'triple' | 'sequence';

export interface TargetItem {
  id: string;
  color: GameColor;
  isCompleted: boolean;
}

export type SpecialMechanic =
  | 'normal'            // Standard: match target color
  | 'doubleTarget'      // Two target colors (FIND BOTH)
  | 'tripleTarget'      // Three target colors (FIND ALL THREE)
  | 'sequenceTarget'    // Ordered sequence
  | 'colorWord'         // Stroop effect: word printed in different ink
  | 'reverse'           // Tap the ink color, ignore text (or vice versa)
  | 'fastShuffle'       // Grid reshuffles positions
  | 'disappearing'      // Boxes blink or disappear temporarily
  | 'locked'            // Some boxes are locked/unclickable decoys
  | 'memory'            // Target shown for brief time then hidden
  | 'speed'             // Rapid response timer
  | 'fakeTarget';       // Decoy colors with slight tint difference

export interface LevelObjective {
  targetColors: GameColor[];   // 1, 2, or 3 targets
  targetCount: number;         // e.g. 5
  timeLimit: number;           // seconds
  gridSize: 2 | 3 | 4 | 5;     // e.g. 3 => 3x3 (9 boxes)
  mechanic: SpecialMechanic;
  starTimeThresholds: [number, number]; // [3 stars time remaining, 2 stars time remaining]
  instruction?: string;
  stroopWord?: string;         // text to display if colorWord/reverse
  stroopColorHex?: string;     // color of the text
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  rewardPoints: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progressText?: string;
  unlockedAt?: string;
}

export interface PlayerStats {
  highScores: {
    classic: number;
    endless: number;
    timeAttack: number;
    daily: number;
    colorCombo: number;
    memoryColor: number;
    survival: number;
    perfectRun: number;
  };
  levelProgress: {
    unlockedLevel: number; // 1 to 200
    levelStars: Record<number, number>; // levelNumber -> 1, 2, or 3
    levelScores: Record<number, number>;
  };
  totalGamesPlayed: number;
  totalCorrectTaps: number;
  totalWrongTaps: number;
  singleChallengesCompleted: number;
  doubleChallengesCompleted: number;
  tripleChallengesCompleted: number;
  perfectRunsCompleted: number;
  maxCombo: number;
  totalPlayTimeSeconds: number;
  dailyHistory: Record<string, { completed: boolean; score: number }>; // YYYY-MM-DD -> status
  dailyMissions: Record<string, DailyMission[]>; // YYYY-MM-DD -> missions
  achievements: Record<string, boolean>; // achievementId -> unlocked
  streakDays: number;
  lastPlayedDate: string;
  hasCompletedTutorial: boolean;
}

export interface GameSettings {
  colorAssist: boolean;       // Beginner assistance: names + symbols inside targets & boxes
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  screenShake: boolean;
  reducedMotion: boolean;
  colorBlindLabels: boolean;
}

export interface RoundStats {
  score: number;
  combo: number;
  maxRoundCombo: number;
  correctTaps: number;
  wrongTaps: number;
  accuracy: number;
  timeRemaining: number;
  starsEarned?: number;
  isNewBest: boolean;
  doubleChallengesDone?: number;
  tripleChallengesDone?: number;
  specialRoundName?: string;
}

export type ComboPraise = 
  | 'NICE!' 
  | 'GREAT!' 
  | 'AMAZING!' 
  | 'PERFECT!' 
  | 'UNSTOPPABLE!' 
  | 'COLOR GENIUS!'
  | 'DOUBLE COMPLETE!'
  | 'TRIPLE COMPLETE!';
