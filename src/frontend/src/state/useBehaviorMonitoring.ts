import { useState, useEffect, useRef } from 'react';

const INACTIVITY_THRESHOLD = 120; // 2 minutes in seconds

export function useBehaviorMonitoring(isActive: boolean) {
  const [interruptionDuration, setInterruptionDuration] = useState(0);
  const [isInactive, setIsInactive] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const inactivityIntervalRef = useRef<number | null>(null);

  // Track mouse and keyboard activity
  useEffect(() => {
    if (!isActive) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      setIsInactive(false);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isActive]);

  // Check for inactivity
  useEffect(() => {
    if (!isActive) return;

    inactivityIntervalRef.current = window.setInterval(() => {
      const timeSinceActivity = (Date.now() - lastActivityRef.current) / 1000;
      if (timeSinceActivity >= INACTIVITY_THRESHOLD) {
        setIsInactive(true);
        setInterruptionDuration((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      if (inactivityIntervalRef.current) {
        clearInterval(inactivityIntervalRef.current);
      }
    };
  }, [isActive]);

  // Track tab visibility
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setInterruptionDuration((prev) => prev + 5); // Add 5 seconds penalty
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  const recordManualInterruption = (platform: string) => {
    setInterruptionDuration((prev) => prev + 30); // Add 30 seconds penalty
  };

  return {
    interruptionDuration,
    isInactive,
    recordManualInterruption
  };
}
