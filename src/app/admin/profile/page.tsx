"use client";

import { useEffect, useState } from 'react';
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

  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card className="w-full max-w-2xl mx-auto">
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
            {user.role === 'admin' && user.zoneId && (
              <>
                <Separator />
                <li className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Zone</span>
                    <span className="font-medium">{user.zoneId}</span>
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
