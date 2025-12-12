
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Siren, Mic, Radio, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { processSosAudio } from '@/ai/flows/process-sos-audio';
import { geofenceAndRouteReport } from '@/ai/flows/geofence-and-route-reports';
import { zones } from '@/lib/data';

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export default function SosPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePress = async () => {
    if (status !== 'idle' && status !== 'success' && status !== 'error') return;

    setStatus('recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings.',
        variant: 'destructive',
      });
      setStatus('error');
    }
  };

  const handleRelease = () => {
    if (status !== 'recording' || !mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
        setStatus('processing');
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Get user location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await processAndSubmitAudio(audioBlob, latitude, longitude);
            },
            async (error) => {
                console.error("Geolocation error:", error);
                // Fallback location if geolocation fails
                await processAndSubmitAudio(audioBlob, 28.6139, 77.2090);
            }
        );
    };

    mediaRecorderRef.current.stop();
  };

  const processAndSubmitAudio = async (audioBlob: Blob, latitude: number, longitude: number) => {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        try {
          const aiResult = await processSosAudio({ audioDataUri: base64Audio });
          console.log("AI SOS Result:", aiResult);

          const reportId = `report-${Date.now()}`;
          const geofenceResult = await geofenceAndRouteReport({
            reportId,
            latitude,
            longitude,
          });
          const zoneName = geofenceResult.assignedZoneId ? zones.find(z => z.id === geofenceResult.assignedZoneId)?.name : 'N/A';
          
          setStatus('success');
          toast({
            title: 'SOS Report Submitted!',
            description: `Emergency report for "${aiResult.description}" (Priority: ${aiResult.priority}) routed to ${zoneName}. Help is on the way.`,
            duration: 10000,
          });

        } catch (err) {
          console.error("Error processing audio:", err);
          setStatus('error');
          toast({
            title: 'AI Processing Failed',
            description: 'Could not understand the audio. Please try again or submit a manual report.',
            variant: 'destructive',
          });
        }
      };
  }

  const getButtonContent = () => {
    switch(status) {
        case 'recording': return <><Radio className="mr-2 h-4 w-4 animate-pulse text-red-400" /> Recording...</>;
        case 'processing': return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>;
        case 'success': return <><CheckCircle className="mr-2 h-4 w-4" /> Submitted!</>;
        case 'error': return 'Error! Try Again';
        default: return 'Press & Hold to Record SOS';
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Siren />
            Voice-Activated Panic Mode
          </CardTitle>
          <CardDescription>
            In a critical emergency where you cannot type, press and hold the SOS button below to record your situation. Release to automatically send a report.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-8 py-16">
          <Button
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
            disabled={status === 'processing'}
            className={cn(
              "h-32 w-32 rounded-full text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all duration-300 transform active:scale-95 shadow-2xl flex-col",
              status === 'recording' && 'bg-red-800 scale-95',
              status === 'success' && 'bg-green-600',
              status === 'processing' && 'bg-gray-500'
            )}
          >
            <Mic className="h-12 w-12" />
          </Button>

          <p className="text-lg font-semibold text-center">
            {getButtonContent()}
          </p>

           <Alert variant="destructive" className="max-w-md">
              <Siren className="h-4 w-4" />
              <AlertTitle>For Emergency Use Only</AlertTitle>
              <AlertDescription>
                This feature dispatches an immediate high-priority alert. Misuse may result in penalties.
              </AlertDescription>
           </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
