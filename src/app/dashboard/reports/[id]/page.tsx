
"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { ReportTypeIcon } from '@/components/shared/ReportTypeIcon';
import { ChatInterface } from '@/components/shared/ChatInterface';
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import { type Report, type User } from '@/lib/types';
import Image from 'next/image';
import { Loader2, ArrowLeft, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocationMap } from '@/components/shared/LocationMap';
import { getReportById } from '@/actions/reports';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CitizenReportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) {
      return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!report) {
    notFound();
  }
  
  const handleSendMessage = (text: string) => {
     toast({
        title: "Chat Simulation",
        description: "Your message has been added to the queue.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/my-reports">
                <ArrowLeft className="h-5 w-5" />
            </Link>
        </Button>
        <h1 className="text-3xl font-bold flex-1">{t('admin.reportDetails.title')} #{report.id.substring(0, 7)}</h1>
        <ReportStatusBadge status={report.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <ReportTypeIcon type={report.type} className="w-6 h-6 text-muted-foreground" />
                <CardTitle>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</CardTitle>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/dashboard/live/${report.id}`}>
                    <Video className="mr-2 h-4 w-4" />
                    {t('citizen.reports.goLive')}
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
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
                            className="rounded-lg object-cover w-full max-h-[400px]"
                            data-ai-hint="incident photo"
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
        </div>

        <div className="md:col-span-1 space-y-6">
          <LocationMap latitude={report.location.lat} longitude={report.location.lng} title={t('admin.reportDetails.location')} />

          <Card>
            <CardHeader>
                <CardTitle>{t('admin.reportDetails.reportInfoTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.submittedOn')}</span>
                  <span className="font-medium">{formatDate(report.timestamp)}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-semibold uppercase text-xs">{report.priority}</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reports.assignedAdmin')}</span>
                  <span>{report.assignedAdminId || t('common.unassigned')}</span>
                </li>
                 <Separator />
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.reportDetails.deadline')}</span>
                  <span>{report.resolutionDeadline ? formatDate(report.resolutionDeadline) : t('common.na')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
