
"use client";

import { useEffect, useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { reports } from '@/lib/data';
import { ReportStatus } from '@/lib/types';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export default function CitizenProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    loadUser();
  }, []);

  const userStats = useMemo(() => {
    if (!user) return { total: 0, resolved: 0, pending: 0 };
    
    const userReports = reports.filter(r => r.userId === user.id);
    const resolvedCount = userReports.filter(r => r.status === ReportStatus.Resolved).length;
    const pendingCount = userReports.length - resolvedCount;
    
    return {
      total: userReports.length,
      resolved: resolvedCount,
      pending: pendingCount,
    }
  }, [user]);

  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="grid gap-6 md:grid-cols-3">
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">{user.id}</span>
              </li>
              <Separator />
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">Role</span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                  {user.role}
                </Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>My Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className='flex items-center gap-3'>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">Total Reports</span>
                      </div>
                      <span className="text-lg font-bold">{userStats.total}</span>
                  </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className='flex items-center gap-3'>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium">Resolved</span>
                      </div>
                      <span className="text-lg font-bold">{userStats.resolved}</span>
                  </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className='flex items-center gap-3'>
                          <Clock className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-medium">Pending</span>
                      </div>
                      <span className="text-lg font-bold">{userStats.pending}</span>
                  </div>
              </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
