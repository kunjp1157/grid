
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Report } from '@/lib/types';
import { useTranslation } from '@/context/LocalizationContext';

interface FeedbackDialogProps {
  report: Report;
  onSubmit: (reportId: string, rating: number, feedback: string) => void;
}

export function FeedbackDialog({ report, onSubmit }: FeedbackDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onSubmit(report.id, rating, feedback);
    setIsOpen(false);
    // Reset state for next time
    setRating(0);
    setFeedback('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">{t('citizen.reports.feedback.button')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('citizen.reports.feedback.title')}</DialogTitle>
          <DialogDescription>
            {t('citizen.reports.feedback.description', { id: report.id.substring(0,7) })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    'h-8 w-8 cursor-pointer transition-colors',
                    (hoverRating >= star || rating >= star)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              </button>
            ))}
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="feedback">{t('citizen.reports.feedback.commentsLabel')}</Label>
            <Textarea
              id="feedback"
              placeholder={t('citizen.reports.feedback.commentsPlaceholder')}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>{t('citizen.reports.feedback.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>{t('citizen.reports.feedback.submit')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
