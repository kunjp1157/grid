
"use client";

import { useState } from 'react';
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
import { tasks as initialTasks, users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerTask } from '@/lib/types';
import { TaskStatus } from '@/lib/types';
import { Megaphone, PlusCircle, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function DispatchCenterPage() {
  const [tasks, setTasks] = useState<VolunteerTask[]>(initialTasks);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    location: '',
    volunteersNeeded: 1,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleBroadcastTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.location) {
        toast({ title: "Missing Fields", description: "Please fill out all required fields.", variant: "destructive" });
        return;
    }

    const task: VolunteerTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      requiredSkills: newTask.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      location: newTask.location,
      volunteersNeeded: Number(newTask.volunteersNeeded),
      status: TaskStatus.Open,
      volunteers: [],
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [task, ...prev]);
    toast({
        title: "Task Broadcasted!",
        description: `The task "${task.title}" is now available for volunteers.`
    });
    
    // Reset form
    setNewTask({ title: '', description: '', requiredSkills: '', location: '', volunteersNeeded: 1 });
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Volunteer Dispatch Center</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Tasks</CardTitle>
                        <CardDescription>Monitor and manage ongoing volunteer tasks.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Volunteers</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">{task.requiredSkills.join(', ') || 'No specific skills'}</p>
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
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Broadcast New Task</CardTitle>
                        <CardDescription>Create a new task to dispatch volunteers.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleBroadcastTask}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Task Title</Label>
                                <Input id="title" name="title" value={newTask.title} onChange={handleInputChange} placeholder="e.g., Sandbagging near River" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={newTask.description} onChange={handleInputChange} placeholder="Detailed instructions for volunteers" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" value={newTask.location} onChange={handleInputChange} placeholder="e.g., Central Community Shelter" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="requiredSkills">Required Skills</Label>
                                    <Input id="requiredSkills" name="requiredSkills" value={newTask.requiredSkills} onChange={handleInputChange} placeholder="e.g., Medical, Driving" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
                                    <Input id="volunteersNeeded" name="volunteersNeeded" type="number" min="1" value={newTask.volunteersNeeded} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                <PlusCircle className="mr-2" />
                                Broadcast Task
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    </div>
  )
}
