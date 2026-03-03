
"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AllReportTypes, ReportPriority, reportCategories, type ReportCategory, type ReportType } from '@/lib/types';
import { useTranslation } from '@/context/LocalizationContext';
import { geofenceAndRouteReport } from '@/ai/flows/geofence-and-route-reports';
import { categorizeAndPrioritizeReport } from '@/ai/flows/categorize-and-prioritize-report';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Loader2, Sparkles, WifiOff, Camera, X, LocateFixed } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LocationMap } from '@/components/shared/LocationMap';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { submitReport } from '@/actions/reports';

const reportSchema = z.object({
  category: z.custom<ReportCategory>(val => typeof val === 'string' && val, {
      required_error: "Please select a category."
  }),
  type: z.custom<ReportType>(val => AllReportTypes.includes(val as ReportType), {
    required_error: "Please select a report type."
  }),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  media: z.any().optional(),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

type AiSuggestion = {
    priority: ReportPriority;
    reasoning: string;
}

export default function NewReportPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const [isCategorizing, setIsCategorizing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: '',
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });

  const selectedCategory = form.watch('category');
  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
          toast({
            title: "Location Detected",
            description: "Your current location has been filled in.",
          });
          setIsLocating(false);
        },
        () => {
          toast({
            title: "Location Error",
            description: "Could not auto-detect location. Please grant permission or enter it manually.",
            variant: "destructive",
          });
          setIsLocating(false);
        }
      );
    } else {
        toast({
            title: "Geolocation Not Supported",
            description: "Your browser does not support geolocation.",
            variant: "destructive",
        });
    }
  };

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    handleOnlineStatus();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
        },
        (error) => {
          console.error("Silent geolocation on load failed:", error.message);
        }
      );
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setFilePreview(null);
    }
  }
  
  const handleAutoCategorize = async () => {
    const description = form.getValues('description');
    if (description.length < 10) {
        form.setError('description', { type: 'manual', message: 'Please enter a longer description before auto-categorizing.' });
        return;
    }
    
    setIsCategorizing(true);
    setAiSuggestion(null);

    try {
        const result = await categorizeAndPrioritizeReport({
            description,
            mediaDataUri: filePreview || undefined,
        });

        const category = Object.keys(reportCategories).find(cat => 
            (reportCategories[cat as ReportCategory] as readonly ReportType[]).includes(result.category)
        ) as ReportCategory | undefined;

        if(category) {
            form.setValue('category', category);
            form.setValue('type', result.category);
        } else {
            form.setValue('category', 'Other');
            form.setValue('type', 'Other');
        }

        setAiSuggestion({ priority: result.priority, reasoning: result.reasoning });

    } catch (error) {
        console.error(error);
        toast({ title: "AI Categorization Failed", description: "Could not automatically categorize the report. Please select a category manually.", variant: "destructive"})
    } finally {
        setIsCategorizing(false);
    }
  }

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        toast({
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
          variant: "destructive",
        });
        setIsCameraOpen(false);
      }
    };

    if (isCameraOpen) {
      startCamera();
    }
    
    return () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };
  }, [isCameraOpen, toast]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setFilePreview(dataUri);
        form.setValue('media', null);
      }
      setIsCameraOpen(false);
    }
  };

  const clearMedia = () => {
    setFilePreview(null);
    form.setValue('media', null);
  };


  const onSubmit = async (data: ReportFormValues) => {
    if (!isOnline) {
        const offlineReports = JSON.parse(localStorage.getItem('offlineReports') || '[]');
        const newReport = { ...data, id: `offline-${Date.now()}`, aiSuggestion, filePreview };
        offlineReports.push(newReport);
        localStorage.setItem('offlineReports', JSON.stringify(offlineReports));
        
        toast({
            title: "You are offline",
            description: "Your report has been saved and will be submitted automatically when you're back online.",
            variant: "default",
        });
        
        router.push('/dashboard/my-reports');
        return;
    }

    try {
      // First, use AI to route the report
      const aiRoute = await geofenceAndRouteReport({
        reportId: `temp-${Date.now()}`,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      // Submit to MySQL
      await submitReport({
        type: data.type,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        priority: aiSuggestion?.priority || ReportPriority.Medium
      });
      
      toast({
        title: "Report Submitted Successfully",
        description: `Your report has been saved to the database. Priority: ${aiSuggestion?.priority || 'Medium'}`,
        variant: 'default',
      });

      router.push('/dashboard/my-reports');
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: t('citizen.newReport.error.submit'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('citizen.newReport.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('citizen.newReport.title')}</CardTitle>
          <CardDescription>{t('citizen.newReport.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('citizen.newReport.descriptionLabel')}</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder={t('citizen.newReport.descriptionPlaceholder')}
                                className="resize-none"
                                {...field}
                                rows={5}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <div className="space-y-2">
                        <FormLabel>{t('citizen.newReport.mediaLabel')}</FormLabel>
                        {filePreview ? (
                            <div className="relative w-fit rounded-md border p-2 bg-muted/50">
                                <Image src={filePreview} alt="Report preview" width={200} height={200} className="rounded-md object-cover aspect-square" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md"
                                    onClick={clearMedia}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <FormField
                                    control={form.control}
                                    name="media"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="cursor-pointer"
                                                    onChange={(e) => {
                                                        onChange(e.target.files);
                                                        handleFileChange(e);
                                                    }}
                                                    {...rest}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            <Camera className="mr-2 h-4 w-4" />
                                            {t('citizen.newReport.takePicture')}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t('citizen.newReport.takePictureDialog.title')}</DialogTitle>
                                        </DialogHeader>
                                        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setIsCameraOpen(false)}>{t('citizen.newReport.takePictureDialog.cancel')}</Button>
                                            <Button type="button" onClick={handleCapture}>{t('citizen.newReport.takePictureDialog.capture')}</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                        <FormDescription>
                            {t('citizen.newReport.mediaDescription')}
                        </FormDescription>
                    </div>

                    <div className="space-y-4">
                        <Button type="button" onClick={handleAutoCategorize} disabled={isCategorizing}>
                            {isCategorizing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            {t('citizen.newReport.aiCategorizeButton')}
                        </Button>

                        {aiSuggestion && (
                            <Alert>
                            <Sparkles className="h-4 w-4" />
                            <AlertTitle className='font-semibold'>{t('citizen.newReport.aiSuggestionTitle')}</AlertTitle>
                            <AlertDescription>
                                {t('citizen.newReport.aiSuggestionDescription', { priority: aiSuggestion.priority, reasoning: aiSuggestion.reasoning })}
                            </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('citizen.newReport.categoryLabel')}</FormLabel>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    form.resetField('type');
                                }} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder={t('citizen.newReport.categoryPlaceholder')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.keys(reportCategories).map(category => (
                                        <SelectItem key={category} value={category}>{t(`reportCategories.${category.replace(/\s/g, '')}`)}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('citizen.newReport.typeLabel')}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder={t('citizen.newReport.typePlaceholder')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {selectedCategory && reportCategories[selectedCategory].map(type => (
                                        <SelectItem key={type} value={type}>{t(`reportTypes.${type.replace(/\s/g, '')}`)}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormDescription>
                                    {t('citizen.newReport.typeDescription')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">{t('citizen.newReport.locationLabel')}</h3>
                        <Button type="button" variant="outline" size="sm" onClick={handleAutoDetectLocation} disabled={isLocating}>
                             {isLocating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LocateFixed className="mr-2 h-4 w-4" />
                            )}
                            {isLocating ? t('citizen.newReport.locating') : t('citizen.newReport.autoDetect')}
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('citizen.newReport.latitudeLabel')}</FormLabel>
                            <FormControl>
                            <Input type="number" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('citizen.newReport.longitudeLabel')}</FormLabel>
                            <FormControl>
                            <Input type="number" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                     <LocationMap latitude={latitude} longitude={longitude} title={t('components.locationMap.preview')} />
                </div>
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {!isOnline && <WifiOff className="mr-2 h-4 w-4" />}
                {form.formState.isSubmitting ? t('citizen.newReport.submitting') : (isOnline ? t('citizen.newReport.submitButton') : t('citizen.newReport.queueReport'))}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
