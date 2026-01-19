
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video } from "lucide-react";
import { useTranslation } from "@/context/LocalizationContext";

interface LiveStreamViewerProps {
  reportId: string;
}

// In a real app, this would connect to a WebRTC service to receive the stream.
// For this simulation, we'll just display a placeholder.
export function LiveStreamViewer({ reportId }: LiveStreamViewerProps) {
  const { t } = useTranslation();

  // We generate a "stream" URL based on the report ID. In a real app, this would
  // be a dynamic URL from a media server.
  const streamUrl = `/placeholder-streams/${reportId}.mp4`;

  return (
    <Card className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-red-900 dark:text-red-200">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          {t('components.liveStreamViewer.title')}
        </CardTitle>
        <CardDescription className="text-red-700 dark:text-red-300">
          {t('components.liveStreamViewer.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full bg-black rounded-md flex items-center justify-center text-muted-foreground">
           <p>{t('components.liveStreamViewer.placeholder', { reportId })}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{t('components.liveStreamViewer.note')}</p>
      </CardContent>
    </Card>
  );
}
