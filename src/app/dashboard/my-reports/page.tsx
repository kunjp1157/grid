
"use client";

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { ReportTypeIcon } from '@/components/shared/ReportTypeIcon';
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PlusCircle, Video } from 'lucide-react';
import { ReportStatus, type Report, type User } from '@/lib/types';
import { getUserReports } from '@/actions/reports';
import { FeedbackDialog } from '@/components/shared/FeedbackDialog';
import { useToast } from '@/hooks/use-toast';

export default function MyReportsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [userReports, setUserReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    const reports = await getUserReports(userData.id);
                    setUserReports(reports as any);
                }
            } catch (error) {
                console.error("Failed to load reports", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleFeedbackSubmit = (reportId: string, rating: number, feedback: string) => {
        const updatedReports = userReports.map(report => {
            if (report.id === reportId) {
                return { ...report, rating, feedback };
            }
            return report;
        });
        setUserReports(updatedReports);
        toast({
            title: t('citizen.reports.feedback.successTitle'),
            description: t('citizen.reports.feedback.successDescription'),
        });
    };

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;
    if (!user) return <div className="p-8 text-center text-destructive">Unauthorized</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('citizen.reports.title')}</CardTitle>
                    <CardDescription>{t('citizen.reports.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {userReports.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[80px]"></TableHead>
                            <TableHead>{t('citizen.reports.id')}</TableHead>
                            <TableHead>{t('citizen.reports.type')}</TableHead>
                            <TableHead>{t('citizen.reports.status')}</TableHead>
                            <TableHead>{t('citizen.reports.date')}</TableHead>
                            <TableHead className="text-right">{t('citizen.reports.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userReports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <ReportTypeIcon type={report.type} className="h-5 w-5 text-muted-foreground" />
                                </TableCell>
                                <TableCell className="font-mono text-xs">#{report.id.substring(0, 7)}</TableCell>
                                <TableCell>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</TableCell>
                                <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                                <TableCell>{formatDate(report.timestamp, 'PP')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                     {report.status === ReportStatus.Resolved && typeof report.rating === 'undefined' ? (
                                        <FeedbackDialog report={report} onSubmit={handleFeedbackSubmit} />
                                    ) : (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/dashboard/live/${report.id}`}>
                                                {t('citizen.reports.view')}
                                            </Link>
                                        </Button>
                                    )}
                                     <Button asChild variant="secondary" size="sm">
                                        <Link href={`/dashboard/live/${report.id}`}>
                                            <Video className="mr-2 h-4 w-4" />
                                            {t('citizen.reports.goLive')}
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold">{t('citizen.dashboard.noReportsTitle')}</h3>
                            <p className="text-muted-foreground mt-2 mb-4">{t('citizen.dashboard.noReportsDescription')}</p>
                            <Button asChild>
                                <Link href="/dashboard/new-report">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {t('citizen.sidebar.newReport')}
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
