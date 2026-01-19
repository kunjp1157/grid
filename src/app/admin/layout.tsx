
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
import { AdminSidebarItems } from '@/components/layout/AdminSidebarItems';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <AdminSidebarItems />
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
