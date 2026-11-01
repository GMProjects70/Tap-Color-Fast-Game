import React, { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { GameColor } from '../types/game';
import { ColorSymbol } from './ColorSymbol';

export interface GridTile {
  id: string; // unique key
  color: GameColor;
  isLocked?: boolean;
  isDisappeared?: boolean;
  isFound?: boolean; // marked completed in multi-target challenges
}

interface ColorGridProps {
  tiles: GridTile[];
  gridSize: 2 | 3 | 4 | 5;
  onTileTap: (tile: GridTile) => void;
  colorAssist: boolean;
  colorBlindLabels: boolean;
  disabled?: boolean;
}

export const ColorGrid: React.FC<ColorGridProps> = ({
  tiles,
  gridSize,
  onTileTap,
  colorAssist,
  colorBlindLabels,
  disabled = false,
}) => {
  const [tappedTileId, setTappedTileId] = useState<string | null>(null);

  const handleTap = (tile: GridTile) => {
    if (disabled || tile.isLocked || tile.isDisappeared || tile.isFound) return;

    setTappedTileId(tile.id);
    setTimeout(() => setTappedTileId(null), 180);

    onTileTap(tile);
  };

  const gridColsClass =
    gridSize === 2
      ? 'grid-cols-2'
      : gridSize === 3
      ? 'grid-cols-3'
      : gridSize === 4
      ? 'grid-cols-4'
      : 'grid-cols-5';

  return (
    <div className="w-full flex-1 flex items-center justify-center p-2">
      <div className={`grid ${gridColsClass} gap-2.5 w-full max-w-sm aspect-square`}>
        {tiles.map((tile) => {
          const isTapped = tappedTileId === tile.id;

          if (tile.isDisappeared) {
            return (
              <div
                key={tile.id}
                className="w-full h-full rounded-2xl bg-slate-900/40 border border-slate-800/40 opacity-20 pointer-events-none"
              />
            );
          }

          return (
            <button
              key={tile.id}
              disabled={disabled || tile.isLocked || tile.isFound}
              onClick={() => handleTap(tile)}
              style={{ backgroundColor: tile.color.hex }}
              className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all touch-manipulation select-none ${
                tile.isFound
                  ? 'brightness-75 scale-95 ring-2 ring-emerald-400'
                  : isTapped
                  ? 'scale-90 brightness-110'
                  : 'active:scale-95 hover:brightness-105'
              } ${
                tile.isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
              } border border-white/25`}
            >
              {tile.isFound ? (
                // Completed checked state
                <div className="w-8 h-8 rounded-full bg-emerald-500/90 border border-white flex items-center justify-center text-white shadow-md animate-pop-in">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              ) : tile.isLocked ? (
                // Locked box
                <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white shadow-md">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  {/* Subtle color symbol (when color assist is ON) */}
                  {colorAssist && (
                    <div className="opacity-80 transition-opacity">
                      <ColorSymbol
                        symbol={tile.color.symbol}
                        color={tile.color.textColor}
                        size={gridSize >= 4 ? 16 : 22}
                      />
                    </div>
                  )}

                  {/* Text label if color assist or colorBlindLabels is active */}
                  {(colorAssist || colorBlindLabels) && (
                    <span
                      className="text-[10px] md:text-xs font-black font-game tracking-wider drop-shadow-sm mt-0.5"
                      style={{ color: tile.color.textColor }}
                    >
                      {tile.color.shortName}
                    </span>
                  )}

                  {/* If both assist & labels are off, show subtle decorative dot */}
                  {!colorAssist && !colorBlindLabels && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white/40 drop-shadow-sm"></span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
