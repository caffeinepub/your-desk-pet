export interface SessionConfig {
  petType: 'cat' | 'dog';
  focusDuration: number;
  breakDuration: number;
  repeatCycles: boolean;
  tasks: string[];
}

export type SessionPhase = 'setup' | 'focus' | 'break';
