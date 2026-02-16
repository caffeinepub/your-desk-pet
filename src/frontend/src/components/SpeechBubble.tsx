import { Card } from '@/components/ui/card';

interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <Card className="relative border-2 border-amber-400 bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:border-amber-600 dark:bg-neutral-800/95">
      <p className="text-sm font-medium leading-relaxed text-neutral-900 dark:text-neutral-100">{text}</p>
      <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b-2 border-r-2 border-amber-400 bg-white/95 dark:border-amber-600 dark:bg-neutral-800/95" />
    </Card>
  );
}
