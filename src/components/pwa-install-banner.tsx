'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// This interface is a subset of the actual BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      // Check if the app is already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
      }
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User dismissed the PWA installation');
    }
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const handleDismissClick = () => {
    setIsVisible(false);
  };

  if (!isVisible || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-lg animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Установить приложение</h3>
            <p className="text-sm text-muted-foreground">Получите быстрый доступ с главного экрана.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleInstallClick}>
            Установить
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDismissClick}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
