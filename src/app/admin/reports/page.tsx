
"use client";

import { useState, useMemo, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { ReportTypeIcon } from '@/components/shared/ReportTypeIcon';
import { useTranslation } from '@/context/LocalizationContext';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ReportStatus, type Report } from '@/lib/types';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllReports } from '@/actions/reports';

export default function AllReportsPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [date, setDate] = useState<DateRange | undefined>(undefined);
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

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const includesSearchTerm = searchTerm.trim() === '' || 
                report.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                report.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

            const reportDate = new Date(report.timestamp);
            const matchesDate = !date || (
                (!date.from || reportDate >= date.from) &&
                (!date.to || reportDate <= date.to)
            );
            
            return includesSearchTerm && matchesStatus && matchesDate;
        });
    }, [searchTerm, statusFilter, date, reports]);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t('admin.reports.title')}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.reports.all')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input 
                            placeholder={t('admin.reports.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('admin.reports.filterStatusPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('admin.reports.allStatuses')}</SelectItem>
                                {Object.values(ReportStatus).map(status => (
                                    <SelectItem key={status} value={status}>{t(`reportStatus.${status.replace(/\s/g, '')}`)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>{t('admin.reports.dateRangePlaceholder')}</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                    </div>

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
                                    No reports match your filters.
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
