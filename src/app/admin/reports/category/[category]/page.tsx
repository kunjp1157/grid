
"use client";

import { useEffect, useState } from 'react';
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
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { reportCategories, getCategoryForType, type ReportCategory, type Report } from '@/lib/types';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { getAllReports } from '@/actions/reports';
import { Loader2 } from 'lucide-react';

export default function ReportsByCategoryPage({ params }: { params: { category: string } }) {
    const { t } = useTranslation();
    const resolvedParams = use(params);
    const categoryParam = resolvedParams.category.replace(/%20/g, " ");
    const category = Object.keys(reportCategories).find(c => c.toLowerCase() === categoryParam.toLowerCase()) as ReportCategory | undefined;

    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            const data = await getAllReports();
            setReports(data as any);
            setLoading(false);
        };
        fetchReports();
    }, []);

    if (!category) {
        notFound();
    }
    
    const filteredReports = reports.filter(r => getCategoryForType(r.type) === category);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ReportTypeIcon type={filteredReports[0]?.type || 'Other'} className="h-8 w-8" />
              {t(`reportCategories.${category.replace(/\s/g, '')}`)} Reports
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>All {t(`reportCategories.${category.replace(/\s/g, '')}`)} Reports ({filteredReports.length})</CardTitle>
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
                        {filteredReports.map(report => (
                        <TableRow key={report.id}>
                            <TableCell>
                                <ReportTypeIcon type={report.type} className="h-5 w-5 text-muted-foreground" />
                            </TableCell>
                            <TableCell className="font-mono text-xs">#{report.id.substring(0, 7)}</TableCell>
                            <TableCell>{t(`reportTypes.${report.type.replace(/\s/g, '')}`)}</TableCell>
                            <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                            <TableCell>{report.userId}</TableCell>
                            <TableCell>{formatDate(report.timestamp, 'PP')}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/reports/${report.id}`}>{t('admin.reports.details')}</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                        {filteredReports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No reports found in this category.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
