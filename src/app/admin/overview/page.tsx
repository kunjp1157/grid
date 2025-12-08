"use client";

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart,
  BarChart,
  FileSearch,
  CheckCircle,
  Clock,
  Timer,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
} from 'recharts';
import { reports, Report, ReportStatus, type ReportType } from '@/lib/data';
import { useTranslation } from '@/context/LocalizationContext';
import { differenceInHours, subDays } from 'date-fns';
import { AllReportTypes } from '@/lib/types';

export default function OverviewDashboardPage() {
  const { t } = useTranslation();

  const metrics = useMemo(() => {
    const totalReports = reports.length;
    const resolvedReports = reports.filter(
      (r) => r.status === ReportStatus.Resolved
    ).length;
    const overdueReports = reports.filter(
      (r) => r.status === ReportStatus.Overdue
    ).length;
    const resolvedWithTime = reports.filter(
      (r) =>
        r.status === ReportStatus.Resolved &&
        r.resolutionDeadline &&
        r.timestamp
    );

    const totalResolutionTime = resolvedWithTime.reduce((acc, report) => {
      const startTime = new Date(report.timestamp);
      // This is a simplification; in a real app, you'd store resolution time.
      // We'll use the deadline as a proxy for when it was resolved for this metric.
      const endTime = new Date(report.resolutionDeadline!);
      return acc + differenceInHours(endTime, startTime);
    }, 0);

    const avgResolutionTime =
      resolvedWithTime.length > 0
        ? (totalResolutionTime / resolvedWithTime.length).toFixed(1)
        : 'N/A';

    return {
      totalReports,
      resolvedReports,
      overdueReports,
      avgResolutionTime,
    };
  }, []);

  const reportsByTypeChartData = useMemo(() => {
    const data = AllReportTypes.map((type) => ({
      name: t(`reportTypes.${type.replace(/\s/g, '')}`),
      count: reports.filter((r) => r.type === type).length,
    }));
    return data.filter(d => d.count > 0);
  }, [t]);

  const reportsOverTimeChartData = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const dailyCounts: { [key: string]: number } = {};

    for (let i = 0; i < 30; i++) {
        const date = subDays(new Date(), i);
        dailyCounts[date.toISOString().split('T')[0]] = 0;
    }

    reports.forEach(report => {
        const reportDate = new Date(report.timestamp);
        if (reportDate >= thirtyDaysAgo) {
            const dateKey = reportDate.toISOString().split('T')[0];
            if (dailyCounts[dateKey] !== undefined) {
                dailyCounts[dateKey]++;
            }
        }
    });

    return Object.keys(dailyCounts).map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dailyCounts[date],
    })).reverse();
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Performance Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resolvedReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overdueReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Resolution Time (Hours)
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResolutionTime}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reports by Type</CardTitle>
            <CardDescription>Distribution of report categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <RechartsBarChart
                accessibilityLayer
                data={reportsByTypeChartData}
                margin={{ top: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={8} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports Trend</CardTitle>
            <CardDescription>
              Number of reports submitted over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <RechartsAreaChart
                accessibilityLayer
                data={reportsOverTimeChartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="count"
                  type="natural"
                  fill="var(--color-primary)"
                  fillOpacity={0.4}
                  stroke="var(--color-primary)"
                />
              </RechartsAreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
