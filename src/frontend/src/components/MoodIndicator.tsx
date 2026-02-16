import { MoodTier } from '../state/mood';
import { Badge } from '@/components/ui/badge';

interface MoodIndicatorProps {
  mood: MoodTier;
  petType: 'cat' | 'dog';
}

export default function MoodIndicator({ mood, petType }: MoodIndicatorProps) {
  const getMoodColor = () => {
    switch (mood) {
      case 'calm':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100';
      case 'annoyed':
      case 'anxious':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100';
      case 'judging':
      case 'desperate':
        return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-100';
      case 'furious':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100';
      case 'happy':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getMoodLabel = () => {
    if (petType === 'cat') {
      switch (mood) {
        case 'calm': return 'Calm';
        case 'annoyed': return 'Annoyed';
        case 'judging': return 'Judging';
        case 'furious': return 'Furious';
        case 'happy': return 'Happy';
        default: return mood;
      }
    } else {
      switch (mood) {
        case 'calm': return 'Calm';
        case 'anxious': return 'Anxious';
        case 'desperate': return 'Desperate';
        case 'furious': return 'Furious';
        case 'happy': return 'Happy';
        default: return mood;
      }
    }
  };

  return (
    <Badge variant="outline" className={`${getMoodColor()} border-2`}>
      {getMoodLabel()}
    </Badge>
  );
}
