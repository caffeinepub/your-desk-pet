import { SessionConfig } from '../state/sessionTypes';
import { useBehaviorMonitoring } from '../state/useBehaviorMonitoring';
import SessionSummaryPanel from '../components/SessionSummaryPanel';
import DistractedCheckInDialog from '../components/DistractedCheckInDialog';
import { Button } from '@/components/ui/button';
import { Pause, Play, X, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActiveSessionScreenProps {
  config: SessionConfig;
  timeRemaining: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onEndSession: () => void;
  onRecordInterruption: (seconds: number) => void;
}

export default function ActiveSessionScreen({
  config,
  timeRemaining,
  isRunning,
  onPause,
  onResume,
  onEndSession,
  onRecordInterruption,
}: ActiveSessionScreenProps) {
  const monitoring = useBehaviorMonitoring(isRunning);

  const handleManualInterruption = (platform: string) => {
    // Record a 60-second interruption for manual check-ins
    onRecordInterruption(60);
    monitoring.recordManualInterruption(platform);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SessionSummaryPanel config={config} />

      <Card className="border-2 border-amber-200 bg-white/90 p-8 text-center shadow-lg dark:border-amber-800 dark:bg-neutral-800/90">
        <div className="mb-8">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Time Remaining</div>
          <div className="text-7xl font-bold tabular-nums text-amber-900 dark:text-amber-100">
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <Button
            onClick={isRunning ? onPause : onResume}
            size="lg"
            variant="outline"
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Resume
              </>
            )}
          </Button>
          <Button
            onClick={onEndSession}
            size="lg"
            variant="destructive"
          >
            <X className="mr-2 h-5 w-5" />
            End Session
          </Button>
        </div>

        <DistractedCheckInDialog
          onCheckIn={handleManualInterruption}
          trigger={
            <Button variant="ghost" size="sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              I got distracted
            </Button>
          }
        />
      </Card>
    </div>
  );
}
