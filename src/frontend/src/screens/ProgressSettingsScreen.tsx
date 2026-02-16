import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSessions, useGetUserSettings, useSaveUserSettings } from '../hooks/useQueries';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BarChart3, Settings, Calendar } from 'lucide-react';

export default function ProgressSettingsScreen() {
  const { identity } = useInternetIdentity();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessions();
  const { data: settings, isLoading: settingsLoading } = useGetUserSettings();
  const saveSettings = useSaveUserSettings();

  const [defaultFocus, setDefaultFocus] = useState(25);
  const [defaultBreak, setDefaultBreak] = useState(5);
  const [platforms, setPlatforms] = useState('');
  const [petType, setPetType] = useState<'cat' | 'dog'>('cat');

  useEffect(() => {
    if (settings) {
      setDefaultFocus(Number(settings.focusDuration));
      setDefaultBreak(Number(settings.breakDuration));
      setPlatforms(settings.wastedPlatforms.join('\n'));
      
      // Extract pet type from settings
      if (settings.petType.__kind__ === 'cat') {
        setPetType('cat');
      } else if (settings.petType.__kind__ === 'dog') {
        setPetType('dog');
      }
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    if (!identity) {
      toast.error('Please login to save settings');
      return;
    }

    const platformList = platforms
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const petTypeVariant = petType === 'cat' 
      ? { __kind__: 'cat' as const, cat: null } 
      : { __kind__: 'dog' as const, dog: null };

    try {
      await saveSettings.mutateAsync({
        petType: petTypeVariant,
        focusDuration: BigInt(defaultFocus),
        breakDuration: BigInt(defaultBreak),
        wastedPlatforms: platformList,
        darkMode: settings?.darkMode || false
      });
      toast.success('Settings saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const totalSessions = sessions?.length || 0;
  const totalMinutes = sessions?.reduce((sum, s) => sum + Number(s.duration), 0) || 0;

  if (!identity) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Progress & Settings</CardTitle>
          <CardDescription>Please login to view your progress and settings</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">
            <BarChart3 className="mr-2 h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions}</div>
                <p className="text-xs text-muted-foreground">
                  Completed focus sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Focus Time</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMinutes} min</div>
                <p className="text-xs text-muted-foreground">
                  Time spent focusing
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest focus sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center text-muted-foreground">Loading...</div>
              ) : sessions && sessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Pet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.slice(0, 10).map((session, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{formatDate(session.timestamp)}</TableCell>
                        <TableCell>{Number(session.duration)} min</TableCell>
                        <TableCell className="capitalize">
                          {session.petType.__kind__}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground">
                  No sessions yet. Start your first focus session!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Settings</CardTitle>
              <CardDescription>
                Set your default focus and break durations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultFocus">Default Focus (minutes)</Label>
                  <Input
                    id="defaultFocus"
                    type="number"
                    min="1"
                    max="180"
                    value={defaultFocus}
                    onChange={(e) => setDefaultFocus(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultBreak">Default Break (minutes)</Label>
                  <Input
                    id="defaultBreak"
                    type="number"
                    min="1"
                    max="60"
                    value={defaultBreak}
                    onChange={(e) => setDefaultBreak(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platforms">Distraction Platforms</Label>
                <Textarea
                  id="platforms"
                  placeholder="Enter platforms, one per line..."
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  These platforms will appear in the "I got distracted" dialog
                </p>
              </div>

              <Button 
                onClick={handleSaveSettings} 
                disabled={saveSettings.isPending}
                className="w-full"
              >
                {saveSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
