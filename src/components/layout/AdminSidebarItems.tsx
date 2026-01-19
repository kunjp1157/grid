
"use client";

import { useTranslation } from '@/context/LocalizationContext';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Files, Map, BarChart, User, BookOpen, ShieldCheck, Megaphone } from 'lucide-react';

export function AdminSidebarItems() {
    const { t } = useTranslation();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.dashboard')}>
                <Link href="/admin"><LayoutDashboard /><span>{t('admin.sidebar.dashboard')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.overview')}>
                <Link href="/admin/overview"><BarChart /><span>{t('admin.sidebar.overview')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.allReports')}>
                <Link href="/admin/reports"><Files /><span>{t('admin.sidebar.allReports')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.dispatchCenter')}>
                <Link href="/admin/dispatch"><Megaphone /><span>{t('admin.sidebar.dispatchCenter')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.rumorControl')}>
                <Link href="/admin/rumor-control"><ShieldCheck /><span>{t('admin.sidebar.rumorControl')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.manageZones')}>
                <Link href="/admin/zones"><Map /><span>{t('admin.sidebar.manageZones')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.knowledgeBase')}>
                <Link href="/kb"><BookOpen /><span>{t('admin.sidebar.knowledgeBase')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('admin.sidebar.myProfile')}>
                <Link href="/admin/profile"><User /><span>{t('admin.sidebar.myProfile')}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
