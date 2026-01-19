
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Repeat } from 'lucide-react';
import { useTranslation } from '@/context/LocalizationContext';

const barterSchema = z.object({
  have: z.string().min(5, "Please describe what you have in more detail.").max(200, "Description is too long."),
  need: z.string().min(5, "Please describe what you need in more detail.").max(200, "Description is too long."),
});

export type BarterFormValues = z.infer<typeof barterSchema>;

export default function NewBarterPostPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BarterFormValues>({
    resolver: zodResolver(barterSchema),
    defaultValues: {
      have: '',
      need: '',
    },
  });
  
  const onSubmit = async (data: BarterFormValues) => {
    // In a real app, this would make an API call to save the post.
    // For this demo, we'll just show a success message and redirect.
    console.log("New Barter Post Submitted:", data);

    toast({
        title: t('citizen.barter.new.success.createdTitle'),
        description: t('citizen.barter.new.success.createdDescription'),
        variant: 'default',
    });

    router.push('/dashboard/barter');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Repeat className="h-6 w-6 text-primary" />
            <CardTitle>{t('citizen.barter.new.title')}</CardTitle>
          </div>
          <CardDescription>{t('citizen.barter.new.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField
                control={form.control}
                name="have"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-green-700">{t('citizen.barter.new.haveLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('citizen.barter.new.havePlaceholder')}
                        className="resize-none"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                     <CardDescription>
                       {t('citizen.barter.new.haveDescription')}
                    </CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="need"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-orange-700">{t('citizen.barter.new.needLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('citizen.barter.new.needPlaceholder')}
                        className="resize-none"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <CardDescription>
                       {t('citizen.barter.new.needDescription')}
                    </CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('citizen.barter.new.submitButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
