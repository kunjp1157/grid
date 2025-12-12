
"use client";

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/shared/Header';
import { getUser } from '@/actions/auth';
import { Logo } from '@/components/shared/Logo';
import { LayoutDashboard, PlusCircle, FileText, User, BookOpen, Video, Siren, HeartHandshake, Users, Handshake, BrainCircuit, Repeat } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { geofenceAndRouteReport } from '@/ai/flows/geofence-and-route-reports';
import type { ReportFormValues } from './new-report/page';
import { zones } from '@/lib/data';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

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
        title: 'Syncing Offline Reports',
        description: `Found ${offlineReports.length} report(s) to submit.`,
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
          title: 'Offline Reports Submitted',
          description: `${submittedReports.length} report(s) were successfully submitted.`,
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
  }, [toast]);

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="SOS">
                    <Link href="/dashboard/sos"><Siren /><span>SOS</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="My Reports">
                <Link href="/dashboard/my-reports"><FileText /><span>My Reports</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="New Report">
                <Link href="/dashboard/new-report"><PlusCircle /><span>New Report</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Live Stream">
                    <Link href="/dashboard/live/report-123"><Video /><span>Live Stream</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Volunteer Tasks">
                <Link href="/dashboard/tasks"><Handshake /><span>Volunteer Tasks</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Community Resources">
                  <Link href="/dashboard/resources"><HeartHandshake /><span>Community Resources</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Barter Board">
                  <Link href="/dashboard/barter"><Repeat /><span>Barter Board</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Emotional Support">
                  <Link href="/dashboard/support"><BrainCircuit /><span>Emotional Support</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Missing Persons">
                  <Link href="/dashboard/missing-persons"><Users /><span>Missing Persons</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Knowledge Base">
                <Link href="/kb"><BookOpen /><span>Knowledge Base</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="My Profile">
                <Link href="/dashboard/profile"><User /><span>My Profile</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
