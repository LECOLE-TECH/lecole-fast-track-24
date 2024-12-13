import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SyncIndicatorProps {
  status: 'online' | 'offline' | 'syncing';
  lastSyncTime: number | null;
  onSyncClick: () => void;
  isSyncing: boolean;
}

export function SyncIndicator({ status, lastSyncTime, onSyncClick, isSyncing }: SyncIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSyncTime) {
        setTimeAgo("Never synced");
        return;
      }

      const seconds = Math.floor((Date.now() - lastSyncTime) / 1000);
      if (seconds < 60) setTimeAgo("Just now");
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status === 'online' && "bg-green-500",
            status === 'offline' && "bg-red-500",
            status === 'syncing' && "bg-yellow-500 animate-pulse"
          )}
        />
        <span>{timeAgo}</span>
      </div>
      <Button 
        onClick={onSyncClick} 
        disabled={isSyncing}
        variant={status === 'offline' ? "destructive" : "default"}
      >
        {isSyncing ? "Syncing..." : "Sync Now"}
      </Button>
    </div>
  );
} 