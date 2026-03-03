
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PlusCircle, Repeat, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/context/LocalizationContext';
import { getBarterPosts } from '@/actions/barter';

export default function BarterBoardPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getBarterPosts();
            setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);
    
    const handleConnect = (userName: string) => {
        toast({
            title: t('citizen.barter.success.connectedTitle'),
            description: t('citizen.barter.success.connectedDescription', { name: userName }),
        });
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className='flex items-center gap-3'>
                    <Repeat className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">{t('citizen.barter.title')}</h1>
                </div>
                <Button asChild>
                    <Link href="/dashboard/barter/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('citizen.barter.newPostButton')}
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground">
                {t('citizen.barter.description')}
            </p>

            {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {posts.map(post => {
                        const userInitials = post.userName?.split(' ').map((n:any) => n[0]).join('') || 'U';
                        
                        return (
                            <Card key={post.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                         <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://avatar.vercel.sh/${post.userEmail}.png`} alt={post.userName} />
                                            <AvatarFallback>{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{post.userName || t('common.unknownUser')}</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {t('citizen.barter.postedOn', { date: formatDate(post.timestamp, 'PP')})}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                   <div>
                                        <h3 className="text-sm font-semibold text-green-600">{t('citizen.barter.new.haveLabel')}</h3>
                                        <p className="text-muted-foreground text-sm">{post.have}</p>
                                   </div>
                                   <Separator />
                                   <div>
                                        <h3 className="text-sm font-semibold text-orange-600">{t('citizen.barter.new.needLabel')}</h3>
                                        <p className="text-muted-foreground text-sm">{post.need}</p>
                                   </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline" onClick={() => handleConnect(post.userName || t('common.unknownUser'))}>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        {t('citizen.barter.connectButton')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">{t('citizen.barter.emptyTitle')}</h3>
                    <p className="text-muted-foreground mt-2 mb-4">{t('citizen.barter.emptyDescription')}</p>
                     <Button asChild>
                        <Link href="/dashboard/barter/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('citizen.barter.newPostButton')}
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
