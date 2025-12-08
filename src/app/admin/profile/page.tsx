
"use client";

import { useEffect, useState, useMemo } from 'react';
import type { User, Report } from '@/lib/types';
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
import { zones, reports } from '@/lib/data';
import { ReportStatus } from '@/lib/types';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export default function AdminProfilePage() {
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
    if (!user) return { totalAssigned: 0, resolvedByYou: 0, overdue: 0 };
    
    const assignedReports = reports.filter(r => r.assignedAdminId === user.id);
    
    return {
      totalAssigned: assignedReports.length,
      resolvedByYou: assignedReports.filter(r => r.status === ReportStatus.Resolved).length,
      overdue: assignedReports.filter(r => r.status === ReportStatus.Overdue).length,
    }
  }, [user]);


  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';
  const zoneName = user?.zoneId ? zones.find(z => z.id === user.zoneId)?.name : null;

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
                {user.role === 'admin' && zoneName && (
                <>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Assigned Zone</span>
                        <span className="font-medium">{zoneName}</span>
                    </li>
                </>
                )}
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
                            <span className="text-sm font-medium">Total Assigned</span>
                        </div>
                        <span className="text-lg font-bold">{userStats.totalAssigned}</span>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className='flex items-center gap-3'>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium">Resolved by You</span>
                        </div>
                        <span className="text-lg font-bold">{userStats.resolvedByYou}</span>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className='flex items-center gap-3'>
                            <Clock className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-medium">Overdue Reports</span>
                        </div>
                        <span className="text-lg font-bold">{userStats.overdue}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
