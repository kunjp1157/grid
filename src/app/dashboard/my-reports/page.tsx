"use client";

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
import { reports } from '@/lib/data'; // Mock data
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import type { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { ReportStatus } from '@/lib/types';
import { FeedbackDialog } from '@/components/shared/FeedbackDialog';
import { useToast } from '@/hooks/use-toast';

export default function MyReportsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    // We'll use local state to manage reports to see feedback changes instantly
    const [userReports, setUserReports] = useState(user ? reports.filter(r => r.userId === user.id) : []);


    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    setUserReports(reports.filter(r => r.userId === userData.id))
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        loadUser();
    }, []);

    const handleFeedbackSubmit = (reportId: string, rating: number, feedback: string) => {
        // In a real app, this would be an API call to your backend.
        // Here, we just update the mock data in state.
        const updatedReports = userReports.map(report => {
            if (report.id === reportId) {
                return { ...report, rating, feedback };
            }
            return report;
        });
        setUserReports(updatedReports);
        toast({
            title: "Feedback Submitted",
            description: "Thank you for helping us improve our service!",
        });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

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
                                <TableCell className="text-right">
                                     {report.status === ReportStatus.Resolved && typeof report.rating === 'undefined' ? (
                                        <FeedbackDialog report={report} onSubmit={handleFeedbackSubmit} />
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>{t('citizen.reports.view')}</Button>
                                    )}
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
