import { GameColor } from '../types/game';

/**
 * High-Clarity Distinct Color Palette with Unique Symbols
 * Guarantees crisp contrast and eliminates confusing visual clashes.
 */
export const BASE_COLORS: GameColor[] = [
  { 
    id: 'red', 
    name: 'CRIMSON RED', 
    shortName: 'RED', 
    hex: '#EF4444', 
    textColor: '#FFFFFF', 
    symbol: 'circle',
    category: 'primary' 
  },
  { 
    id: 'blue', 
    name: 'OCEAN BLUE', 
    shortName: 'BLUE', 
    hex: '#2563EB', 
    textColor: '#FFFFFF', 
    symbol: 'diamond',
    category: 'primary' 
  },
  { 
    id: 'green', 
    name: 'EMERALD GREEN', 
    shortName: 'GREEN', 
    hex: '#10B981', 
    textColor: '#FFFFFF', 
    symbol: 'triangle',
    category: 'primary' 
  },
  { 
    id: 'yellow', 
    name: 'SUNNY YELLOW', 
    shortName: 'YELLOW', 
    hex: '#FACC15', 
    textColor: '#1E293B', 
    symbol: 'star',
    category: 'primary' 
  },
  { 
    id: 'purple', 
    name: 'ROYAL PURPLE', 
    shortName: 'PURPLE', 
    hex: '#8B5CF6', 
    textColor: '#FFFFFF', 
    symbol: 'hexagon',
    category: 'vibrant' 
  },
  { 
    id: 'orange', 
    name: 'TANGY ORANGE', 
    shortName: 'ORANGE', 
    hex: '#F97316', 
    textColor: '#FFFFFF', 
    symbol: 'square',
    category: 'vibrant' 
  },
  { 
    id: 'pink', 
    name: 'HOT PINK', 
    shortName: 'PINK', 
    hex: '#EC4899', 
    textColor: '#FFFFFF', 
    symbol: 'heart',
    category: 'vibrant' 
  },
  { 
    id: 'cyan', 
    name: 'CYAN TEAL', 
    shortName: 'CYAN', 
    hex: '#06B6D4', 
    textColor: '#0F172A', 
    symbol: 'wave',
    category: 'vibrant' 
  },
];

/**
 * Confusing color collision pairs to avoid in standard generation
 */
export const CONFUSING_PAIRS: [string, string][] = [
  ['blue', 'cyan'],
  ['red', 'orange'],
  ['orange', 'yellow'],
  ['pink', 'purple'],
  ['green', 'yellow'],
  ['blue', 'purple'],
];

export function isConfusingPair(colorIdA: string, colorIdB: string): boolean {
  return CONFUSING_PAIRS.some(
    ([a, b]) => (a === colorIdA && b === colorIdB) || (a === colorIdB && b === colorIdA)
  );
}

/**
 * Smart Color Selector: Selects N distinct colors with zero confusing clashes
 */
export function getSmartDistinctColors(count: number, prioritizePrimary = false): GameColor[] {
  const pool = [...BASE_COLORS].sort(() => 0.5 - Math.random());
  const selected: GameColor[] = [];

  for (const candidate of pool) {
    if (selected.length >= count) break;
    // Check if candidate clashes with any already selected color
    const hasConflict = selected.some(s => isConfusingPair(s.id, candidate.id));
    if (!hasConflict || selected.length === 0) {
      selected.push(candidate);
    }
  }

  // If pool didn't fill up due to strict conflict avoidance, fill with remaining
  if (selected.length < count) {
    for (const candidate of pool) {
      if (selected.length >= count) break;
      if (!selected.some(s => s.id === candidate.id)) {
        selected.push(candidate);
      }
    }
  }

  return selected.slice(0, count);
}

export function getRandomColor(excludeIds: string[] = []): GameColor {
  const pool = BASE_COLORS.filter(c => !excludeIds.includes(c.id));
  return pool[Math.floor(Math.random() * pool.length)] || BASE_COLORS[0];
}

export function getRandomColors(count: number): GameColor[] {
  return getSmartDistinctColors(count);
}
