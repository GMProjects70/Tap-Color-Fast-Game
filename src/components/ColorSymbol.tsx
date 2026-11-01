import React from 'react';
import { ColorSymbolType } from '../types/game';

interface ColorSymbolProps {
  symbol: ColorSymbolType;
  color?: string;
  size?: number;
  className?: string;
}

export const ColorSymbol: React.FC<ColorSymbolProps> = ({
  symbol,
  color = 'currentColor',
  size = 18,
  className = '',
}) => {
  switch (symbol) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <polygon points="12,3 21,12 12,21 3,12" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <polygon points="12,4 21,20 3,20" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <polygon points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'wave':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" className={className}>
          <path d="M2 10c3-3 5-3 8 0s5 3 8 0 4-2 4-2" />
          <path d="M2 16c3-3 5-3 8 0s5 3 8 0 4-2 4-2" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
};
