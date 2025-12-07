"use client";

import { useState } from 'react';
import { reports, users } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { ReportTypeIcon } from '@/components/shared/ReportTypeIcon';
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import { ReportStatus } from '@/lib/types';
import { trackReportResolutionDeadline, type TrackReportResolutionDeadlineOutput } from '@/ai/flows/track-report-resolution-deadlines';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const report = reports.find(r => r.id === params.id);
  
  const [currentStatus, setCurrentStatus] = useState(report?.status || ReportStatus.New);
  const [isCheckingOverdue, setIsCheckingOverdue] = useState(false);
  const [overdueResult, setOverdueResult] = useState<TrackReportResolutionDeadlineOutput | null>(null);

  if (!report) {
    notFound();
  }

  const reporter = users.find(u => u.id === report.userId);
  const admin = users.find(u => u.id === report.assignedAdminId);

  const handleOverdueCheck = async () => {
    if (!report.resolutionDeadline || !report.assignedAdminId) {
        toast({
            title: "Cannot Check Status",
            description: "Report must have a deadline and an assigned admin.",
            variant: "destructive"
        })
        return;
    }
    setIsCheckingOverdue(true);
    setOverdueResult(null);
    try {
      const result = await trackReportResolutionDeadline({
        reportId: report.id,
        resolutionDeadline: report.resolutionDeadline,
        status: currentStatus,
        adminId: report.assignedAdminId,
      });
      setOverdueResult(result);
    } catch (error) {
      console.error(error);
      toast({
          title: t('admin.reportDetails.errorChecking'),
          variant: "destructive"
      })
    } finally {
      setIsCheckingOverdue(false);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('admin.reportDetails.title')}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ReportTypeIcon type={report.type} className="w-6 h-6 text-muted-foreground" />
                <CardTitle>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{report.description}</p>
            </CardContent>
            {report.mediaUrl && (
                 <CardFooter>
                    <div className="w-full">
                        <p className="text-sm font-medium mb-2">{t('admin.reportDetails.media')}</p>
                         <Image
                            src={report.mediaUrl}
                            alt={report.type}
                            width={600}
                            height={400}
                            className="rounded-lg object-cover"
                            data-ai-hint="crisis photo"
                        />
                    </div>
                 </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.reportDetails.overdueCheckResult')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleOverdueCheck} disabled={isCheckingOverdue}>
                {isCheckingOverdue && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('admin.reportDetails.checkOverdue')}
              </Button>
              {overdueResult && (
                <Alert className="mt-4" variant={overdueResult.isOverdue ? 'destructive' : 'default'}>
                    {overdueResult.isOverdue ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertTitle>
                    {overdueResult.isOverdue ? t('admin.reportDetails.isOverdue') : t('admin.reportDetails.isNotOverdue')}
                  </AlertTitle>
                  <AlertDescription>
                    {overdueResult.alertTriggered ? t('admin.reportDetails.alertTriggered') : t('admin.reportDetails.noAlert')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.reportDetails.status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ReportStatusBadge status={currentStatus} />
              <div>
                <label className="text-sm font-medium">{t('admin.reportDetails.updateStatus')}</label>
                <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as ReportStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReportStatus).map(status => (
                      <SelectItem key={status} value={status}>{t(`reportStatus.${status.replace(/\s/g, '')}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.reportedBy')}</span>
                  <span>{reporter?.name || 'N/A'}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.submittedOn')}</span>
                  <span>{formatDate(report.timestamp)}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reports.submittedBy')}</span>
                  <span>{admin?.name || 'Unassigned'}</span>
                </li>
                 <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.deadline')}</span>
                  <span>{report.resolutionDeadline ? formatDate(report.resolutionDeadline) : 'N/A'}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.location')}</span>
                  <span className="font-mono text-xs">{report.location.lat}, {report.location.lng}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
