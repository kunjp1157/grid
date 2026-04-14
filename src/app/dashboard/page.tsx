
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
import { PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import type { User, Report, ReportType } from '@/lib/types';
import { getUserReports } from '@/actions/reports';

export default function CitizenDashboardPage() {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [userReports, setUserReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userRes = await fetch('/api/user');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                    const reportsData = await getUserReports(userData.id);
                    setUserReports(reportsData as any);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center text-destructive font-bold">Unauthorized</div>;
    }

    const reportsByType = Object.values(userReports.reduce((acc, report) => {
        if (!acc[report.type]) {
            acc[report.type] = { type: report.type, count: 0 };
        }
        acc[report.type].count++;
        return acc;
    }, {} as { [key in ReportType]?: { type: ReportType, count: number } }));


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t('citizen.dashboard.welcome', { name: user.name })}</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {reportsByType.map((item) => item && (
                    <Card key={item.type}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t(`reportTypes.${item.type.replace(/\s/g, '')}`)}</CardTitle>
                            <ReportTypeIcon type={item.type} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.count}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('citizen.dashboard.recentReports')}</CardTitle>
                        <CardDescription>{t('citizen.dashboard.description')}</CardDescription>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/my-reports">
                            {t('citizen.dashboard.viewAll')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
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
                            {userReports.slice(0, 5).map(report => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <ReportTypeIcon type={report.type} className="h-5 w-5 text-muted-foreground" />
                                </TableCell>
                                <TableCell className="font-mono text-xs">#{report.id.substring(0, 7)}</TableCell>
                                <TableCell>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</TableCell>
                                <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                                <TableCell>{formatDate(report.timestamp, 'PP')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/dashboard/reports/${report.id}`}>View</Link>
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
