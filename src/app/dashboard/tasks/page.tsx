
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerTask, User } from '@/lib/types';
import { TaskStatus } from '@/lib/types';
import { Handshake, Users, MapPin, Check, PlusCircle, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/context/LocalizationContext';
import { getVolunteerTasks, acceptTask as acceptTaskAction } from '@/actions/tasks';

export default function VolunteerTasksPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [tasksData, userRes] = await Promise.all([
                getVolunteerTasks(),
                fetch('/api/user').then(r => r.ok ? r.json() : null)
            ]);
            setTasks(tasksData as any);
            setCurrentUser(userRes);
        } catch (error) {
            console.error("Error loading tasks:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleAcceptTask = async (taskId: string) => {
    if (!currentUser || !currentUser.isVolunteer) {
      toast({ title: t('citizen.tasks.error.notVolunteerTitle'), description: t('citizen.tasks.error.notVolunteerDescription'), variant: 'destructive' });
      return;
    }

    try {
        await acceptTaskAction(taskId);
        toast({ title: t('citizen.tasks.success.taskAcceptedTitle') });
        
        // Refresh tasks locally
        const updatedTasks = await getVolunteerTasks();
        setTasks(updatedTasks as any);
    } catch (error) {
        toast({ title: "Failed to accept task", variant: "destructive" });
    }
  };

  const hasAccepted = (task: VolunteerTask) => {
    return currentUser ? task.volunteers.some(v => v.userId === currentUser.id) : false;
  }

  const openTasks = tasks.filter(t => t.status === TaskStatus.Open || t.status === TaskStatus.InProgress);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className='flex items-center gap-3'>
                <Handshake className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">{t('citizen.tasks.title')}</h1>
            </div>
            {!currentUser?.isVolunteer && (
                 <Button asChild>
                    <Link href="/dashboard/profile">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('profile.becomeVolunteerButton')}
                    </Link>
                </Button>
            )}
        </div>
        <CardDescription>{t('citizen.tasks.description')}</CardDescription>
        
        {openTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openTasks.map(task => (
                    <Card key={task.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{task.title}</CardTitle>
                            <CardDescription>{task.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div>
                                {task.requiredSkills.length > 0 ? (
                                    task.requiredSkills.map(skill => <Badge key={skill} variant="secondary" className="mr-1">{skill}</Badge>)
                                ) : (
                                    <Badge variant="outline">{t('citizen.tasks.noSkills')}</Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{task.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{task.volunteers.length} / {task.volunteersNeeded} {t('citizen.tasks.volunteers')}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-2">
                             <Button 
                                className="w-full" 
                                onClick={() => handleAcceptTask(task.id)}
                                disabled={hasAccepted(task) || task.volunteers.length >= task.volunteersNeeded}
                            >
                                {hasAccepted(task) ? <><Check className="mr-2"/>{t('citizen.tasks.acceptedButton')}</> : t('citizen.tasks.acceptButton')}
                             </Button>
                             <p className="text-xs text-muted-foreground text-center w-full">{t('citizen.tasks.postedOn', { date: formatDate(task.createdAt, 'PP')})}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">{t('citizen.tasks.emptyTitle')}</h3>
                <p className="text-muted-foreground mt-2">
                    {t('citizen.tasks.emptyDescription')}
                </p>
            </div>
        )}
    </div>
  )
}
