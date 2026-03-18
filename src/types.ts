/**
 * 2048 Game Type Definitions
 *
 * This file contains all TypeScript type definitions for the game.
 * Key design decisions:
 * - Grid uses (number | null)[][] to represent empty cells
 * - TileData includes animation state (isNew, isMerged)
 * - Direction is a union type for type-safe movement
 * - GameAction uses discriminated unions for reducer pattern
 */

// ============ Core Types ============

/** 4x4 grid where null represents empty cell */
export type Grid = (number | null)[][];

/** Movement directions */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** Game status states */
export type GameStatus = 'playing' | 'won' | 'over';

/** Position on the grid */
export interface Position {
  row: number;
  col: number;
}

/** Tile data for rendering */
export interface TileData {
  id: number;
  value: number;
  position: Position;
  isNew: boolean;
  isMerged: boolean;
}

/** Complete game state */
export interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  status: GameStatus;
  tiles: TileData[];
}

// ============ Action Types ============

/** Discriminated union for game actions */
export type GameAction =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESET' }
  | { type: 'SPAWN_TILE' }
  | { type: 'UPDATE_BEST_SCORE' };

// ============ Theme Types ============

export type ThemeName = 'deep-sea' | 'sunset' | 'aurora' | 'midnight';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

// ============ Sound Types ============

export type SoundType = 'move' | 'merge' | 'appear' | 'gameOver' | 'win';

export interface SoundConfig {
  enabled: boolean;
  volume: number;
}

// ============ Animation Types ============

export interface AnimationConfig {
  moveDuration: number;    // ms
  mergeDuration: number;   // ms
  appearDuration: number;  // ms
}

// ============ Constants ============

export const GRID_SIZE = 4;

export const ANIMATION_CONFIG: AnimationConfig = {
  moveDuration: 150,
  mergeDuration: 200,
  appearDuration: 200,
};