
"use client";

import { useEffect, useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { reports } from '@/lib/data';
import { ReportStatus } from '@/lib/types';
import { FileText, CheckCircle, Clock, Phone, Home, MapPin, Pencil, Heart, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function CitizenProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setEditableUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    loadUser();
  }, []);

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditableUser(user); // Reset any stale edits
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableUser) {
      setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    }
  };

  const handleSaveChanges = () => {
    setUser(editableUser);
    setIsEditing(false);
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved. (Note: This is a simulation and will not persist after a page refresh).",
    });
  };

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

  if (!user || !editableUser) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
             <Button variant="outline" onClick={handleEditToggle}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
            </Button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                 {isEditing ? (
                  <div className="space-y-2">
                     <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={editableUser.name} onChange={handleInputChange} className="text-2xl font-bold h-auto p-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                ) : (
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                )}
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
             {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="mobile" className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> Mobile</Label>
                        <Input id="mobile" name="mobile" value={editableUser.mobile || ''} onChange={handleInputChange} placeholder="Enter mobile number" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2 text-muted-foreground"><Home className="h-4 w-4" /> Address</Label>
                        <Input id="address" name="address" value={editableUser.address || ''} onChange={handleInputChange} placeholder="Enter full address" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pincode" className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> PIN Code</Label>
                        <Input id="pincode" name="pincode" value={editableUser.pincode || ''} onChange={handleInputChange} placeholder="Enter PIN code" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bloodGroup" className="flex items-center gap-2 text-muted-foreground"><Heart className="h-4 w-4" /> Blood Group</Label>
                        <Input id="bloodGroup" name="bloodGroup" value={editableUser.bloodGroup || ''} onChange={handleInputChange} placeholder="e.g., O+" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="emergencyContactName" className="flex items-center gap-2 text-muted-foreground"><ShieldAlert className="h-4 w-4" /> Emergency Contact</Label>
                        <Input id="emergencyContactName" name="emergencyContactName" value={editableUser.emergencyContactName || ''} onChange={handleInputChange} placeholder="Contact name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="emergencyContactNumber" className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> Emergency Contact No.</Label>
                        <Input id="emergencyContactNumber" name="emergencyContactNumber" value={editableUser.emergencyContactNumber || ''} onChange={handleInputChange} placeholder="Contact number" />
                    </div>
                </div>
            ) : (
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> Mobile</span>
                    <span>{user.mobile || 'N/A'}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" /> Address</span>
                    <span className='text-right'>{user.address || 'N/A'}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> PIN Code</span>
                    <span>{user.pincode || 'N/A'}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Heart className="h-4 w-4" /> Blood Group</span>
                        <span>{user.bloodGroup || 'N/A'}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Emergency Contact</span>
                        <span>{user.emergencyContactName || 'N/A'} ({user.emergencyContactNumber || 'N/A'})</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between items-center">
                        <span className="text-muted-foreground">Role</span>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                        {user.role}
                        </Badge>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">User ID</span>
                        <span className="font-mono text-xs">{user.id}</span>
                    </li>
                </ul>
            )}
          </CardContent>
           {isEditing && (
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" onClick={handleEditToggle}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            )}
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
