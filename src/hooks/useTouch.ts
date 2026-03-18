/**
 * Custom Hook: useTouch
 *
 * Handles touch swipe gestures for mobile controls.
 * Detects swipe direction based on touch start/end positions.
 */

import { useRef, useCallback } from 'react';
import { Direction } from '../types';

type TouchHandler = (direction: Direction) => void;

interface TouchState {
  startX: number;
  startY: number;
}

const MIN_SWIPE_DISTANCE = 30; // Minimum pixels to register as swipe

export function useTouch(
  handler: TouchHandler,
  enabled: boolean = true
): (element: HTMLElement | null) => void {
  const touchStateRef = useRef<TouchState | null>(null);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const setRef = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !enabled) return;

      const handleTouchStart = (e: TouchEvent): void => {
        const touch = e.touches[0];
        if (touch) {
          touchStateRef.current = {
            startX: touch.clientX,
            startY: touch.clientY,
          };
        }
      };

      const handleTouchEnd = (e: TouchEvent): void => {
        if (!touchStateRef.current) return;

        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - touchStateRef.current.startX;
        const deltaY = touch.clientY - touchStateRef.current.startY;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Check if swipe is long enough
        if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) {
          touchStateRef.current = null;
          return;
        }

        // Determine direction based on dominant axis
        let direction: Direction;
        if (absX > absY) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        e.preventDefault();
        handlerRef.current(direction);
        touchStateRef.current = null;
      };

      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Return cleanup function stored on the element
      (element as any).__cleanupTouch__ = () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    },
    [enabled]
  );

  return setRef;
}