
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { barterPosts as initialPosts, users } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PlusCircle, User, Repeat, ArrowRightLeft, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function BarterBoardPage() {
    const { toast } = useToast();
    
    const getUser = (userId: string) => {
        return users.find(u => u.id === userId);
    }
    
    const handleConnect = (userName: string) => {
        toast({
            title: "Connection Request Sent (Simulated)",
            description: `A notification has been sent to ${userName} to connect and coordinate the exchange.`,
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className='flex items-center gap-3'>
                    <Repeat className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Barter Board</h1>
                </div>
                <Button asChild>
                    <Link href="/dashboard/barter/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Post
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground">
                Exchange essential goods and services with your community members.
            </p>

            {initialPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {initialPosts.map(post => {
                        const user = getUser(post.userId);
                        const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';
                        
                        return (
                            <Card key={post.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                         <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                                            <AvatarFallback>{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{user?.name || 'Unknown User'}</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                Posted {formatDate(post.timestamp, 'PP')}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                   <div>
                                        <h3 className="text-sm font-semibold text-green-600">HAVE:</h3>
                                        <p className="text-muted-foreground text-sm">{post.have}</p>
                                   </div>
                                   <Separator />
                                   <div>
                                        <h3 className="text-sm font-semibold text-orange-600">NEED:</h3>
                                        <p className="text-muted-foreground text-sm">{post.need}</p>
                                   </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline" onClick={() => handleConnect(user?.name || 'the user')}>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Connect to Exchange
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">The Barter Board is Empty</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Be the first to create an exchange post.</p>
                     <Button asChild>
                        <Link href="/dashboard/barter/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Post
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
