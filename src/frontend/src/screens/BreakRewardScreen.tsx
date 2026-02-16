import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SessionConfig } from '../state/sessionTypes';
import { getRewardReaction } from '../state/rewardReactions';
import { useAddSession } from '../hooks/useQueries';
import RewardActionsBar from '../components/RewardActionsBar';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Variant_creative_work_exercise_study_default } from '../backend';

interface BreakRewardScreenProps {
  config: SessionConfig;
  timeRemaining: number;
}

export default function BreakRewardScreen({ config, timeRemaining }: BreakRewardScreenProps) {
  const { identity } = useInternetIdentity();
  const sessionSavedRef = useRef(false);
  const addSession = useAddSession();

  useEffect(() => {
    // Save completed session once when entering break screen (only if logged in)
    if (!sessionSavedRef.current && identity) {
      const petTypeVariant = config.petType === 'cat' 
        ? { __kind__: 'cat' as const, cat: null } 
        : { __kind__: 'dog' as const, dog: null };
      
      addSession.mutate({
        petType: petTypeVariant,
        duration: BigInt(config.focusDuration),
        focusType: Variant_creative_work_exercise_study_default.default_,
        wasSuccessful: true
      }, {
        onSuccess: () => {
          console.log('Session saved successfully');
        },
        onError: (error) => {
          console.error('Failed to save session:', error);
        }
      });
      
      sessionSavedRef.current = true;
    }
  }, [identity, config, addSession]);

  // Reset the saved flag when config changes (new session started)
  useEffect(() => {
    sessionSavedRef.current = false;
  }, [config.focusDuration, config.breakDuration, config.petType]);

  const handleRewardAction = (action: 'feed' | 'groom' | 'pet' | 'play') => {
    const reaction = getRewardReaction(config.petType, action);
    toast.success(reaction);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="border-2 border-green-200 bg-white/90 p-8 text-center shadow-lg dark:border-green-800 dark:bg-neutral-800/90">
        <div className="mb-6">
          <h2 className="mb-2 text-3xl font-bold text-green-700 dark:text-green-400">
            Great Work! 🎉
          </h2>
          <p className="text-muted-foreground">
            You completed your focus session. Time for a break!
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Break Time Remaining</div>
          <div className="text-5xl font-bold tabular-nums text-green-700 dark:text-green-400">
            {formatTime(timeRemaining)}
          </div>
        </div>

        <RewardActionsBar onAction={handleRewardAction} />

        {config.repeatCycles && (
          <div className="mt-6 text-sm text-muted-foreground">
            Next focus session will start automatically after break
          </div>
        )}

        {!config.repeatCycles && (
          <div className="mt-6 text-sm text-muted-foreground">
            Session will end when break time is complete
          </div>
        )}
      </Card>
    </div>
  );
}
