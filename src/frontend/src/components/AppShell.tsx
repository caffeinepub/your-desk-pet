import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, BarChart3 } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  loginButton: ReactNode;
  onNavigateToProgress: () => void;
  onNavigateToSetup: () => void;
  currentScreen: string;
}

export default function AppShell({
  children,
  loginButton,
  onNavigateToProgress,
  onNavigateToSetup,
  currentScreen
}: AppShellProps) {
  const isHomeScreen = currentScreen === 'setup';

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative">
      {/* Playground background - only visible on home/setup screen */}
      {isHomeScreen && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20"
            style={{ 
              backgroundImage: 'url(/assets/generated/playground-landscape-bg.dim_1920x1080.png)',
              imageRendering: 'pixelated'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/60 dark:via-neutral-900/40 dark:to-neutral-900/60" />
        </div>
      )}

      <header className="border-b border-amber-200/50 bg-white/80 backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-800/80 relative z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              🐾 Your Desk Pet
            </h1>
            <nav className="flex gap-2">
              <Button
                variant={currentScreen === 'setup' || currentScreen === 'focus' || currentScreen === 'break' ? 'default' : 'ghost'}
                size="sm"
                onClick={onNavigateToSetup}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button
                variant={currentScreen === 'progress' ? 'default' : 'ghost'}
                size="sm"
                onClick={onNavigateToProgress}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Progress
              </Button>
            </nav>
          </div>
          {loginButton}
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 relative z-10">
        {children}
      </main>

      <footer className="border-t border-amber-200/50 bg-white/80 backdrop-blur-sm py-6 dark:border-neutral-700/50 dark:bg-neutral-800/80 relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
