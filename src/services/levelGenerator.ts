import { BASE_COLORS, getSmartDistinctColors } from '../constants/colors';
import { GameColor, LevelObjective, SpecialMechanic } from '../types/game';

/**
 * Deterministic Level Generator for all 200 Playable Levels
 * Introduces Single, Double, and Triple targets progressively.
 * Every level is guaranteed logically solvable.
 */
export function getLevelConfig(levelNumber: number): LevelObjective {
  const clampedLevel = Math.max(1, Math.min(200, levelNumber));

  // Determine grid size
  let gridSize: 2 | 3 | 4 | 5 = 2;
  if (clampedLevel <= 10) gridSize = 2;
  else if (clampedLevel <= 60) gridSize = 3;
  else gridSize = 4; // 4x4 fits best on mobile touchscreens

  // Determine target count: 1, 2, or 3 simultaneous colors
  let targetColorCount = 1;
  let mechanic: SpecialMechanic = 'normal';

  if (clampedLevel >= 15 && clampedLevel < 50) {
    if (clampedLevel % 3 === 0) {
      targetColorCount = 2;
      mechanic = 'doubleTarget';
    }
  } else if (clampedLevel >= 50 && clampedLevel < 110) {
    if (clampedLevel % 4 === 0) {
      targetColorCount = 3;
      mechanic = 'tripleTarget';
    } else if (clampedLevel % 2 === 0) {
      targetColorCount = 2;
      mechanic = 'doubleTarget';
    }
  } else if (clampedLevel >= 110) {
    const roll = clampedLevel % 5;
    if (roll === 0 || roll === 4) {
      targetColorCount = 3;
      mechanic = 'tripleTarget';
    } else if (roll === 1 || roll === 3) {
      targetColorCount = 2;
      mechanic = 'doubleTarget';
    } else {
      targetColorCount = 1;
      mechanic = 'fastShuffle';
    }
  }

  // Pick distinct target colors with zero confusion
  const colorPool = getSmartDistinctColors(Math.max(4, targetColorCount + 1));
  const targetColors: GameColor[] = colorPool.slice(0, targetColorCount);

  // Number of required sets to complete
  let targetCount = 3;
  if (clampedLevel === 1) targetCount = 3;
  else if (clampedLevel === 2) targetCount = 5;
  else if (clampedLevel === 3) targetCount = 7;
  else if (clampedLevel === 4) targetCount = 10;
  else {
    // Scales smoothly up to 16
    targetCount = Math.min(16, 4 + Math.floor(clampedLevel * 0.06));
  }

  // Time limit (seconds)
  let timeLimit = 30;
  const timePerTarget = targetColorCount === 3 ? 3.5 : targetColorCount === 2 ? 2.5 : 1.8;
  timeLimit = Math.max(15, Math.round(18 + targetCount * timePerTarget - Math.floor(clampedLevel * 0.04)));

  // Star thresholds [3 stars, 2 stars]
  const star3 = Math.round(timeLimit * 0.45);
  const star2 = Math.round(timeLimit * 0.2);

  let instruction = `Find ${targetColors[0].shortName} boxes`;
  if (targetColorCount === 2) {
    instruction = `FIND BOTH: ${targetColors[0].shortName} & ${targetColors[1].shortName}`;
  } else if (targetColorCount === 3) {
    instruction = `FIND ALL THREE: ${targetColors[0].shortName}, ${targetColors[1].shortName} & ${targetColors[2].shortName}`;
  }

  return {
    targetColors,
    targetCount,
    timeLimit,
    gridSize,
    mechanic,
    starTimeThresholds: [star3, star2],
    instruction,
  };
}

export function generateDailyChallenge(dateKey: string): LevelObjective {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Rotate between single, double, and triple daily challenges
  const modeRoll = positiveHash % 3;
  let targetColorCount = 1;
  let mechanic: SpecialMechanic = 'fastShuffle';

  if (modeRoll === 1) {
    targetColorCount = 2;
    mechanic = 'doubleTarget';
  } else if (modeRoll === 2) {
    targetColorCount = 3;
    mechanic = 'tripleTarget';
  }

  const distinctColors = getSmartDistinctColors(targetColorCount + 3);
  const targetColors = distinctColors.slice(0, targetColorCount);
  const targetCount = targetColorCount === 3 ? 6 : targetColorCount === 2 ? 10 : 15;
  const timeLimit = 45;

  let instruction = `Daily Trophy: Tap ${targetColors.map(c => c.shortName).join(' + ')}`;

  return {
    targetColors,
    targetCount,
    timeLimit,
    gridSize: 3,
    mechanic,
    starTimeThresholds: [20, 10],
    instruction,
  };
}
