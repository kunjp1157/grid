
"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import { reports, users } from '@/lib/data';
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
import { ReportStatus, Report, ChatMessage, User } from '@/lib/types';
import { trackReportResolutionDeadline, type TrackReportResolutionDeadlineOutput } from '@/ai/flows/track-report-resolution-deadlines';
import { sendNotification } from '@/ai/flows/send-notification';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const resolvedParams = use(params);
  
  // We use local state to manage the report to see chat updates instantly
  const [report, setReport] = useState(() => reports.find(r => r.id === resolvedParams.id));
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch the current user from an auth context
    setCurrentUser(users.find(u => u.role === 'admin') || null);
  }, []);
  
  const [currentStatus, setCurrentStatus] = useState(report?.status || ReportStatus.New);
  const [isCheckingOverdue, setIsCheckingOverdue] = useState(false);
  const [overdueResult, setOverdueResult] = useState<TrackReportResolutionDeadlineOutput | null>(null);

  if (!report) {
    notFound();
  }

  const reporter = users.find(u => u.id === report.userId);
  const admin = users.find(u => u.id === report.assignedAdminId);
  
  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
    };
    
    // In a real app, this would be an API call to your backend.
    // Here, we just update the mock data in state.
    const updatedMessages = [...(report.messages || []), newMessage];
    setReport({ ...report, messages: updatedMessages });

     toast({
        title: "Message Sent (Simulated)",
        description: "In a real app, this would be sent in real-time.",
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
    setCurrentStatus(newStatus);
    setReport(prev => prev ? {...prev, status: newStatus} : null);
    
    try {
        await sendNotification({
            userId: report.userId,
            reportId: report.id,
            message: `The status of your report #${report.id.substring(0,7)} has been updated to: ${newStatus}`
        });
        toast({
            title: "Status Updated",
            description: `Report status changed to "${newStatus}" and user notified.`,
        });
    } catch (error) {
        console.error("Failed to send notification", error);
        toast({
            title: "Notification Error",
            description: "The status was updated, but the notification failed to send.",
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ReportTypeIcon type={report.type} className="w-6 h-6 text-muted-foreground" />
                <CardTitle>{t(`reportTypes.${Object.keys(ReportType).find(key => ReportType[key as keyof typeof ReportType] === report.type)}`)}</CardTitle>
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

           {report.messages && currentUser && (
              <ChatInterface 
                messages={report.messages}
                currentUser={currentUser}
                otherUser={reporter}
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

          <Card>
            <CardHeader>
                <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <span className="text-muted-foreground">{t('admin.reports.assignedAdmin')}</span>
                  <span>{admin?.name || 'Unassigned'}</span>
                </li>
                 <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.deadline')}</span>
                  <span>{report.resolutionDeadline ? formatDate(report.resolutionDeadline) : 'N/A'}</span>
                </li>
                <Separator />
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('admin.reportDetails.location')}</span>
                  <Button variant="link" size="sm" asChild>
                    <a href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs">
                        {report.location.lat}, {report.location.lng}
                    </a>
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
