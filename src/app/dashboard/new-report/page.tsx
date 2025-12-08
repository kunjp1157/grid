"use client";

import { useForm, Controller } from 'react-hook-form';
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
import { zones } from '@/lib/data';
import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

type ReportFormValues = z.infer<typeof reportSchema>;

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

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: '',
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });

  const selectedCategory = form.watch('category');

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
            // Fallback if category not found
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


  const onSubmit = async (data: ReportFormValues) => {
    try {
      // Simulate report creation
      const reportId = `report-${Date.now()}`;
      
      // Call GenAI flow for geofencing
      const result = await geofenceAndRouteReport({
        reportId: reportId,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      const zoneName = result.assignedZoneId ? zones.find(z => z.id === result.assignedZoneId)?.name : 'N/A';

      console.log('Geofencing result:', result);
      
      toast({
        title: "Report Submitted Successfully",
        description: `Your report has been routed to ${zoneName || 'the appropriate department'}. Priority: ${aiSuggestion?.priority || 'Not set'}`,
        variant: 'default',
      });

      // In a real app, you would save the report to the database
      // and redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: t('citizen.newReport.error'),
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
              
              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('citizen.newReport.mediaLabel')}</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => {
                            field.onChange(e.target.files);
                            handleFileChange(e);
                        }} />
                    </FormControl>
                    <FormDescription>
                      Upload a photo of the issue (optional, helps with auto-categorization).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button type="button" onClick={handleAutoCategorize} disabled={isCategorizing}>
                    {isCategorizing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Auto-Categorize & Prioritize
                </Button>

                 {aiSuggestion && (
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle className='font-semibold'>AI Suggestion</AlertTitle>
                      <AlertDescription>
                        Priority set to <span className='font-semibold'>{aiSuggestion.priority}</span>. Reason: {aiSuggestion.reasoning}
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
                            Select a category first.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>


              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('citizen.newReport.locationLabel')}</h3>
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
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : t('citizen.newReport.submitButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
