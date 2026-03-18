/**
 * ScoreBoard Component
 *
 * Displays current score and best score with
 * glass-morphism styling and score animations.
 */

import React, { useEffect, useState } from 'react';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({ score, bestScore }) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [scorePop, setScorePop] = useState(false);

  // Animate score changes
  useEffect(() => {
    if (score !== displayScore) {
      setScorePop(true);
      const timer = setTimeout(() => setScorePop(false), 200);

      // Smooth number animation
      const diff = score - displayScore;
      const steps = Math.min(Math.abs(diff), 10);
      const increment = diff / steps;
      let current = displayScore;

      const interval = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= score) || (increment < 0 && current <= score)) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, 30);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [score, displayScore]);

  return (
    <div className={styles.container}>
      <div className={`${styles.scoreBox} ${scorePop ? styles.scorePop : ''}`}>
        <span className={styles.label}>分数</span>
        <span className={styles.value}>{displayScore}</span>
      </div>
      <div className={styles.scoreBox}>
        <span className={styles.label}>最高</span>
        <span className={styles.value}>{bestScore}</span>
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';