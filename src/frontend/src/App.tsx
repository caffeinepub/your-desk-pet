import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/AppShell';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import SessionSetupScreen from './screens/SessionSetupScreen';
import ActiveSessionScreen from './screens/ActiveSessionScreen';
import BreakRewardScreen from './screens/BreakRewardScreen';
import ProgressSettingsScreen from './screens/ProgressSettingsScreen';
import PetOverlay from './components/PetOverlay';
import { SessionConfig } from './state/sessionTypes';
import { useSessionController } from './state/useSessionController';
import { useMoodController } from './state/useMoodController';
import { useDialogueController } from './state/useDialogueController';

type AppScreen = 'setup' | 'focus' | 'break' | 'progress';

function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('setup');
  
  const sessionController = useSessionController();
  const mood = useMoodController(
    sessionController.config?.petType || 'cat',
    sessionController.interruptionDuration,
    sessionController.isRunning && sessionController.phase === 'focus'
  );
  const dialogue = useDialogueController(
    sessionController.config?.petType || 'cat',
    sessionController.phase === 'break' ? 'happy' : mood.currentMood,
    sessionController.phase === 'break' ? 'reward' : 'focus'
  );

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 text-2xl">🐾</div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const handleStartSession = (config: SessionConfig) => {
    sessionController.startSession(config);
    setCurrentScreen('focus');
  };

  const handleEndSession = () => {
    sessionController.endSession();
    setCurrentScreen('setup');
  };

  const handleNavigateToProgress = () => {
    setCurrentScreen('progress');
  };

  const handleNavigateToSetup = () => {
    // Only end session if explicitly navigating to setup and not in an active session
    if (sessionController.phase === 'idle') {
      setCurrentScreen('setup');
    } else {
      // Allow navigation but keep session active
      setCurrentScreen('setup');
    }
  };

  // Auto-navigate to break screen when phase changes to break
  if (sessionController.phase === 'break' && currentScreen !== 'break') {
    setCurrentScreen('break');
  }

  // Auto-navigate to setup when session ends (phase becomes idle)
  if (sessionController.phase === 'idle' && currentScreen !== 'setup' && currentScreen !== 'progress') {
    setCurrentScreen('setup');
  }

  const showPetOverlay = sessionController.phase !== 'idle' && sessionController.config;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppShell
        loginButton={<LoginButton />}
        onNavigateToProgress={handleNavigateToProgress}
        onNavigateToSetup={handleNavigateToSetup}
        currentScreen={currentScreen}
      >
        {showProfileSetup && <ProfileSetupDialog />}

        {currentScreen === 'setup' && (
          <SessionSetupScreen onStartSession={handleStartSession} />
        )}

        {currentScreen === 'focus' && sessionController.config && (
          <ActiveSessionScreen
            config={sessionController.config}
            timeRemaining={sessionController.focusTimeRemaining}
            isRunning={sessionController.isRunning}
            onPause={sessionController.pause}
            onResume={sessionController.resume}
            onEndSession={handleEndSession}
            onRecordInterruption={sessionController.addInterruptionDuration}
          />
        )}

        {currentScreen === 'break' && sessionController.config && (
          <BreakRewardScreen
            config={sessionController.config}
            timeRemaining={sessionController.breakTimeRemaining}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressSettingsScreen />
        )}
      </AppShell>

      {showPetOverlay && (
        <PetOverlay
          petType={sessionController.config!.petType}
          mood={sessionController.phase === 'break' ? 'happy' : mood.currentMood}
          dialogue={dialogue.currentDialogue}
          phase={sessionController.phase === 'break' ? 'reward' : 'focus'}
        />
      )}

      <Toaster />
    </ThemeProvider>
  );
}

export default App;
