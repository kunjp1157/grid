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
import { ReportType } from '@/lib/types';
import { notFound } from 'next/navigation';
import { use } from 'react';

// Helper function to convert param to ReportType enum key
const getReportTypeFromParam = (param: string): ReportType | undefined => {
    // This finds the key in ReportType enum that matches the param (e.g., "WasteManagement")
    const reportTypeKey = Object.keys(ReportType).find(key => key.toLowerCase() === param.toLowerCase()) as keyof typeof ReportType | undefined;
    if (reportTypeKey) {
        return ReportType[reportTypeKey];
    }
    // Also check if the param matches the value (e.g., "Waste Management")
    const reportTypeValueKey = Object.keys(ReportType).find(key => ReportType[key as keyof typeof ReportType].toLowerCase() === param.toLowerCase()) as keyof typeof ReportType | undefined;
    if(reportTypeValueKey) {
      return ReportType[reportTypeValueKey];
    }

    return undefined;
}


export default function ReportsByCategoryPage({ params }: { params: { category: string } }) {
    const { t } = useTranslation();
    const resolvedParams = use(params);
    const reportType = getReportTypeFromParam(resolvedParams.category);
    
    if (!reportType) {
        notFound();
    }
    
    const filteredReports = reports.filter(r => r.type === reportType);

    const getUserName = (userId: string) => {
        return users.find(u => u.id === userId)?.name || 'Unknown User';
    }
    
    const reportTypeKey = Object.keys(ReportType).find(key => ReportType[key as keyof typeof ReportType] === reportType);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ReportTypeIcon type={reportType} className="h-8 w-8" />
              {t(`reportTypes.${reportTypeKey || 'Other'}`)} Reports
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>All {t(`reportTypes.${reportTypeKey || 'Other'}`)} Reports ({filteredReports.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[80px]"></TableHead>
                        <TableHead>{t('admin.reports.id')}</TableHead>
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
