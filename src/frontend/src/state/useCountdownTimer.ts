import { useState, useEffect, useRef } from 'react';

export function useCountdownTimer(initialSeconds: number) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setTimeRemaining(initialSeconds);
  };

  const reset = (newSeconds: number) => {
    setTimeRemaining(newSeconds);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    resume,
    stop,
    reset
  };
}
