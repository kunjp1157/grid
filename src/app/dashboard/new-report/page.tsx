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
import { ReportType } from '@/lib/types';
import { useTranslation } from '@/context/LocalizationContext';
import { geofenceAndRouteReport } from '@/ai/flows/geofence-and-route-reports';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { zones } from '@/lib/data';

const reportSchema = z.object({
  type: z.nativeEnum(ReportType),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  media: z.any().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function NewReportPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: '',
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });

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
        description: `Your report has been routed to ${zoneName || 'the appropriate department'}.`,
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('citizen.newReport.typeLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('citizen.newReport.typePlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ReportType).map(type => (
                          <SelectItem key={type} value={type}>{t(`reportTypes.${type.replace(/\s/g, '')}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('citizen.newReport.mediaLabel')}</FormLabel>
                    <FormControl>
                        <Input type="file" {...field} />
                    </FormControl>
                    <FormDescription>
                      Upload a photo or video of the issue (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
