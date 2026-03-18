/**
 * Custom Hook: useKeyboard
 *
 * Handles keyboard events for game controls.
 * Returns a stable callback ref that can be updated without re-registering events.
 */

import { useEffect, useRef } from 'react';
import { Direction } from '../types';

type KeyboardHandler = (direction: Direction) => void;

export function useKeyboard(handler: KeyboardHandler): void {
  // Use ref to avoid re-registering event listener on every render
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      let direction: Direction | null = null;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
        default:
          return;
      }

      event.preventDefault();
      handlerRef.current(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}