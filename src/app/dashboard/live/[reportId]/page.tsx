"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Video, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function LiveStreamPage({ params }: { params: { reportId: string } }) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const resolvedParams = use(params);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Video />
            Live Eye Witness Stream
          </CardTitle>
          <CardDescription>
            You are broadcasting a live video feed for report #{resolvedParams.reportId.substring(0, 7)}. The crisis management team can now see what you see.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full aspect-video bg-black rounded-md relative overflow-hidden">
             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
             {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold">Camera Access Required</h3>
                    <p className="text-center">Please allow camera access in your browser to start streaming.</p>
                </div>
             )}
              {hasCameraPermission === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <p>Requesting camera permission...</p>
                </div>
             )}
          </div>
          
           <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Safety Notice</AlertTitle>
              <AlertDescription>
                Only stream if it is safe to do so. Do not put yourself in danger. Your safety is the top priority.
              </AlertDescription>
           </Alert>

           <Button asChild size="lg" className="w-full">
                <Link href="/dashboard/my-reports">
                    Stop Streaming & Go Back
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
