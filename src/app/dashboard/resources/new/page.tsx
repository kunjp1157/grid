
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AllResourceTypes, type ResourceType, type CommunityResource, type User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/LocalizationContext';

const resourceSchema = z.object({
  type: z.custom<ResourceType>(val => AllResourceTypes.includes(val as ResourceType), {
    required_error: "Please select a resource type."
  }),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;

export default function NewResourcePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    loadUser();
  }, []);

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      description: '',
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });
  
  const onSubmit = async (data: ResourceFormValues) => {
    if (!currentUser) {
        toast({
            title: t('common.error'),
            description: t('citizen.resources.new.error.notLoggedIn'),
            variant: "destructive"
        });
        return;
    }
    // For this demo, we'll save to localStorage to simulate a database.
    const newResource: CommunityResource = {
        id: `resource-${Date.now()}`,
        userId: currentUser.id,
        type: data.type,
        description: data.description,
        location: {
            lat: data.latitude,
            lng: data.longitude,
        },
        timestamp: new Date().toISOString(),
    };

    const storedResources: CommunityResource[] = JSON.parse(localStorage.getItem('community_resources') || '[]');
    storedResources.unshift(newResource); // Add to the beginning of the list
    localStorage.setItem('community_resources', JSON.stringify(storedResources));

    toast({
        title: t('citizen.resources.new.success.title'),
        description: t('citizen.resources.new.success.description'),
        variant: 'default',
    });

    router.push('/dashboard/resources');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('citizen.resources.new.title')}</CardTitle>
          <CardDescription>{t('citizen.resources.new.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('citizen.resources.new.typeLabel')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={t('citizen.resources.new.typePlaceholder')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {AllResourceTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
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
                    <FormLabel>{t('citizen.resources.new.detailsLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('citizen.resources.new.detailsPlaceholder')}
                        className="resize-none"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('citizen.resources.new.locationLabel')}</h3>
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
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('citizen.resources.new.submitButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
