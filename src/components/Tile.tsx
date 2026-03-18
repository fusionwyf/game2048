/**
 * Tile Component
 *
 * Renders individual number tiles with:
 * - Glass-morphism effect (backdrop blur, transparency)
 * - Smooth position and appearance animations
 * - Color-coded values with soft glows (extended to 131072+)
 * - Merge pulse animation
 * - Responsive font sizing based on digit count
 */

import React, { useMemo, useEffect, useState } from 'react';
import { TileData } from '../types';
import styles from './Tile.module.css';

interface TileProps {
  tile: TileData;
  cellSize: number;
  gap: number;
}

// Color mapping for different tile values (2 through 131072+)
const getTileColors = (value: number): { bg: string; text: string; glow: string } => {
  const colorMap: Record<number, { bg: string; text: string; glow: string }> = {
    // 2-2048: original glass-morphism colors
    2: { bg: 'rgba(255, 255, 255, 0.15)', text: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)' },
    4: { bg: 'rgba(255, 255, 255, 0.2)', text: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' },
    8: { bg: 'rgba(255, 180, 120, 0.35)', text: '#fff5eb', glow: 'rgba(255, 180, 120, 0.5)' },
    16: { bg: 'rgba(255, 140, 100, 0.4)', text: '#ffffff', glow: 'rgba(255, 140, 100, 0.6)' },
    32: { bg: 'rgba(255, 100, 100, 0.45)', text: '#ffffff', glow: 'rgba(255, 100, 100, 0.6)' },
    64: { bg: 'rgba(255, 80, 80, 0.5)', text: '#ffffff', glow: 'rgba(255, 80, 80, 0.7)' },
    128: { bg: 'rgba(255, 215, 100, 0.45)', text: '#ffffff', glow: 'rgba(255, 215, 100, 0.7)' },
    256: { bg: 'rgba(255, 200, 80, 0.5)', text: '#ffffff', glow: 'rgba(255, 200, 80, 0.75)' },
    512: { bg: 'rgba(255, 180, 60, 0.55)', text: '#ffffff', glow: 'rgba(255, 180, 60, 0.8)' },
    1024: { bg: 'rgba(180, 100, 255, 0.5)', text: '#ffffff', glow: 'rgba(180, 100, 255, 0.8)' },
    2048: { bg: 'rgba(100, 255, 180, 0.5)', text: '#ffffff', glow: 'rgba(100, 255, 180, 0.9)' },
    // 4096+: extended colors for high-value tiles
    4096: { bg: 'rgba(140, 80, 220, 0.55)', text: '#ffffff', glow: 'rgba(140, 80, 220, 0.85)' },
    8192: { bg: 'rgba(220, 60, 60, 0.55)', text: '#ffffff', glow: 'rgba(220, 60, 60, 0.85)' },
    16384: { bg: 'rgba(200, 160, 40, 0.55)', text: '#ffffff', glow: 'rgba(200, 160, 40, 0.85)' },
    32768: { bg: 'rgba(40, 180, 160, 0.55)', text: '#ffffff', glow: 'rgba(40, 180, 160, 0.85)' },
    65536: { bg: 'rgba(180, 60, 140, 0.55)', text: '#ffffff', glow: 'rgba(180, 60, 140, 0.85)' },
    // 131072+: dark "super" tile style (matches original 2048)
    131072: { bg: 'rgba(60, 58, 50, 0.6)', text: '#ffffff', glow: 'rgba(60, 58, 50, 0.7)' },
  };

  // Use predefined color if available, otherwise use dark "super" style
  return colorMap[value] || {
    bg: 'rgba(60, 58, 50, 0.6)',
    text: '#ffffff',
    glow: 'rgba(60, 58, 50, 0.7)'
  };
};

// Calculate responsive font size based on digit count
// Ensures large numbers (16384, 65536) don't overflow tile boundaries
const getFontSize = (value: number, cellSize: number): number => {
  const digitCount = String(value).length;
  const baseSize = digitCount <= 2
    ? cellSize * 0.45
    : digitCount === 3
      ? cellSize * 0.35
      : cellSize * 0.22;
  // Clamp: min ensures readability, max prevents overflow
  return Math.max(cellSize * 0.16, Math.min(baseSize, cellSize * 0.42));
};

export const Tile: React.FC<TileProps> = React.memo(({ tile, cellSize, gap }) => {
  const { value, position, isNew, isMerged } = tile;
  const colors = useMemo(() => getTileColors(value), [value]);
  const [showMerge, setShowMerge] = useState(false);

  useEffect(() => {
    if (isMerged) {
      setShowMerge(true);
      const timer = setTimeout(() => setShowMerge(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isMerged]);

  // Calculate position
  const translateX = position.col * (cellSize + gap);
  const translateY = position.row * (cellSize + gap);

  // Dynamic styles — ONLY position on outer element
  const tileStyle: React.CSSProperties = {
    width: cellSize,
    height: cellSize,
    transform: `translate(${translateX}px, ${translateY}px)`,
  };

  // Inner element styles — colors and font size
  const innerStyle: React.CSSProperties = {
    backgroundColor: colors.bg,
    color: colors.text,
    boxShadow: `0 0 20px ${colors.glow}, inset 0 0 30px rgba(255,255,255,0.1)`,
    fontSize: getFontSize(value, cellSize),
  };

  // Build class names
  const tileClasses = [
    styles.tile,
    isNew && styles.tileNew,
    showMerge && styles.tileMerged,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={tileClasses} style={tileStyle}>
      <div className={styles.tileInner} style={innerStyle}>
        <span className={styles.tileValue}>{value}</span>
      </div>
    </div>
  );
});

Tile.displayName = 'Tile';