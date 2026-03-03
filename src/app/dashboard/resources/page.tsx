
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
import { useTranslation } from '@/context/LocalizationContext';
import { getAllResources } from '@/actions/resources';

export default function CommunityResourcesPage() {
    const { t } = useTranslation();
    const [allResources, setAllResources] = useState<CommunityResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getAllResources();
            setAllResources(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className='flex items-center gap-3'>
                    <HeartHandshake className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">{t('citizen.resources.title')}</h1>
                </div>
                <Button asChild>
                    <Link href="/dashboard/resources/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('citizen.resources.newButton')}
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground">
                {t('citizen.resources.description')}
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
                                        <span>User ID: {resource.userId}</span>
                                    </div>
                               </div>
                            </CardContent>
                            <CardContent>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {t('citizen.resources.showOnMap')}
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
                                    {t('citizen.resources.postedOn', { date: formatDate(resource.timestamp, 'PP') })}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">{t('citizen.resources.emptyTitle')}</h3>
                    <p className="text-muted-foreground mt-2 mb-4">{t('citizen.resources.emptyDescription')}</p>
                </div>
            )}
        </div>
    );
}
