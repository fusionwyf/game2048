/**
 * GameControls Component
 *
 * Control buttons for:
 * - New game
 * - Sound toggle
 * - Theme switch
 */

import React from 'react';
import styles from './GameControls.module.css';

interface GameControlsProps {
  onNewGame: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  currentTheme: string;
  onThemeChange: () => void;
}

const themes = ['深海', '黄昏', '极光', '午夜'];

export const GameControls: React.FC<GameControlsProps> = React.memo(({
  onNewGame,
  onToggleSound,
  soundEnabled,
  currentTheme,
  onThemeChange,
}) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.newGame}`}
        onClick={onNewGame}
        aria-label="开始新游戏"
      >
        <span className={styles.buttonText}>新游戏</span>
      </button>

      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onThemeChange}
        aria-label="切换主题"
      >
        {themes[parseInt(currentTheme) % themes.length]}
      </button>

      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onToggleSound}
        aria-label={soundEnabled ? '关闭声音' : '开启声音'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
});

GameControls.displayName = 'GameControls';