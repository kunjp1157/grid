
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
import { tasks as initialTasks, users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerTask, User } from '@/lib/types';
import { TaskStatus } from '@/lib/types';
import { Handshake, Users, MapPin, Check, PlusCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function VolunteerTasksPage() {
  const [tasks, setTasks] = useState<VolunteerTask[]>(initialTasks);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would come from a context or auth hook
    const user = users.find(u => u.id === 'citizen1');
    setCurrentUser(user || null);
  }, []);

  const handleAcceptTask = (taskId: string) => {
    if (!currentUser || !currentUser.isVolunteer) {
      toast({ title: 'Not a Volunteer', description: "Please register as a volunteer in your profile to accept tasks.", variant: 'destructive' });
      return;
    }

    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
            if (task.volunteers.some(v => v.userId === currentUser.id)) {
                toast({ title: 'Already Accepted', description: "You have already accepted this task." });
                return task;
            }
            if (task.volunteers.length >= task.volunteersNeeded) {
                 toast({ title: 'Task Full', description: "This task already has enough volunteers.", variant: 'destructive' });
                 return task;
            }
            toast({ title: 'Task Accepted!', description: `You have signed up for "${task.title}".` });
            return {
                ...task,
                volunteers: [...task.volunteers, { userId: currentUser.id, name: currentUser.name }],
                status: task.volunteers.length + 1 === task.volunteersNeeded ? TaskStatus.InProgress : task.status,
            };
        }
        return task;
    }));
  };

  const hasAccepted = (task: VolunteerTask) => {
    return currentUser ? task.volunteers.some(v => v.userId === currentUser.id) : false;
  }

  const openTasks = tasks.filter(t => t.status === TaskStatus.Open || t.status === TaskStatus.InProgress);

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className='flex items-center gap-3'>
                <Handshake className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Volunteer Task Board</h1>
            </div>
            {!currentUser?.isVolunteer && (
                 <Button asChild>
                    <Link href="/dashboard/profile">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Become a Volunteer
                    </Link>
                </Button>
            )}
        </div>
        <CardDescription>Browse and accept volunteer opportunities to help your community.</CardDescription>
        
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
                                    <Badge variant="outline">No specific skills required</Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{task.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{task.volunteers.length} / {task.volunteersNeeded} volunteers</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-2">
                             <Button 
                                className="w-full" 
                                onClick={() => handleAcceptTask(task.id)}
                                disabled={hasAccepted(task) || task.volunteers.length >= task.volunteersNeeded}
                            >
                                {hasAccepted(task) ? <><Check className="mr-2"/>Accepted</> : 'Accept Task'}
                             </Button>
                             <p className="text-xs text-muted-foreground text-center w-full">Posted on {formatDate(task.createdAt, 'PP')}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No Open Tasks</h3>
                <p className="text-muted-foreground mt-2">
                    There are currently no open volunteer tasks. Check back later!
                </p>
            </div>
        )}
    </div>
  )
}
