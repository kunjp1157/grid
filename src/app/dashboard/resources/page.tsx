
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resources as initialResources, users } from '@/lib/data'; // Mock data
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PlusCircle, User, MapPin, HeartHandshake } from 'lucide-react';
import { ReportTypeIcon } from '@/components/shared/ReportTypeIcon';
import type { CommunityResource } from '@/lib/types';
import { LocationMap } from '@/components/shared/LocationMap';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function CommunityResourcesPage() {
    const [allResources, setAllResources] = useState<CommunityResource[]>(initialResources);

    useEffect(() => {
        const storedResources: CommunityResource[] = JSON.parse(localStorage.getItem('community_resources') || '[]');
        // Combine initial data with stored data, ensuring no duplicates by ID
        const combined = [...storedResources, ...initialResources];
        const unique = combined.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
        setAllResources(unique);
    }, []);
    
    const getUserName = (userId: string) => {
        return users.find(u => u.id === userId)?.name || 'Unknown User';
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className='flex items-center gap-3'>
                    <HeartHandshake className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Community Resources</h1>
                </div>
                <Button asChild>
                    <Link href="/dashboard/resources/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Offer a Resource
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground">
                A list of resources being offered by fellow community members to help during the crisis.
            </p>

            {allResources.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allResources.map(resource => (
                        <Card key={resource.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <ReportTypeIcon type={resource.type} className="h-6 w-6 text-muted-foreground" />
                                    {resource.type}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                               <p className="text-muted-foreground">{resource.description}</p>
                               <div className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>Offered by: {getUserName(resource.userId)}</span>
                                    </div>
                               </div>
                            </CardContent>
                            <CardContent>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                Show on Map
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <LocationMap latitude={resource.location.lat} longitude={resource.location.lng} title=''/>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Posted on {formatDate(resource.timestamp, 'PP')}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No Community Resources Yet</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Be the first to offer help to your community.</p>
                </div>
            )}
        </div>
    );
}
