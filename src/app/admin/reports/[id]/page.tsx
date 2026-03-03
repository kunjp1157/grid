
"use client";

import { useState, useEffect, useMemo } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
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
import { ChatInterface } from '@/components/shared/ChatInterface';
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import { ReportStatus, ReportPriority, type Report, type ChatMessage, type User } from '@/lib/types';
import { trackReportResolutionDeadline, type TrackReportResolutionDeadlineOutput } from '@/ai/flows/track-report-resolution-deadlines';
import { sendNotification } from '@/ai/flows/send-notification';
import { generateSop, type SopItem } from '@/ai/flows/generate-sop';
import { predictSecondaryHazards, type PredictedHazard } from '@/ai/flows/predict-secondary-hazards';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SopAdvisor } from '@/components/shared/SopAdvisor';
import { LiveStreamViewer } from '@/components/shared/LiveStreamViewer';
import { PredictedRisks } from '@/components/shared/PredictedRisks';
import { LocationMap } from '@/components/shared/LocationMap';
import { getReportById, updateReportStatus } from '@/actions/reports';

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const resolvedParams = use(params);
  
  const [report, setReport] = useState<Report | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
        const data = await getReportById(resolvedParams.id);
        if (data) {
            setReport(data as any);
            setCurrentStatus(data.status);
        } else {
            setReport(null);
        }
        setLoading(false);
    };

    const fetchUser = async () => {
        const res = await fetch('/api/user');
        if (res.ok) {
            const userData = await res.json();
            setCurrentUser(userData);
        }
    };

    loadReport();
    fetchUser();
  }, [resolvedParams.id]);
  
  const [currentStatus, setCurrentStatus] = useState<ReportStatus>(ReportStatus.New);
  const [isCheckingOverdue, setIsCheckingOverdue] = useState(false);
  const [overdueResult, setOverdueResult] = useState<TrackReportResolutionDeadlineOutput | null>(null);

  const [sop, setSop] = useState<SopItem[]>([]);
  const [isGeneratingSop, setIsGeneratingSop] = useState(false);
  
  const [predictedHazards, setPredictedHazards] = useState<PredictedHazard[]>([]);
  const [isPredictingHazards, setIsPredictingHazards] = useState(false);

  const shouldGenerateSop = useMemo(() => {
    return report?.priority === ReportPriority.Critical || report?.priority === ReportPriority.High;
  }, [report?.priority]);
  
  useEffect(() => {
      if (!report) return;

      const fetchAiInsights = async () => {
          if (shouldGenerateSop && sop.length === 0) {
              setIsGeneratingSop(true);
              try {
                  const result = await generateSop({
                      reportType: report.type,
                      priority: report.priority,
                      description: report.description,
                  });
                  setSop(result);
              } catch(err) {
                  console.error(err);
              } finally {
                  setIsGeneratingSop(false);
              }
          }
          
          if (predictedHazards.length === 0) {
              setIsPredictingHazards(true);
              try {
                  const hazards = await predictSecondaryHazards({
                      reportType: report.type,
                      description: report.description,
                  });
                  setPredictedHazards(hazards);
              } catch(err) {
                  console.error(err);
              } finally {
                  setIsPredictingHazards(false);
              }
          }
      };
      
      fetchAiInsights();
  }, [report, shouldGenerateSop, predictedHazards.length, sop.length]);


  if (loading) {
      return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!report) {
    notFound();
  }
  
  const handleSendMessage = (text: string) => {
    // Message logic would go here
     toast({
        title: "Chat Feature",
        description: "Messaging is currently in simulation mode.",
    });
  };

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

  const handleStatusChange = async (newStatus: ReportStatus) => {
    try {
        await updateReportStatus(report.id, newStatus);
        setCurrentStatus(newStatus);
        setReport(prev => prev ? {...prev, status: newStatus} : null);
        
        toast({
            title: "Status Updated",
            description: `Report status changed to "${newStatus}".`,
        });
    } catch (error) {
        console.error("Failed to update status", error);
        toast({
            title: "Error",
            description: "Could not update status in database.",
            variant: "destructive"
        })
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('admin.reportDetails.title')} #{report.id.substring(0, 7)}</h1>
        <ReportStatusBadge status={currentStatus} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          
          <LiveStreamViewer reportId={report.id} />

          <PredictedRisks hazards={predictedHazards} isLoading={isPredictingHazards} />

          {shouldGenerateSop && (
              <SopAdvisor sopItems={sop} isLoading={isGeneratingSop} onItemsChange={setSop} />
          )}

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
                 <CardContent>
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
                 </CardContent>
            )}
          </Card>

           {currentUser && (
              <ChatInterface 
                messages={report.messages || []}
                currentUser={currentUser}
                otherUser={undefined}
                onSendMessage={handleSendMessage}
              />
           )}
          
          {report.rating && (
            <Card>
                <CardHeader>
                    <CardTitle>Resolution Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Rating:</span>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < report.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                             <span className="ml-2 text-muted-foreground">({report.rating}/5)</span>
                        </div>
                    </div>
                   {report.feedback && (
                     <div>
                        <p className="font-semibold">Comments:</p>
                        <blockquote className="mt-1 border-l-2 pl-6 italic text-muted-foreground">
                           "{report.feedback}"
                        </blockquote>
                    </div>
                   )}
                </CardContent>
            </Card>
          )}

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
              <CardTitle>{t('admin.reportDetails.updateStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Select value={currentStatus} onValueChange={(value) => handleStatusChange(value as ReportStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReportStatus).map(status => (
                      <SelectItem key={status} value={status}>{t(`reportStatus.${status.replace(/\s/g, '')}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </CardContent>
          </Card>
          
          <LocationMap latitude={report.location.lat} longitude={report.location.lng} title="Incident Location" />

          <Card>
            <CardHeader>
                <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.reportedBy')}</span>
                  <span>{report.userId}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.submittedOn')}</span>
                  <span>{formatDate(report.timestamp)}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reports.assignedAdmin')}</span>
                  <span>{report.assignedAdminId || 'Unassigned'}</span>
                </li>
                 <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.deadline')}</span>
                  <span>{report.resolutionDeadline ? formatDate(report.resolutionDeadline) : 'N/A'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
