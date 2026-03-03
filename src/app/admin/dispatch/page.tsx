
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerTask } from '@/lib/types';
import { TaskStatus } from '@/lib/types';
import { Megaphone, PlusCircle, Users, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocalizationContext';
import { getVolunteerTasks, broadcastTask } from '@/actions/tasks';

export default function DispatchCenterPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    location: '',
    volunteersNeeded: 1,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
        const data = await getVolunteerTasks();
        setTasks(data as any);
        setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleBroadcastTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.location) {
        toast({ title: t('admin.dispatch.error.missingFields'), description: t('admin.dispatch.error.missingFieldsDescription'), variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
        await broadcastTask({
            ...newTask,
            requiredSkills: newTask.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
        });

        toast({
            title: t('admin.dispatch.success.taskBroadcasted'),
            description: t('admin.dispatch.success.taskBroadcastedDescription', { title: newTask.title })
        });
        
        // Reset form and refresh list
        setNewTask({ title: '', description: '', requiredSkills: '', location: '', volunteersNeeded: 1 });
        const data = await getVolunteerTasks();
        setTasks(data as any);
    } catch (error) {
        toast({ title: "Error", description: "Failed to broadcast task.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t('admin.dispatch.title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.dispatch.activeTasksTitle')}</CardTitle>
                        <CardDescription>{t('admin.dispatch.activeTasksDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('admin.dispatch.tableTask')}</TableHead>
                                    <TableHead>{t('admin.dispatch.tableStatus')}</TableHead>
                                    <TableHead>{t('admin.dispatch.tableVolunteers')}</TableHead>
                                    <TableHead>{t('admin.dispatch.tableLocation')}</TableHead>
                                    <TableHead>{t('admin.dispatch.tableCreated')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">{task.requiredSkills.join(', ') || t('admin.dispatch.noSpecificSkills')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={task.status === TaskStatus.Open ? 'secondary' : 'default'}
                                                className={cn({
                                                    'bg-yellow-100 text-yellow-800': task.status === TaskStatus.InProgress,
                                                    'bg-green-100 text-green-800': task.status === TaskStatus.Completed,
                                                })}
                                            >
                                                {task.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            {task.volunteers.length} / {task.volunteersNeeded}
                                        </TableCell>
                                        <TableCell>{task.location}</TableCell>
                                        <TableCell>{formatDate(task.createdAt, 'PP')}</TableCell>
                                    </TableRow>
                                ))}
                                {tasks.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No active tasks found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.dispatch.broadcastTaskTitle')}</CardTitle>
                        <CardDescription>{t('admin.dispatch.broadcastTaskDescription')}</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleBroadcastTask}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t('admin.dispatch.taskTitleLabel')}</Label>
                                <Input id="title" name="title" value={newTask.title} onChange={handleInputChange} placeholder={t('admin.dispatch.taskTitlePlaceholder')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">{t('admin.dispatch.descriptionLabel')}</Label>
                                <Textarea id="description" name="description" value={newTask.description} onChange={handleInputChange} placeholder={t('admin.dispatch.descriptionPlaceholder')} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="location">{t('admin.dispatch.locationLabel')}</Label>
                                <Input id="location" name="location" value={newTask.location} onChange={handleInputChange} placeholder={t('admin.dispatch.locationPlaceholder')} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="requiredSkills">{t('admin.dispatch.requiredSkillsLabel')}</Label>
                                    <Input id="requiredSkills" name="requiredSkills" value={newTask.requiredSkills} onChange={handleInputChange} placeholder={t('admin.dispatch.requiredSkillsPlaceholder')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="volunteersNeeded">{t('admin.dispatch.volunteersNeededLabel')}</Label>
                                    <Input id="volunteersNeeded" name="volunteersNeeded" type="number" min="1" value={newTask.volunteersNeeded} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2" />}
                                {t('admin.dispatch.broadcastButton')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    </div>
  )
}
