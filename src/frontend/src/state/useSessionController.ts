import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionConfig } from './sessionTypes';

export type SessionPhase = 'idle' | 'focus' | 'break';

interface SessionState {
  phase: SessionPhase;
  config: SessionConfig | null;
  focusTimeRemaining: number;
  breakTimeRemaining: number;
  isRunning: boolean;
  interruptionDuration: number;
}

export function useSessionController() {
  const [state, setState] = useState<SessionState>({
    phase: 'idle',
    config: null,
    focusTimeRemaining: 0,
    breakTimeRemaining: 0,
    isRunning: false,
    interruptionDuration: 0,
  });

  const intervalRef = useRef<number | null>(null);

  // Start a new session
  const startSession = useCallback((config: SessionConfig) => {
    setState({
      phase: 'focus',
      config,
      focusTimeRemaining: config.focusDuration * 60,
      breakTimeRemaining: config.breakDuration * 60,
      isRunning: true,
      interruptionDuration: 0,
    });
  }, []);

  // Pause the current timer
  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  // Resume the current timer
  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  // End the session completely
  const endSession = useCallback(() => {
    setState({
      phase: 'idle',
      config: null,
      focusTimeRemaining: 0,
      breakTimeRemaining: 0,
      isRunning: false,
      interruptionDuration: 0,
    });
  }, []);

  // Transition from focus to break
  const transitionToBreak = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'break',
      isRunning: true,
    }));
  }, []);

  // Complete break and either repeat or end
  const completeBreak = useCallback(() => {
    setState((prev) => {
      if (prev.config?.repeatCycles) {
        // Start a new focus cycle
        return {
          ...prev,
          phase: 'focus',
          focusTimeRemaining: (prev.config.focusDuration * 60),
          breakTimeRemaining: (prev.config.breakDuration * 60),
          isRunning: true,
          interruptionDuration: 0,
        };
      } else {
        // End the session
        return {
          phase: 'idle',
          config: null,
          focusTimeRemaining: 0,
          breakTimeRemaining: 0,
          isRunning: false,
          interruptionDuration: 0,
        };
      }
    });
  }, []);

  // Record interruption duration
  const addInterruptionDuration = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      interruptionDuration: prev.interruptionDuration + seconds,
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isRunning && state.phase !== 'idle') {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.phase === 'focus') {
            if (prev.focusTimeRemaining <= 1) {
              // Focus complete, transition to break
              setTimeout(() => transitionToBreak(), 0);
              return { ...prev, focusTimeRemaining: 0, isRunning: false };
            }
            return { ...prev, focusTimeRemaining: prev.focusTimeRemaining - 1 };
          } else if (prev.phase === 'break') {
            if (prev.breakTimeRemaining <= 1) {
              // Break complete
              setTimeout(() => completeBreak(), 0);
              return { ...prev, breakTimeRemaining: 0, isRunning: false };
            }
            return { ...prev, breakTimeRemaining: prev.breakTimeRemaining - 1 };
          }
          return prev;
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
  }, [state.isRunning, state.phase, transitionToBreak, completeBreak]);

  return {
    phase: state.phase,
    config: state.config,
    focusTimeRemaining: state.focusTimeRemaining,
    breakTimeRemaining: state.breakTimeRemaining,
    isRunning: state.isRunning,
    interruptionDuration: state.interruptionDuration,
    startSession,
    pause,
    resume,
    endSession,
    addInterruptionDuration,
  };
}
