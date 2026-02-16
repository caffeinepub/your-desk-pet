export type MoodTier = 'calm' | 'annoyed' | 'anxious' | 'judging' | 'desperate' | 'furious' | 'happy';

export interface MoodConfig {
  tier: MoodTier;
  threshold: number; // seconds of interruption to reach this tier
}

export const catMoodTiers: MoodConfig[] = [
  { tier: 'calm', threshold: 0 },
  { tier: 'annoyed', threshold: 60 },
  { tier: 'judging', threshold: 180 },
  { tier: 'furious', threshold: 300 }
];

export const dogMoodTiers: MoodConfig[] = [
  { tier: 'calm', threshold: 0 },
  { tier: 'anxious', threshold: 60 },
  { tier: 'desperate', threshold: 180 },
  { tier: 'furious', threshold: 300 }
];

export function getMoodTier(petType: 'cat' | 'dog', interruptionDuration: number): MoodTier {
  const tiers = petType === 'cat' ? catMoodTiers : dogMoodTiers;
  
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (interruptionDuration >= tiers[i].threshold) {
      return tiers[i].tier;
    }
  }
  
  return 'calm';
}
