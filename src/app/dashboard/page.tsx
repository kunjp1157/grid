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
import { PlusCircle, ArrowRight } from 'lucide-react';
import type { User, ReportType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function CitizenDashboardPage() {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        loadUser();
    }, []);


    const userReports = user ? reports.filter(r => r.userId === user.id) : [];

    if (!user) {
        return <div>Loading...</div>;
    }

    const reportsByCategory = Object.values(userReports.reduce((acc, report) => {
        if (!acc[report.type]) {
            acc[report.type] = { type: report.type, count: 0 };
        }
        acc[report.type].count++;
        return acc;
    }, {} as { [key in ReportType]: { type: ReportType, count: number } }));


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t('citizen.dashboard.welcome', { name: user?.name || 'Citizen' })}</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {reportsByCategory.map(({ type, count }) => (
                    <Card key={type}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t(`reportTypes.${type.replace(/\s/g, '')}`)}</CardTitle>
                            <ReportTypeIcon type={type} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
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
                            {userReports.slice(0, 5).map(report => ( // Show recent 5 reports
                            <TableRow key={report.id}>
                                <TableCell>
                                    <ReportTypeIcon type={report.type} className="h-5 w-5 text-muted-foreground" />
                                </TableCell>
                                <TableCell className="font-mono text-xs">#{report.id.substring(0, 7)}</TableCell>
                                <TableCell>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</TableCell>
                                <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                                <TableCell>{formatDate(report.timestamp, 'PP')}</TableCell>
                                <TableCell className="text-right">
                                    {/* In a real app, this would link to a details page */}
                                    <Button variant="outline" size="sm">{t('citizen.reports.view')}</Button>
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
