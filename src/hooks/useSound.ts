/**
 * Custom Hook: useSound
 *
 * Creates synthesized sound effects using Web Audio API.
 * All sounds are generated procedurally - no external files needed.
 */

import { useCallback, useRef } from 'react';
import { SoundType, SoundConfig } from '../types';

const defaultConfig: SoundConfig = {
  enabled: true,
  volume: 0.3,
};

export function useSound(config: SoundConfig = defaultConfig): {
  play: (type: SoundType) => void;
  toggle: () => void;
  isEnabled: boolean;
} {
  const audioContextRef = useRef<AudioContext | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Create oscillator-based sound
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine', attack = 0.01) => {
      if (!configRef.current.enabled) return;

      const ctx = initAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        configRef.current.volume,
        ctx.currentTime + attack
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [initAudioContext]
  );

  // Sound effect definitions
  const play = useCallback(
    (type: SoundType) => {
      switch (type) {
        case 'move':
          // Soft whoosh sound
          playTone(200, 0.1, 'sine', 0.01);
          break;
        case 'merge':
          // Pleasant ding with harmonic
          playTone(523.25, 0.2, 'sine', 0.01); // C5
          setTimeout(() => playTone(659.25, 0.15, 'sine', 0.01), 50); // E5
          break;
        case 'appear':
          // Subtle pop
          playTone(400, 0.08, 'sine', 0.005);
          break;
        case 'win':
          // Triumphant chord
          playTone(523.25, 0.5, 'sine', 0.01);
          setTimeout(() => playTone(659.25, 0.5, 'sine', 0.01), 100);
          setTimeout(() => playTone(783.99, 0.6, 'sine', 0.01), 200);
          break;
        case 'gameOver':
          // Descending minor chord
          playTone(392, 0.3, 'sine', 0.05);
          setTimeout(() => playTone(349.23, 0.4, 'sine', 0.05), 150);
          setTimeout(() => playTone(311.13, 0.6, 'sine', 0.05), 300);
          break;
      }
    },
    [playTone]
  );

  const toggle = useCallback(() => {
    configRef.current = {
      ...configRef.current,
      enabled: !configRef.current.enabled,
    };
  }, []);

  return {
    play,
    toggle,
    isEnabled: config.enabled,
  };
}