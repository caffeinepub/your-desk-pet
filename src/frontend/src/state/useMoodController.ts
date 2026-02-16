import { useState, useEffect } from 'react';
import { MoodTier, getMoodTier } from './mood';

export function useMoodController(
  petType: 'cat' | 'dog',
  interruptionDuration: number,
  isActive: boolean
) {
  const [currentMood, setCurrentMood] = useState<MoodTier>('calm');

  useEffect(() => {
    if (isActive) {
      const newMood = getMoodTier(petType, interruptionDuration);
      setCurrentMood(newMood);
    }
  }, [petType, interruptionDuration, isActive]);

  return {
    currentMood
  };
}
