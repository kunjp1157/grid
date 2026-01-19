
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zones as initialZones } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { Zone } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTranslation } from '@/context/LocalizationContext';


export default function ManageZonesPage() {
  const { t } = useTranslation();
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [newZoneName, setNewZoneName] = useState('');
  const { toast } = useToast();

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZoneName.trim() === '') {
      toast({
        title: t('common.error'),
        description: t('admin.zones.error.nameEmpty'),
        variant: 'destructive',
      });
      return;
    }

    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
    };

    setZones([...zones, newZone]);
    setNewZoneName('');
    toast({
      title: t('admin.zones.success.zoneAdded', { name: newZone.name }),
    });
  };
  
  const handleDeleteZone = (zoneId: string) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    toast({
        title: t('admin.zones.success.zoneDeleted'),
        variant: "destructive"
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('admin.zones.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>{t('admin.zones.allZonesTitle')}</CardTitle>
                <CardDescription>{t('admin.zones.allZonesDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t('admin.zones.tableId')}</TableHead>
                        <TableHead>{t('admin.zones.tableName')}</TableHead>
                        <TableHead className="text-right">{t('admin.zones.tableActions')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {zones.map(zone => (
                        <TableRow key={zone.id}>
                        <TableCell className="font-mono text-xs">{zone.id}</TableCell>
                        <TableCell>{zone.name}</TableCell>
                        <TableCell className="text-right">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">{t('admin.zones.deleteAction')}</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('admin.zones.deleteDialog.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('admin.zones.deleteDialog.description')}
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>{t('admin.zones.deleteDialog.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteZone(zone.id)}>
                                        {t('admin.zones.deleteDialog.continue')}
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.zones.addZoneTitle')}</CardTitle>
              <CardDescription>{t('admin.zones.addZoneDescription')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddZone}>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="zone-name">{t('admin.zones.zoneNameLabel')}</Label>
                  <Input
                    id="zone-name"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    placeholder={t('admin.zones.zoneNamePlaceholder')}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">{t('admin.zones.addButton')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
