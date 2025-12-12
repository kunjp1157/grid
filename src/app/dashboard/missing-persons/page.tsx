
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { findMissingPerson, type FindMissingPersonOutput } from '@/ai/flows/find-missing-person';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Search, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';


const matcherSchema = z.object({
  missingPersonImage: z.any().refine(files => files?.length == 1, "A photo of the missing person is required."),
  groupImage: z.any().refine(files => files?.length == 1, "A photo of the group is required."),
});

type MatcherFormValues = z.infer<typeof matcherSchema>;

export default function MissingPersonsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindMissingPersonOutput | null>(null);
  const [missingPersonPreview, setMissingPersonPreview] = useState<string | null>(null);
  const [groupPreview, setGroupPreview] = useState<string | null>(null);

  const form = useForm<MatcherFormValues>({
    resolver: zodResolver(matcherSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setter(null);
    }
  };

  const onSubmit = async (data: MatcherFormValues) => {
    if (!missingPersonPreview || !groupPreview) {
        toast({ title: "Missing Images", description: "Please upload both images before submitting.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const analysis = await findMissingPerson({
        missingPersonImage: missingPersonPreview,
        groupImage: groupPreview,
      });
      setResult(analysis);
    } catch (error) {
      console.error('AI Matching failed:', error);
      toast({
        title: 'AI Matching Failed',
        description: 'Could not analyze the images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const ResultIcon = () => {
    if (!result) return null;
    return result.matchFound ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Missing Persons AI Matcher</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Find Someone</CardTitle>
          <CardDescription>
            Upload a photo of a missing person and a group photo from a shelter or crowd. The AI will analyze both to find a potential match.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="missingPersonImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. Photo of Missing Person</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => {
                          field.onChange(e.target.files);
                          handleFileChange(e, setMissingPersonPreview);
                        }} />
                      </FormControl>
                      <FormMessage />
                      {missingPersonPreview && <Image src={missingPersonPreview} alt="Missing person preview" width={300} height={300} className="mt-4 rounded-md object-contain border" />}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Photo of Group / Found People</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => {
                          field.onChange(e.target.files);
                          handleFileChange(e, setGroupPreview);
                        }} />
                      </FormControl>
                      <FormMessage />
                      {groupPreview && <Image src={groupPreview} alt="Group preview" width={300} height={300} className="mt-4 rounded-md object-contain border" />}
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isLoading ? 'Analyzing...' : 'Find Match'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              variant={result.matchFound ? 'default' : 'destructive'}
              className={cn({
                'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800 text-green-900 dark:text-green-200 [&>svg]:text-green-600': result.matchFound,
              })}
            >
              <ResultIcon />
              <AlertTitle className="font-bold text-lg">
                {result.matchFound ? 'Potential Match Found' : 'No Clear Match Found'}
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-4">
                <div>
                    <strong>AI Reasoning:</strong> {result.reasoning}
                </div>
                <div>
                    <strong className="block mb-1">Confidence Score: {(result.confidenceScore * 100).toFixed(0)}%</strong>
                    <Progress value={result.confidenceScore * 100} className="w-full h-3" />
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
