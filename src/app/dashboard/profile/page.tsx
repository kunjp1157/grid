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
import { ReportStatus } from '@/lib/types';
import { FileText, CheckCircle, Clock, Phone, Home, MapPin, Pencil, Mail, Heart, ShieldAlert, Stethoscope, HandHeart, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { MedicalIdQrCode } from '@/components/shared/MedicalIdQrCode';
import { useTranslation } from '@/context/LocalizationContext';
import { updateUserProfile } from '@/actions/auth';
import { getUserReports } from '@/actions/reports';

export default function CitizenProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reportStats, setReportStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          // Fetch full data from DB to ensure we have all fields
          const [dbUserRows]: any = await fetch(`/api/user/full?id=${userData.id}`).then(r => r.json());
          const fullUser = dbUserRows || userData;
          
          setUser(fullUser);
          setEditableUser(JSON.parse(JSON.stringify(fullUser)));

          // Load stats
          const reports = await getUserReports(userData.id);
          const resolvedCount = reports.filter((r: any) => r.status === ReportStatus.Resolved).length;
          setReportStats({
            total: reports.length,
            resolved: resolvedCount,
            pending: reports.length - resolvedCount
          });
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    loadUser();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditableUser(JSON.parse(JSON.stringify(user))); // Reset changes on cancel
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editableUser) {
      setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    }
  };

  const handleBecomeVolunteer = () => {
     if (editableUser) {
      setEditableUser({ ...editableUser, isVolunteer: true });
    }
  }

  const handleSaveChanges = async () => {
    if (!editableUser) return;
    setIsSaving(true);
    try {
        await updateUserProfile(editableUser);
        setUser(editableUser);
        setIsEditing(false);
        toast({
            title: t('profile.success.profileUpdated'),
            description: "Your profile has been successfully saved to the database.",
        });
    } catch (error) {
        toast({
            title: "Update Failed",
            description: "There was an error saving your changes to the database.",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
  };

  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';

  if (!user || !editableUser) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('citizen.profile.title')}</h1>
        {!isEditing && (
             <Button variant="outline" onClick={handleEditToggle}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('profile.editButton')}
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
                     <Label htmlFor="name">{t('profile.nameLabel')}</Label>
                    <Input id="name" name="name" value={editableUser.name} onChange={handleInputChange} className="text-2xl font-bold h-auto border-b" />
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
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {t('profile.emailLabel')}</Label>
                            <Input id="email" name="email" type="email" value={editableUser.email} onChange={handleInputChange} placeholder={t('profile.emailPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile" className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {t('profile.mobileLabel')}</Label>
                            <Input id="mobile" name="mobile" value={editableUser.mobile || ''} onChange={handleInputChange} placeholder={t('profile.mobilePlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="flex items-center gap-2 text-muted-foreground"><Home className="h-4 w-4" /> {t('profile.addressLabel')}</Label>
                            <Input id="address" name="address" value={editableUser.address || ''} onChange={handleInputChange} placeholder={t('profile.addressPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode" className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {t('profile.pincodeLabel')}</Label>
                            <Input id="pincode" name="pincode" value={editableUser.pincode || ''} onChange={handleInputChange} placeholder={t('profile.pincodePlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodGroup" className="flex items-center gap-2 text-muted-foreground"><Heart className="h-4 w-4" /> {t('profile.bloodGroupLabel')}</Label>
                            <Input id="bloodGroup" name="bloodGroup" value={editableUser.bloodGroup || ''} onChange={handleInputChange} placeholder={t('profile.bloodGroupPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName" className="flex items-center gap-2 text-muted-foreground"><ShieldAlert className="h-4 w-4" /> {t('profile.emergencyContactLabel')}</Label>
                            <Input id="emergencyContactName" name="emergencyContactName" value={editableUser.emergencyContactName || ''} onChange={handleInputChange} placeholder={t('profile.emergencyContactPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactNumber" className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {t('profile.emergencyContactNumberLabel')}</Label>
                            <Input id="emergencyContactNumber" name="emergencyContactNumber" value={editableUser.emergencyContactNumber || ''} onChange={handleInputChange} placeholder={t('profile.emergencyContactNumberPlaceholder')} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="medicalConditions" className="flex items-center gap-2 text-muted-foreground"><Stethoscope className="h-4 w-4" /> {t('profile.medicalConditionsLabel')}</Label>
                        <Textarea id="medicalConditions" name="medicalConditions" value={editableUser.medicalConditions || ''} onChange={handleInputChange} placeholder={t('profile.medicalConditionsPlaceholder')} />
                    </div>
                </div>
            ) : (
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> {t('profile.mobileLabel')}</span>
                        <span>{user.mobile || t('common.na')}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" /> {t('profile.addressLabel')}</span>
                        <span className='text-right'>{user.address || t('common.na')}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> {t('profile.pincodeLabel')}</span>
                        <span>{user.pincode || t('common.na')}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Heart className="h-4 w-4" /> {t('profile.bloodGroupLabel')}</span>
                        <span>{user.bloodGroup || t('common.na')}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> {t('profile.emergencyContactLabel')}</span>
                        <span>{user.emergencyContactName || t('common.na')} ({user.emergencyContactNumber || t('common.na')})</span>
                    </li>
                     <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Stethoscope className="h-4 w-4" /> {t('profile.medicalConditionsLabel')}</span>
                        <span className='text-right'>{user.medicalConditions || t('common.na')}</span>
                    </li>
                    <Separator />
                    <li className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('profile.roleLabel')}</span>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                        {user.role}
                        </Badge>
                    </li>
                    <Separator />
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">{t('profile.userIdLabel')}</span>
                        <span className="font-mono text-xs">{user.id}</span>
                    </li>
                </ul>
            )}
          </CardContent>
           {isEditing && (
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" onClick={handleEditToggle} disabled={isSaving}>{t('profile.cancelButton')}</Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('profile.saveButton')}
                    </Button>
                </CardFooter>
            )}
        </Card>

        <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>{t('citizen.profile.statsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className='flex items-center gap-3'>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{t('citizen.profile.totalReports')}</span>
                      </div>
                      <span className="text-lg font-bold">{reportStats.total}</span>
                  </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className='flex items-center gap-3'>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium">{t('citizen.profile.resolved')}</span>
                      </div>
                      <span className="text-lg font-bold">{reportStats.resolved}</span>
                  </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className='flex items-center gap-3'>
                          <Clock className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-medium">{t('citizen.profile.pending')}</span>
                      </div>
                      <span className="text-lg font-bold">{reportStats.pending}</span>
                  </div>
              </CardContent>
          </Card>

            <MedicalIdQrCode user={user} />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HandHeart /> {t('profile.volunteerStatusTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        {editableUser.isVolunteer ? (
                             <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <Award className="h-5 w-5" />
                                    <p className="font-semibold">{t('profile.isVolunteer')}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skills">{t('profile.skillsLabel')}</Label>
                                    <Input id="skills" name="skills" value={(editableUser.skills || []).join(', ')} onChange={(e) => setEditableUser({...editableUser, skills: e.target.value.split(',').map(s => s.trim())})} placeholder={t('profile.skillsPlaceholder')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="certifications">{t('profile.certificationsLabel')}</Label>
                                    <Input id="certifications" name="certifications" value={editableUser.certifications || ''} onChange={handleInputChange} placeholder={t('profile.certificationsPlaceholder')} />
                                </div>
                             </div>
                        ) : (
                            <div className='text-center'>
                               <p className="text-sm text-muted-foreground mb-4">{t('profile.volunteerPrompt')}</p>
                               <Button onClick={handleBecomeVolunteer}>{t('profile.becomeVolunteerButton')}</Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {user.isVolunteer ? (
                             <div className="space-y-3">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('profile.volunteerBadge')}</Badge>
                                 <p className="text-sm"><strong className="text-muted-foreground">{t('profile.skillsDisplayLabel')}:</strong> {user.skills?.join(', ') || t('profile.notSpecified')}</p>
                                 <p className="text-sm"><strong className="text-muted-foreground">{t('profile.certificationsDisplayLabel')}:</strong> {user.certifications || t('profile.none')}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t('profile.notVolunteer')}</p>
                        )}
                    </div>
                )}
                </CardContent>
            </Card>

        </div>

      </div>
    </div>
  );
}
