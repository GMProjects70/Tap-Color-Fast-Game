import { PlayerStats, GameSettings, DailyMission, Achievement } from '../types/game';

const STATS_KEY = 'tap_color_fast_stats_v2';
const SETTINGS_KEY = 'tap_color_fast_settings_v2';

export const DEFAULT_SETTINGS: GameSettings = {
  colorAssist: true,       // ON by default for beginners as requested
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  screenShake: true,
  reducedMotion: false,
  colorBlindLabels: false,
};

export const ACHIEVEMENTS_LIST: { id: string; title: string; description: string; target: number }[] = [
  { id: 'first_win', title: 'FIRST WIN', description: 'Complete your first game round', target: 1 },
  { id: 'color_hunter', title: 'COLOR HUNTER', description: 'Find 100 correct colors', target: 100 },
  { id: 'double_master', title: 'DOUBLE MASTER', description: 'Complete 50 double-target challenges', target: 50 },
  { id: 'triple_master', title: 'TRIPLE MASTER', description: 'Complete 25 triple-target challenges', target: 25 },
  { id: 'combo_king', title: 'COMBO KING', description: 'Achieve a 10X or higher combo', target: 10 },
  { id: 'perfect_player', title: 'PERFECT PLAYER', description: 'Complete a flawless perfect run', target: 1 },
  { id: 'speed_demon', title: 'SPEED DEMON', description: 'Finish a level with >50% time remaining', target: 1 },
];

export const DEFAULT_STATS: PlayerStats = {
  highScores: {
    classic: 0,
    endless: 0,
    timeAttack: 0,
    daily: 0,
    colorCombo: 0,
    memoryColor: 0,
    survival: 0,
    perfectRun: 0,
  },
  levelProgress: {
    unlockedLevel: 1,
    levelStars: {},
    levelScores: {},
  },
  totalGamesPlayed: 0,
  totalCorrectTaps: 0,
  totalWrongTaps: 0,
  singleChallengesCompleted: 0,
  doubleChallengesCompleted: 0,
  tripleChallengesCompleted: 0,
  perfectRunsCompleted: 0,
  maxCombo: 0,
  totalPlayTimeSeconds: 0,
  dailyHistory: {},
  dailyMissions: {},
  achievements: {},
  streakDays: 1,
  lastPlayedDate: '',
  hasCompletedTutorial: true,
};

class StorageService {
  public loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
      // Check v1 fallback
      const v1 = localStorage.getItem('tap_color_fast_settings_v1');
      if (v1) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(v1) };
      }
    } catch {
      // Local storage disabled or error
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }

  public loadStats(): PlayerStats {
    try {
      let data = localStorage.getItem(STATS_KEY);
      if (!data) {
        // Migrate from v1
        data = localStorage.getItem('tap_color_fast_stats_v1');
      }
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_STATS,
          ...parsed,
          highScores: { ...DEFAULT_STATS.highScores, ...(parsed.highScores || {}) },
          levelProgress: {
            unlockedLevel: parsed.levelProgress?.unlockedLevel || 1,
            levelStars: parsed.levelProgress?.levelStars || {},
            levelScores: parsed.levelProgress?.levelScores || {},
          },
          dailyHistory: parsed.dailyHistory || {},
          dailyMissions: parsed.dailyMissions || {},
          achievements: parsed.achievements || {},
        };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_STATS;
  }

  public saveStats(stats: PlayerStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }

  public resetAllData(): PlayerStats {
    try {
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem('tap_color_fast_stats_v1');
    } catch {
      // Ignore
    }
    return DEFAULT_STATS;
  }

  public getTodayKey(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get or generate daily missions for the specified date
   */
  public getDailyMissions(dateKey: string, stats: PlayerStats): DailyMission[] {
    if (stats.dailyMissions && stats.dailyMissions[dateKey]) {
      return stats.dailyMissions[dateKey];
    }

    const newMissions: DailyMission[] = [
      {
        id: 'mission_single',
        title: 'Color Seeker',
        description: 'Complete 20 single-color targets',
        target: 20,
        current: 0,
        completed: false,
        rewardPoints: 100,
      },
      {
        id: 'mission_double',
        title: 'Double Vision',
        description: 'Complete 5 double-color challenges',
        target: 5,
        current: 0,
        completed: false,
        rewardPoints: 200,
      },
      {
        id: 'mission_triple',
        title: 'Triple Master',
        description: 'Complete 3 triple-color challenges',
        target: 3,
        current: 0,
        completed: false,
        rewardPoints: 300,
      },
      {
        id: 'mission_combo',
        title: 'Combo King',
        description: 'Achieve a 10X Combo in any mode',
        target: 10,
        current: 0,
        completed: false,
        rewardPoints: 250,
      },
      {
        id: 'mission_perfect',
        title: 'Flawless Touch',
        description: 'Tap 15 colors in a row without mistake',
        target: 15,
        current: 0,
        completed: false,
        rewardPoints: 300,
      },
    ];

    return newMissions;
  }
}

export const storageService = new StorageService();
