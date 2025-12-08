"use client";

import {
  Card,
  CardContent,
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
import { reports, users } from '@/lib/data'; // Mock data
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { ReportType } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { getCategoryForType } from '@/lib/types';

export default function AdminDashboardPage() {
    const { t } = useTranslation();

    const getUserName = (userId: string) => {
        return users.find(u => u.id === userId)?.name || 'Unknown User';
    }

    const reportsByCategory = Object.entries(
      reports.reduce((acc, report) => {
        const category = getCategoryForType(report.type) || 'Other';
        if (!acc[category]) {
          acc[category] = { type: report.type, count: 0 };
        }
        acc[category].count++;
        return acc;
      }, {} as { [key: string]: { type: ReportType; count: number } })
    ).map(([key, value]) => ({...value, category: key}));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {reportsByCategory.map(({ type, count, category }) => (
                    <Link href={`/admin/reports/category/${category}`} key={category}>
                        <Card className="hover:bg-muted transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t(`reportCategories.${category.replace(/\s/g, '')}`)}</CardTitle>
                                <ReportTypeIcon type={type} className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('admin.dashboard.recentReports')}</CardTitle>
                    <Button asChild variant="outline">
                        <Link href="/admin/reports">
                            {t('admin.dashboard.viewAll')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[80px]"></TableHead>
                        <TableHead>{t('admin.reports.id')}</TableHead>
                        <TableHead>{t('admin.reports.type')}</TableHead>
                        <TableHead>{t('admin.reports.status')}</TableHead>
                        <TableHead>{t('admin.reports.submittedBy')}</TableHead>
                        <TableHead>{t('admin.reports.date')}</TableHead>
                        <TableHead className="text-right">{t('admin.reports.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.slice(0, 5).map(report => ( // Show recent 5 reports
                        <TableRow key={report.id}>
                            <TableCell>
                                <ReportTypeIcon type={report.type} className="h-5 w-5 text-muted-foreground" />
                            </TableCell>
                            <TableCell className="font-mono text-xs">#{report.id.substring(0, 7)}</TableCell>
                            <TableCell>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</TableCell>
                            <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                            <TableCell>{getUserName(report.userId)}</TableCell>
                            <TableCell>{formatDate(report.timestamp, 'PP')}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/reports/${report.id}`}>{t('admin.reports.details')}</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
