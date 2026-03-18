/**
 * Grid Component
 *
 * Renders the 4x4 game board with:
 * - Responsive sizing (uses viewport units)
 * - Empty cell placeholders with glass effect
 * - Tile positioning and animations
 */

import React, { useRef } from 'react';
import { TileData, GRID_SIZE } from '../types';
import { Tile } from './Tile';
import styles from './Grid.module.css';

interface GridProps {
  tiles: TileData[];
  onTouchRef: (element: HTMLElement | null) => void;
  status: 'playing' | 'won' | 'over';
}

// Grid dimensions - responsive
const CELL_SIZE = 75; // Base cell size in pixels
const GAP = 12; // Gap between cells
const PADDING = 12; // Grid padding

export const Grid: React.FC<GridProps> = React.memo(({ tiles, onTouchRef, status }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate total grid size
  const gridSize = GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GAP + PADDING * 2;

  return (
    <div
      ref={(el) => {
        (gridRef as any).current = el;
        onTouchRef(el);
      }}
      className={`${styles.grid} ${status !== 'playing' ? styles.gridDisabled : ''}`}
      style={{
        width: gridSize,
        height: gridSize,
        padding: PADDING,
        gap: GAP,
      }}
    >
      {/* Empty cell placeholders */}
      <div className={styles.cells}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <div
            key={index}
            className={styles.cell}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          />
        ))}
      </div>

      {/* Active tiles */}
      <div className={styles.tiles}>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            cellSize={CELL_SIZE}
            gap={GAP}
          />
        ))}
      </div>
    </div>
  );
});

Grid.displayName = 'Grid';