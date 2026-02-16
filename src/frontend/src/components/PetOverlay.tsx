import { useState } from 'react';
import { MoodTier } from '../state/mood';
import SpeechBubble from './SpeechBubble';
import { getPetSprite } from './petSprites';
import { Volume2, VolumeX } from 'lucide-react';
import { usePointerFollow } from '../hooks/usePointerFollow';

interface PetOverlayProps {
  petType: 'cat' | 'dog';
  mood: MoodTier;
  dialogue: string;
  phase: 'focus' | 'reward';
}

export default function PetOverlay({ petType, mood, dialogue, phase }: PetOverlayProps) {
  const [isMuted, setIsMuted] = useState(false);
  const sprite = getPetSprite(petType, phase === 'reward' ? 'happy' : mood);

  // Follow pointer during active sessions
  const position = usePointerFollow({
    enabled: true,
    smoothing: 0.15,
    offset: { x: -64, y: -64 }, // Center the pet on pointer
    size: { width: 128, height: 180 }, // Account for speech bubble height
  });

  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '128px',
      }}
    >
      <div className="relative">
        {!isMuted && dialogue && (
          <div className="pointer-events-auto absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64">
            <SpeechBubble text={dialogue} />
          </div>
        )}

        <div className="pointer-events-auto relative h-32 w-32">
          {/* Single-frame sprite viewport */}
          <div
            className="h-32 w-32 overflow-hidden"
            style={{
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
          >
            <div
              className="h-32 w-[512px]"
              style={{
                backgroundImage: `url(${sprite.src})`,
                backgroundSize: '512px 128px',
                backgroundPosition: sprite.position,
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
              }}
            />
          </div>

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
