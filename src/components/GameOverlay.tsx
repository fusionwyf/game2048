/**
 * GameOverlay Component
 *
 * Displays game over or win overlay with
 * glass-morphism styling and animations.
 */

import React from 'react';
import styles from './GameOverlay.module.css';

interface GameOverlayProps {
  status: 'won' | 'over';
  score: number;
  onNewGame: () => void;
  onContinue?: () => void;
}

const quotes = [
  '每一次移动都是新的可能 ✨',
  '数字在指尖舞蹈 💫',
  '静谧中蕴含力量 🌊',
  '享受当下的每一刻 🎯',
  '失败是成功的前奏 🎵',
];

export const GameOverlay: React.FC<GameOverlayProps> = React.memo(({
  status,
  score,
  onNewGame,
  onContinue,
}) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const isWin = status === 'won';

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {isWin ? '🎉 恭喜达成 2048!' : '游戏结束'}
        </h2>
        <p className={styles.score}>最终分数: {score}</p>
        <p className={styles.quote}>{quote}</p>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={onNewGame}>
            再来一局
          </button>
          {isWin && onContinue && (
            <button
              className={`${styles.button} ${styles.continue}`}
              onClick={onContinue}
            >
              继续挑战
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

GameOverlay.displayName = 'GameOverlay';