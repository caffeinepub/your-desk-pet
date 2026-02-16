interface RewardActionsBarProps {
  onAction: (action: 'feed' | 'groom' | 'pet' | 'play') => void;
}

export default function RewardActionsBar({ onAction }: RewardActionsBarProps) {
  const actions = [
    { id: 'feed' as const, icon: '/assets/generated/food-bowl.dim_128x128.png', label: 'Feed' },
    { id: 'groom' as const, icon: '/assets/generated/groom-brush.dim_128x128.png', label: 'Groom' },
    { id: 'pet' as const, icon: '/assets/generated/pet-hand.dim_128x128.png', label: 'Pet' },
    { id: 'play' as const, icon: '/assets/generated/play-ball.dim_128x128.png', label: 'Play' }
  ];

  return (
    <div className="flex justify-center gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="group flex flex-col items-center gap-2 rounded-xl border-2 border-green-200 bg-white p-4 transition-all hover:border-green-400 hover:shadow-md dark:border-green-800 dark:bg-neutral-800 dark:hover:border-green-600"
        >
          <img
            src={action.icon}
            alt={action.label}
            className="h-16 w-16 object-contain transition-transform group-hover:scale-110"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
