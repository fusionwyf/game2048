/**
 * App.tsx - Main Component
 *
 * 2048 Game with atmospheric "vibe coding" design.
 *
 * Design Philosophy:
 * - "数字海洋中滑行" (Sliding in a digital ocean)
 * - Immersive, relaxing, yet addictive gameplay
 * - Deep space/ocean aesthetic with soft neon accents
 * - Glass-morphism tiles with smooth animations
 *
 * Component Architecture:
 * - App: Root component managing state, events, and layout
 * - Grid: 4x4 game board rendering tiles
 * - Tile: Individual number blocks with animations
 * - ScoreBoard: Current and best score display
 * - GameControls: New game, theme, and sound controls
 * - ParticleBackground: Ambient floating particles
 * - GameOverlay: Win/game over screens
 *
 * Type Safety:
 * - All props and state are strictly typed
 * - Discriminated unions for game actions
 * - Proper event handler types
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Grid } from './components/Grid';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { ParticleBackground } from './components/ParticleBackground';
import { GameOverlay } from './components/GameOverlay';
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboard } from './hooks/useKeyboard';
import { useTouch } from './hooks/useTouch';
import { useSound } from './hooks/useSound';
import type { Direction, SoundConfig } from './types';
import './App.css';

// Theme gradients
const THEMES = [
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a1a2a 100%)', name: '深海' },
  { bg: 'linear-gradient(135deg, #1a0a1a 0%, #2a1a1a 50%, #1a0a0a 100%)', name: '黄昏' },
  { bg: 'linear-gradient(135deg, #0a1a1a 0%, #1a2a1a 50%, #0a2a1a 100%)', name: '极光' },
  { bg: 'linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #0a0a3a 100%)', name: '午夜' },
];

const App: React.FC = () => {
  // Game state
  const { tiles, score, bestScore, status, move, reset } = useGameLogic();

  // Theme state
  const [currentTheme, setCurrentTheme] = useState(0);

  // Sound state
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({ enabled: true, volume: 0.3 });
  const { play: playSound, toggle: toggleSound, isEnabled: soundEnabled } = useSound(soundConfig);

  // Handle movement with sound
  const handleMove = useCallback((direction: Direction) => {
    if (status !== 'playing') return;
    move(direction);
    playSound('move');
  }, [status, move, playSound]);

  // Keyboard controls
  useKeyboard(handleMove);

  // Touch controls
  const touchRef = useTouch(handleMove, status === 'playing');

  // New game handler
  const handleNewGame = useCallback(() => {
    reset();
    playSound('appear');
  }, [reset, playSound]);

  // Theme change handler
  const handleThemeChange = useCallback(() => {
    setCurrentTheme((prev) => (prev + 1) % THEMES.length);
  }, []);

  // Sound toggle handler
  const handleToggleSound = useCallback(() => {
    toggleSound();
    setSoundConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, [toggleSound]);

  // Game over sound effect
  React.useEffect(() => {
    if (status === 'over') {
      playSound('gameOver');
    } else if (status === 'won') {
      playSound('win');
    }
  }, [status, playSound]);

  // Current theme style
  const themeStyle = useMemo(() => ({
    background: THEMES[currentTheme].bg,
  }), [currentTheme]);

  return (
    <div className="app" style={themeStyle}>
      <ParticleBackground theme={currentTheme} />

      <div className="game-container">
        <header className="header">
          <h1 className="title">2048</h1>
          <p className="subtitle">数字海洋 · 滑行冥想</p>
        </header>

        <ScoreBoard score={score} bestScore={bestScore} />

        <GameControls
          onNewGame={handleNewGame}
          onToggleSound={handleToggleSound}
          soundEnabled={soundEnabled}
          currentTheme={currentTheme.toString()}
          onThemeChange={handleThemeChange}
        />

        <div className="grid-wrapper">
          <Grid
            tiles={tiles}
            onTouchRef={touchRef}
            status={status}
          />
          {status !== 'playing' && (
            <GameOverlay
              status={status}
              score={score}
              onNewGame={handleNewGame}
            />
          )}
        </div>

        <footer className="footer">
          <p className="hint">
            使用 <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> 或滑动屏幕移动方块
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;