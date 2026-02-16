import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserSettings } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SessionConfig } from '../state/sessionTypes';
import { Cat, Dog } from 'lucide-react';

interface SessionSetupScreenProps {
  onStartSession: (config: SessionConfig) => void;
}

export default function SessionSetupScreen({ onStartSession }: SessionSetupScreenProps) {
  const { identity } = useInternetIdentity();
  const { data: settings } = useGetUserSettings();
  
  const [petType, setPetType] = useState<'cat' | 'dog'>('cat');
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [repeatCycles, setRepeatCycles] = useState(false);
  const [tasks, setTasks] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize from saved settings when logged in
  useEffect(() => {
    if (identity && settings && !hasInitialized) {
      setFocusDuration(Number(settings.focusDuration));
      setBreakDuration(Number(settings.breakDuration));
      
      // Set pet type from settings
      if (settings.petType.__kind__ === 'cat') {
        setPetType('cat');
      } else if (settings.petType.__kind__ === 'dog') {
        setPetType('dog');
      }
      
      setHasInitialized(true);
    }
  }, [identity, settings, hasInitialized]);

  // Reset initialization flag when logging out
  useEffect(() => {
    if (!identity) {
      setHasInitialized(false);
    }
  }, [identity]);

  const handleStart = () => {
    const taskList = tasks
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onStartSession({
      petType,
      focusDuration,
      breakDuration,
      repeatCycles,
      tasks: taskList
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-2 border-amber-200 bg-white/95 shadow-lg dark:border-amber-800 dark:bg-neutral-800/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl text-amber-900 dark:text-amber-100">
            Start Your Focus Session
          </CardTitle>
          <CardDescription>
            Choose your companion and set your focus time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Choose Your Pet</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPetType('cat')}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  petType === 'cat'
                    ? 'border-amber-500 bg-amber-50 shadow-md dark:border-amber-600 dark:bg-amber-950/30'
                    : 'border-amber-200 bg-white hover:border-amber-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600'
                }`}
              >
                <Cat className="h-12 w-12 text-amber-700 dark:text-amber-400" />
                <div className="text-center">
                  <div className="font-semibold">Cat</div>
                  <div className="text-xs text-muted-foreground">Judgmental & Sarcastic</div>
                </div>
              </button>
              <button
                onClick={() => setPetType('dog')}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  petType === 'dog'
                    ? 'border-amber-500 bg-amber-50 shadow-md dark:border-amber-600 dark:bg-amber-950/30'
                    : 'border-amber-200 bg-white hover:border-amber-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600'
                }`}
              >
                <Dog className="h-12 w-12 text-amber-700 dark:text-amber-400" />
                <div className="text-center">
                  <div className="font-semibold">Dog</div>
                  <div className="text-xs text-muted-foreground">Loyal & Supportive</div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="focus">Focus Duration (minutes)</Label>
              <Input
                id="focus"
                type="number"
                min="1"
                max="180"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break">Break Duration (minutes)</Label>
              <Input
                id="break"
                type="number"
                min="1"
                max="60"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <div className="space-y-0.5">
              <Label htmlFor="repeat" className="text-base">Repeat Cycles</Label>
              <div className="text-sm text-muted-foreground">
                Automatically start a new focus session after break
              </div>
            </div>
            <Switch
              id="repeat"
              checked={repeatCycles}
              onCheckedChange={setRepeatCycles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks (Optional)</Label>
            <Textarea
              id="tasks"
              placeholder="Enter your tasks, one per line..."
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleStart}
            size="lg"
            className="w-full text-lg"
          >
            Start Focus Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
