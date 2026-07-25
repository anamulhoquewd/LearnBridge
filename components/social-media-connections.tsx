'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  // Instagram,
  // Twitter,
  // Facebook,
  Music,
  // Linkedin,
  // Github,
  // Youtube,
  Mail,
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}

const SOCIAL_PLATFORMS: Omit<SocialPlatform, 'connected'>[] = [
  { id: 'instagram', name: 'Instagram', icon: <Music className="h-5 w-5" /> },
  { id: 'twitter', name: 'Twitter / X', icon: <Music className="h-5 w-5" /> },
  { id: 'facebook', name: 'Facebook', icon: <Music className="h-5 w-5" /> },
  { id: 'tiktok', name: 'TikTok', icon: <Music className="h-5 w-5" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Music className="h-5 w-5" /> },
  { id: 'github', name: 'GitHub', icon: <Music className="h-5 w-5" /> },
  { id: 'youtube', name: 'YouTube', icon: <Music className="h-5 w-5" /> },
  { id: 'email', name: 'Email', icon: <Mail className="h-5 w-5" /> },
];

export function SocialMediaConnections() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(
    SOCIAL_PLATFORMS.map((p) => ({ ...p, connected: false }))
  );
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleConnection = async (platformId: string) => {
    setLoading(platformId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId ? { ...p, connected: !p.connected } : p
      )
    );

    setLoading(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Social Media Connections</h3>
        <p className="text-sm text-muted-foreground">
          Connect your social media accounts to integrate with your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">{platform.icon}</div>
              <div>
                <p className="font-medium text-sm">{platform.name}</p>
                <p className="text-xs text-muted-foreground">
                  {platform.connected ? (
                    <span className="text-green-600">Connected</span>
                  ) : (
                    <span>Not connected</span>
                  )}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant={platform.connected ? 'outline' : 'default'}
              onClick={() => handleToggleConnection(platform.id)}
              disabled={loading === platform.id}
              className={
                loading === platform.id ? 'opacity-70' : ''
              }
            >
              {loading === platform.id ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : platform.connected ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
