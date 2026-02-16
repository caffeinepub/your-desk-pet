import { useState } from 'react';
import { MoodTier } from '../state/mood';
import SpeechBubble from './SpeechBubble';
import { getPetSprite } from './petSprites';
import { Volume2, VolumeX } from 'lucide-react';

interface PetOverlayProps {
  petType: 'cat' | 'dog';
  mood: MoodTier;
  dialogue: string;
  phase: 'focus' | 'reward';
}

export default function PetOverlay({ petType, mood, dialogue, phase }: PetOverlayProps) {
  const [isMuted, setIsMuted] = useState(false);
  const sprite = getPetSprite(petType, phase === 'reward' ? 'happy' : mood);

  return (
    <div className="pointer-events-none fixed bottom-8 right-8 z-50">
      <div className="relative">
        {!isMuted && dialogue && (
          <div className="pointer-events-auto absolute bottom-full right-0 mb-4 w-64">
            <SpeechBubble text={dialogue} />
          </div>
        )}

        <div className="pointer-events-auto relative">
          <img
            src={sprite.src}
            alt={`${petType} ${mood}`}
            className="h-32 w-32 object-contain pixel-art drop-shadow-2xl"
            style={{
              imageRendering: 'pixelated',
              objectPosition: sprite.position,
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
          />

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute -right-2 -top-2 rounded-full bg-amber-500/90 p-1.5 text-white shadow-lg transition-all hover:bg-amber-600 hover:scale-110 dark:bg-amber-600/90 dark:hover:bg-amber-700"
            title={isMuted ? 'Unmute dialogue' : 'Mute dialogue'}
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
