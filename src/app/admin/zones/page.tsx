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


export default function ManageZonesPage() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [newZoneName, setNewZoneName] = useState('');
  const { toast } = useToast();

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZoneName.trim() === '') {
      toast({
        title: 'Error',
        description: 'Zone name cannot be empty.',
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
      title: 'Success',
      description: `Zone "${newZone.name}" has been added.`,
    });
  };
  
  const handleDeleteZone = (zoneId: string) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    toast({
        title: "Zone Deleted",
        description: "The zone has been removed.",
        variant: "destructive"
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Zones</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>All Zones</CardTitle>
                <CardDescription>View and manage all available operational zones.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Zone ID</TableHead>
                        <TableHead>Zone Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                        <span className="sr-only">Delete Zone</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the zone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteZone(zone.id)}>
                                        Continue
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
              <CardTitle>Add New Zone</CardTitle>
              <CardDescription>Create a new operational zone.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddZone}>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="zone-name">Zone Name</Label>
                  <Input
                    id="zone-name"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    placeholder="e.g., Central District"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Add Zone</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
