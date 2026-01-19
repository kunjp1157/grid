
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Video, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { useTranslation } from '@/context/LocalizationContext';

export default function LiveStreamPage({ params }: { params: { reportId: string } }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Ref to hold the stream object
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const resolvedParams = use(params);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Store the stream in the ref
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('citizen.liveStream.error.cameraDeniedTitle'),
          description: t('citizen.liveStream.error.cameraDeniedDescription'),
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, t]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Video />
            {t('citizen.liveStream.title')}
          </CardTitle>
          <CardDescription>
            {t('citizen.liveStream.description', { id: resolvedParams.reportId.substring(0, 7)})}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full aspect-video bg-black rounded-md relative overflow-hidden">
             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
             {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold">{t('citizen.liveStream.cameraRequiredTitle')}</h3>
                    <p className="text-center">{t('citizen.liveStream.cameraRequiredDescription')}</p>
                </div>
             )}
              {hasCameraPermission === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <p>{t('citizen.liveStream.requestingPermission')}</p>
                </div>
             )}
          </div>
          
           <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('citizen.liveStream.safetyNoticeTitle')}</AlertTitle>
              <AlertDescription>
                {t('citizen.liveStream.safetyNoticeDescription')}
              </AlertDescription>
           </Alert>

           <Button asChild size="lg" className="w-full">
                <Link href="/dashboard/my-reports">
                    {t('citizen.liveStream.stopButton')}
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
