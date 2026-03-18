/**
 * Custom Hook: useGameLogic
 *
 * Core game logic for 2048 - handles grid manipulation, movement, merging,
 * and game state management using useReducer pattern.
 *
 * Key algorithms:
 * - Movement: Uses coordinate transformation to handle all 4 directions
 * - Merging: Same-value tiles combine when pushed together
 * - Win detection: Checks for 2048 tile
 * - Game over detection: No valid moves remaining
 */

import { useReducer, useCallback, useEffect } from 'react';
import {
  Grid,
  Direction,
  GameState,
  GameAction,
  TileData,
  Position,
  GRID_SIZE,
} from '../types';

// ============ Initial State ============

const createEmptyGrid = (): Grid => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
};

const getEmptyCells = (grid: Grid): Position[] => {
  const cells: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
};

const spawnTile = (grid: Grid): { grid: Grid; position: Position; value: number } => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) {
    return { grid, position: { row: -1, col: -1 }, value: 0 };
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newGrid = grid.map((row) => [...row]);
  newGrid[randomCell.row][randomCell.col] = value;

  return { grid: newGrid, position: randomCell, value };
};

const initializeGrid = (): { grid: Grid; tiles: TileData[] } => {
  let grid = createEmptyGrid();
  const tiles: TileData[] = [];

  // Spawn two initial tiles
  for (let i = 0; i < 2; i++) {
    const result = spawnTile(grid);
    grid = result.grid;
    if (result.position.row >= 0) {
      tiles.push({
        id: Date.now() + i,
        value: result.value,
        position: result.position,
        isNew: true,
        isMerged: false,
      });
    }
  }

  return { grid, tiles };
};

const getBestScore = (): number => {
  try {
    return parseInt(localStorage.getItem('2048-best-score') || '0', 10);
  } catch {
    return 0;
  }
};

const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem('2048-best-score', score.toString());
  } catch {
    // Ignore localStorage errors
  }
};

// ============ Movement Logic ============

interface MoveResult {
  grid: Grid;
  score: number;
  moved: boolean;
  mergedPositions: Position[];
  tileMovements: Map<string, Position>;
}

const rotateGrid = (grid: Grid, times: number): Grid => {
  let result = grid.map((row) => [...row]);
  for (let t = 0; t < times; t++) {
    const newGrid = createEmptyGrid();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[col][GRID_SIZE - 1 - row] = result[row][col];
      }
    }
    result = newGrid;
  }
  return result;
};

const moveLeft = (grid: Grid): MoveResult & { tileMovements: Map<string, Position> } => {
  const newGrid = createEmptyGrid();
  let score = 0;
  let moved = false;
  const mergedPositions: Position[] = [];
  const tileMovements = new Map<string, Position>(); // Track where each tile moved from

  for (let row = 0; row < GRID_SIZE; row++) {
    const rowValues = grid[row].filter((v) => v !== null) as number[];
    const rowIndices: number[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        rowIndices.push(col);
      }
    }

    const newRow: (number | null)[] = [];
    let skip = false;

    for (let i = 0; i < rowValues.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i + 1 < rowValues.length && rowValues[i] === rowValues[i + 1]) {
        const merged = rowValues[i] * 2;
        newRow.push(merged);
        // Record that tiles from rowIndices[i] and rowIndices[i+1] moved to newRow.length-1
        // For merged tiles, we use the first tile's position as the "from" position
        tileMovements.set(`${row},${newRow.length - 1}`, { row, col: rowIndices[i] });
        score += merged;
        mergedPositions.push({ row, col: newRow.length - 1 });
        skip = true;
      } else {
        newRow.push(rowValues[i]);
        tileMovements.set(`${row},${newRow.length - 1}`, { row, col: rowIndices[i] });
      }
    }

    // Fill remaining with null
    while (newRow.length < GRID_SIZE) {
      newRow.push(null);
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      newGrid[row][col] = newRow[col];
      if (newGrid[row][col] !== grid[row][col]) {
        moved = true;
      }
    }
  }

  return { grid: newGrid, score, moved, mergedPositions, tileMovements };
};

const moveGrid = (grid: Grid, direction: Direction): MoveResult & { mergedPositions: Position[]; tileMovements: Map<string, Position> } => {
  // Rotate grid so all movements become "left" movement
  const rotations: Record<Direction, number> = {
    left: 0,
    up: 3,    // 3 clockwise rotations = 1 counterclockwise rotation
    right: 2,
    down: 1,  // 1 clockwise rotation
  };

  const rotatedGrid = rotateGrid(grid, rotations[direction]);
  const result = moveLeft(rotatedGrid);
  const finalGrid = rotateGrid(result.grid, (4 - rotations[direction]) % 4);

  // Rotate merged positions back
  const rotatedMerged = result.mergedPositions.map((pos) => {
    let { row, col } = pos;
    for (let t = 0; t < (4 - rotations[direction]) % 4; t++) {
      const newRow = col;
      const newCol = GRID_SIZE - 1 - row;
      row = newRow;
      col = newCol;
    }
    return { row, col };
  });

  // Rotate tile movements back - the map keys are "row,col" in the rotated frame
  // We need to rotate both the keys (new positions) and values (old positions)
  const rotatedMovements = new Map<string, Position>();
  result.tileMovements.forEach((oldPos, key) => {
    const [row, col] = key.split(',').map(Number);
    // Rotate the new position (key) back to original frame
    let newRow = row;
    let newCol = col;
    for (let t = 0; t < (4 - rotations[direction]) % 4; t++) {
      const tempRow = newRow;
      newRow = newCol;
      newCol = GRID_SIZE - 1 - tempRow;
    }
    // Rotate the old position (value) back to original frame
    let rotatedOldRow = oldPos.row;
    let rotatedOldCol = oldPos.col;
    for (let t = 0; t < (4 - rotations[direction]) % 4; t++) {
      const tempRow = rotatedOldRow;
      rotatedOldRow = rotatedOldCol;
      rotatedOldCol = GRID_SIZE - 1 - tempRow;
    }
    rotatedMovements.set(`${newRow},${newCol}`, { row: rotatedOldRow, col: rotatedOldCol });
  });

  return { ...result, grid: finalGrid, mergedPositions: rotatedMerged, tileMovements: rotatedMovements };
};

// ============ Game State Check ============

const hasWon = (grid: Grid): boolean => {
  for (const row of grid) {
    for (const cell of row) {
      if (cell === 2048) return true;
    }
  }
  return false;
};

const canMove = (grid: Grid): boolean => {
  // Check for empty cells
  if (getEmptyCells(grid).length > 0) return true;

  // Check for possible merges
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = grid[row][col];
      // Check right neighbor
      if (col + 1 < GRID_SIZE && grid[row][col + 1] === value) return true;
      // Check bottom neighbor
      if (row + 1 < GRID_SIZE && grid[row + 1][col] === value) return true;
    }
  }

  return false;
};

// ============ Reducer ============

const createInitialState = (): GameState => {
  const { grid, tiles } = initializeGrid();
  return {
    grid,
    score: 0,
    bestScore: getBestScore(),
    status: 'playing',
    tiles,
  };
};

let tileIdCounter = 0;
const getNextTileId = () => ++tileIdCounter;

const gridReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE': {
      if (state.status !== 'playing') return state;

      const result = moveGrid(state.grid, action.direction);
      if (!result.moved) return state;

      // Update tiles: remove merged, update positions
      const newTiles: TileData[] = [];
      const mergedSet = new Set(
        result.mergedPositions.map((p) => `${p.row},${p.col}`)
      );

      // Create tile map from old grid (using position as key)
      const oldTileMap = new Map<string, TileData>();
      state.tiles.forEach((tile) => {
        oldTileMap.set(`${tile.position.row},${tile.position.col}`, tile);
      });

      // Create tiles from new grid using tileMovements to track original positions
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const value = result.grid[row][col];
          if (value !== null) {
            const newKey = `${row},${col}`;
            const isMerged = mergedSet.has(newKey);

            // Use tileMovements to find where this tile came from
            const movementInfo = result.tileMovements.get(newKey);
            const oldKey = movementInfo ? `${movementInfo.row},${movementInfo.col}` : null;
            const oldTile = oldKey ? oldTileMap.get(oldKey) : null;

            newTiles.push({
              id: isMerged ? getNextTileId() : (oldTile?.id ?? getNextTileId()),
              value,
              position: { row, col },
              isNew: false,
              isMerged,
            });
          }
        }
      }

      // Spawn new tile
      const spawnResult = spawnTile(result.grid);
      if (spawnResult.position.row >= 0) {
        newTiles.push({
          id: getNextTileId(),
          value: spawnResult.value,
          position: spawnResult.position,
          isNew: true,
          isMerged: false,
        });
      }

      const newScore = state.score + result.score;
      const newBestScore = Math.max(state.bestScore, newScore);

      if (newBestScore > state.bestScore) {
        saveBestScore(newBestScore);
      }

      let newStatus: GameState['status'] = 'playing';
      if (hasWon(spawnResult.grid)) {
        newStatus = 'won';
      } else if (!canMove(spawnResult.grid)) {
        newStatus = 'over';
      }

      return {
        grid: spawnResult.grid,
        score: newScore,
        bestScore: newBestScore,
        status: newStatus,
        tiles: newTiles,
      };
    }

    case 'RESET': {
      const { grid, tiles } = initializeGrid();
      return {
        ...state,
        grid,
        tiles,
        score: 0,
        status: 'playing',
      };
    }

    case 'UPDATE_BEST_SCORE': {
      return {
        ...state,
        bestScore: getBestScore(),
      };
    }

    default:
      return state;
  }
};

// ============ Hook ============

export function useGameLogic() {
  const [state, dispatch] = useReducer(gridReducer, null, createInitialState);

  const move = useCallback((direction: Direction) => {
    dispatch({ type: 'MOVE', direction });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Sync best score from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'UPDATE_BEST_SCORE' });
  }, []);

  return {
    ...state,
    move,
    reset,
  };
}