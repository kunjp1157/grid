
"use client";

import { useTranslation } from '@/context/LocalizationContext';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, PlusCircle, FileText, User, BookOpen, Video, Siren, HeartHandshake, Users, Handshake, Repeat } from 'lucide-react';

export function DashboardSidebarItems() {
    const { t } = useTranslation();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('citizen.sidebar.sos')}>
                    <Link href="/dashboard/sos"><Siren /><span>{t('citizen.sidebar.sos')}</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.dashboard')}>
                <Link href="/dashboard"><LayoutDashboard /><span>{t('citizen.sidebar.dashboard')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.myReports')}>
                <Link href="/dashboard/my-reports"><FileText /><span>{t('citizen.sidebar.myReports')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.newReport')}>
                <Link href="/dashboard/new-report"><PlusCircle /><span>{t('citizen.sidebar.newReport')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('citizen.sidebar.liveStream')}>
                    <Link href="/dashboard/live/report-123"><Video /><span>{t('citizen.sidebar.liveStream')}</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.volunteerTasks')}>
                <Link href="/dashboard/tasks"><Handshake /><span>{t('citizen.sidebar.volunteerTasks')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.communityResources')}>
                  <Link href="/dashboard/resources"><HeartHandshake /><span>{t('citizen.sidebar.communityResources')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.barterBoard')}>
                  <Link href="/dashboard/barter"><Repeat /><span>{t('citizen.sidebar.barterBoard')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.missingPersons')}>
                  <Link href="/dashboard/missing-persons"><Users /><span>{t('citizen.sidebar.missingPersons')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.knowledgeBase')}>
                <Link href="/kb"><BookOpen /><span>{t('citizen.sidebar.knowledgeBase')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('citizen.sidebar.myProfile')}>
                <Link href="/dashboard/profile"><User /><span>{t('citizen.sidebar.myProfile')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
