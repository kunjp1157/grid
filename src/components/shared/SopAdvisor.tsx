
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bot, Loader2 } from 'lucide-react';
import type { SopItem } from '@/ai/flows/generate-sop';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/context/LocalizationContext';

interface SopAdvisorProps {
  sopItems: SopItem[];
  isLoading: boolean;
  onItemsChange: (items: SopItem[]) => void;
}

export function SopAdvisor({ sopItems, isLoading, onItemsChange }: SopAdvisorProps) {
  const { t } = useTranslation();
  const handleCheckedChange = (index: number, checked: boolean) => {
    const newItems = [...sopItems];
    newItems[index].completed = checked;
    onItemsChange(newItems);
  };

  const renderSkeletons = () => (
    Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-full" />
        </div>
    ))
  );

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-blue-900 dark:text-blue-200">
          <Bot className="h-6 w-6" />
          {t('components.sopAdvisor.title')}
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          {t('components.sopAdvisor.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            renderSkeletons()
          ) : sopItems.length > 0 ? (
            sopItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-md bg-background/60">
                <Checkbox
                  id={`sop-item-${index}`}
                  checked={item.completed}
                  onCheckedChange={(checked) => handleCheckedChange(index, !!checked)}
                  className="h-5 w-5"
                />
                <Label
                  htmlFor={`sop-item-${index}`}
                  className={`flex-1 text-sm ${item.completed ? 'text-muted-foreground line-through' : ''}`}
                >
                  {item.text}
                </Label>
              </div>
            ))
          ) : (
             <p className="text-sm text-muted-foreground">{t('components.sopAdvisor.none')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
