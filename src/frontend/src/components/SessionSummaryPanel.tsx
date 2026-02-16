import { SessionConfig } from '../state/sessionTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coffee, Repeat, ListTodo } from 'lucide-react';

interface SessionSummaryPanelProps {
  config: SessionConfig;
}

export default function SessionSummaryPanel({ config }: SessionSummaryPanelProps) {
  return (
    <Card className="border-2 border-amber-200 bg-white/90 dark:border-amber-800 dark:bg-neutral-800/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>Session Details</span>
          <Badge variant="outline">
            {config.petType === 'cat' ? '🐱 Cat' : '🐶 Dog'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Focus</div>
              <div className="font-semibold">{config.focusDuration} min</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Break</div>
              <div className="font-semibold">{config.breakDuration} min</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Repeat</div>
              <div className="font-semibold">{config.repeatCycles ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Tasks</div>
              <div className="font-semibold">{config.tasks.length}</div>
            </div>
          </div>
        </div>
        {config.tasks.length > 0 && (
          <div className="mt-4 space-y-1 border-t border-amber-200 pt-4 dark:border-amber-800">
            <div className="text-xs font-semibold text-muted-foreground">Your Tasks:</div>
            <ul className="space-y-1 text-sm">
              {config.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
