
"use client";

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/shared/Header';
import { getUser } from '@/actions/auth';
import { Logo } from '@/components/shared/Logo';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { geofenceAndRouteReport } from '@/ai/flows/geofence-and-route-reports';
import type { ReportFormValues } from './new-report/page';
import { zones } from '@/lib/data';
import { DashboardSidebarItems } from '@/components/layout/DashboardSidebarItems';
import { useTranslation } from '@/context/LocalizationContext';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
        const user = await getUser();
        setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const syncOfflineReports = async () => {
      const offlineReports: ReportFormValues[] = JSON.parse(localStorage.getItem('offlineReports') || '[]');
      if (offlineReports.length === 0) return;

      toast({
        title: t('toasts.syncingReportsTitle'),
        description: t('toasts.syncingReportsDescription', { count: offlineReports.length.toString() }),
      });
      
      const submittedReports: string[] = [];

      for (const report of offlineReports) {
        try {
          // Simulate the original submission logic
          const reportId = `report-${Date.now()}`;
          const result = await geofenceAndRouteReport({
            reportId: reportId,
            latitude: report.latitude,
            longitude: report.longitude,
          });
          const zoneName = result.assignedZoneId ? zones.find(z => z.id === result.assignedZoneId)?.name : 'N/A';

          console.log(`Synced offline report:`, report);

          submittedReports.push((report as any).id);
        } catch (error) {
          console.error('Failed to sync an offline report:', error);
        }
      }

      if (submittedReports.length > 0) {
        const remainingReports = offlineReports.filter(r => !submittedReports.includes((r as any).id));
        localStorage.setItem('offlineReports', JSON.stringify(remainingReports));
        toast({
          title: t('toasts.syncSuccessTitle'),
          description: t('toasts.syncSuccessDescription', { count: submittedReports.length.toString() }),
        });
      }
    };

    // Check on initial load
    if (navigator.onLine) {
      syncOfflineReports();
    }

    // Add event listener for when the app comes back online
    window.addEventListener('online', syncOfflineReports);

    return () => {
      window.removeEventListener('online', syncOfflineReports);
    };
  }, [toast, t]);

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <DashboardSidebarItems />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header user={user} />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
