
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PredictedHazard } from '@/ai/flows/predict-secondary-hazards';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PredictedRisksProps {
  hazards: PredictedHazard[];
  isLoading: boolean;
}

export function PredictedRisks({ hazards, isLoading }: PredictedRisksProps) {
  const renderSkeletons = () => (
    Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-3">
        <Skeleton className="h-5 w-5 mt-1 rounded" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))
  );

  return (
    <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-yellow-900 dark:text-yellow-200">
          <AlertTriangle className="h-6 w-6" />
          AI Predicted Secondary Risks
        </CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          Potential cascading events based on the initial report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            renderSkeletons()
          ) : hazards.length > 0 ? (
            hazards.map((item, index) => (
              <Alert key={index} variant="default" className="bg-background/60 border-yellow-300/50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">{item.hazard}</AlertTitle>
                  <AlertDescription>
                    {item.reasoning}
                  </AlertDescription>
              </Alert>
            ))
          ) : (
             <p className="text-sm text-muted-foreground">No secondary risks predicted at this time.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
