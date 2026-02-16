import { useState, useEffect } from 'react';
import { MoodTier } from './mood';
import { getDialogue } from './dialogue';

export function useDialogueController(
  petType: 'cat' | 'dog',
  mood: MoodTier,
  phase: 'focus' | 'reward'
) {
  const [currentDialogue, setCurrentDialogue] = useState('');

  useEffect(() => {
    const dialogue = getDialogue(petType, mood);
    setCurrentDialogue(dialogue);

    // Update dialogue every 30 seconds during focus
    if (phase === 'focus') {
      const interval = setInterval(() => {
        const newDialogue = getDialogue(petType, mood);
        setCurrentDialogue(newDialogue);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [petType, mood, phase]);

  return {
    currentDialogue
  };
}
