import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserSettings } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ReactNode } from 'react';

interface DistractedCheckInDialogProps {
  onCheckIn: (platform: string) => void;
  trigger: ReactNode;
}

export default function DistractedCheckInDialog({ onCheckIn, trigger }: DistractedCheckInDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const { identity } = useInternetIdentity();
  const { data: settings } = useGetUserSettings();

  const defaultPlatforms = ['YouTube', 'Twitter', 'Reddit', 'Instagram', 'TikTok', 'Other'];
  
  // Use saved platforms if logged in and available, otherwise use defaults
  const platforms = (identity && settings?.wastedPlatforms && settings.wastedPlatforms.length > 0) 
    ? settings.wastedPlatforms 
    : defaultPlatforms;

  const handleSubmit = () => {
    if (selectedPlatform) {
      onCheckIn(selectedPlatform);
      setOpen(false);
      setSelectedPlatform('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What distracted you?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={!selectedPlatform} className="w-full">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
