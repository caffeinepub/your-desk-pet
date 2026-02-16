import { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UsePointerFollowOptions {
  enabled: boolean;
  smoothing?: number;
  offset?: { x: number; y: number };
  size?: { width: number; height: number };
}

export function usePointerFollow({
  enabled,
  smoothing = 0.1,
  offset = { x: 0, y: 0 },
  size = { width: 128, height: 128 },
}: UsePointerFollowOptions): Position {
  const [position, setPosition] = useState<Position>({ x: window.innerWidth - 160, y: window.innerHeight - 160 });
  const targetRef = useRef<Position>({ x: window.innerWidth - 160, y: window.innerHeight - 160 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      // Reset to bottom-right when disabled
      const defaultX = window.innerWidth - 160;
      const defaultY = window.innerHeight - 160;
      setPosition({ x: defaultX, y: defaultY });
      targetRef.current = { x: defaultX, y: defaultY };
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      // Update target position with offset
      targetRef.current = {
        x: e.clientX + offset.x,
        y: e.clientY + offset.y,
      };
    };

    const animate = () => {
      setPosition((current) => {
        const target = targetRef.current;
        
        // Smooth interpolation
        const newX = current.x + (target.x - current.x) * smoothing;
        const newY = current.y + (target.y - current.y) * smoothing;

        // Clamp to viewport bounds
        const clampedX = Math.max(0, Math.min(window.innerWidth - size.width, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - size.height, newY));

        return { x: clampedX, y: clampedY };
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, smoothing, offset.x, offset.y, size.width, size.height]);

  return position;
}
