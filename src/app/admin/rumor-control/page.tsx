
"use client";

import { useState } from 'react';
import { factCheckRumor, type FactCheckRumorOutput } from '@/ai/flows/fact-check-rumor';
import { reports } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function RumorControlPage() {
  const [rumorText, setRumorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FactCheckRumorOutput | null>(null);
  const { toast } = useToast();

  const handleFactCheck = async () => {
    if (rumorText.trim().length < 10) {
      toast({
        title: 'Input Too Short',
        description: 'Please enter a rumor or social media post to fact-check.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const analysis = await factCheckRumor({
        rumorText,
        // In a real app, you might fetch only recent or relevant reports
        reports: reports, 
      });
      setResult(analysis);
    } catch (error) {
      console.error('Fact-checking failed:', error);
      toast({
        title: 'AI Fact-Check Failed',
        description: 'Could not analyze the rumor. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ResultIcon = () => {
    if (!result) return null;
    switch (result.conclusion) {
      case 'Supported':
        return <CheckCircle className="h-4 w-4" />;
      case 'Not Supported':
        return <XCircle className="h-4 w-4" />;
      case 'Unverified':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Rumor Control Center</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fact-Check a Rumor</CardTitle>
          <CardDescription>
            Paste a social media post or rumor below. The AI will analyze it against official reports in the database to assess its validity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'I heard the main bridge has collapsed due to the floods! Everyone panic!'"
            value={rumorText}
            onChange={(e) => setRumorText(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button onClick={handleFactCheck} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Fact-Check Rumor
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              variant={
                result.conclusion === 'Supported'
                  ? 'default'
                  : result.conclusion === 'Not Supported'
                  ? 'destructive'
                  : 'default'
              }
              className={cn({
                'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800 text-green-900 dark:text-green-200 [&>svg]:text-green-600': result.conclusion === 'Supported',
                'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 [&>svg]:text-yellow-600': result.conclusion === 'Unverified',
              })}
            >
              <ResultIcon />
              <AlertTitle className="font-bold text-lg">
                Conclusion: {result.conclusion}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <strong>AI Reasoning:</strong> {result.reasoning}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
