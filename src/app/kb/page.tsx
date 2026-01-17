
'use client';

import { useState, useMemo } from 'react';
import { articles } from '@/lib/kb';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HeartPulse, ShieldCheck, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocalizationContext';

type Category = 'First Aid' | 'Emergency Preparedness';

const categoryConfig: Record<Category, { icon: React.ElementType, iconColor: string, gradient: string }> = {
    'First Aid': {
        icon: HeartPulse,
        iconColor: 'text-red-500',
        gradient: 'from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30'
    },
    'Emergency Preparedness': {
        icon: ShieldCheck,
        iconColor: 'text-blue-500',
        gradient: 'from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30'
    },
};

export default function KnowledgeBasePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    const translatedArticles = useMemo(() => {
        return articles.map(article => ({
            ...article,
            title: t(`kb.${article.slug}.title`),
            content: t(`kb.${article.slug}.content`),
        }));
    }, [t]);

    const filteredArticles = useMemo(() => {
        if (!searchTerm) {
            return translatedArticles;
        }
        return translatedArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, translatedArticles]);

    const articlesByCategory = useMemo(() => {
        return filteredArticles.reduce((acc, article) => {
            const category = article.category as Category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(article);
            return acc;
        }, {} as Record<Category, typeof translatedArticles>);
    }, [filteredArticles]);


    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">{t('kb.title')}</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    {t('kb.subtitle')}
                </p>
            </div>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                  placeholder={t('kb.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
              />
            </div>

            <div className="grid gap-8 md:grid-cols-1">
                {Object.entries(articlesByCategory).map(([category, articles]) => {
                    if (articles.length === 0) return null;
                    const config = categoryConfig[category as Category];
                    const CategoryIcon = config.icon;
                    return (
                        <Card key={category} className={cn("bg-gradient-to-br overflow-hidden shadow-lg", config.gradient)}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    {CategoryIcon && <CategoryIcon className={cn("h-8 w-8", config.iconColor)} />}
                                    {t(`kb.category.${category.replace(/\s/g, '')}`)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {articles.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full">
                                    {articles.map((article) => (
                                        <AccordionItem value={article.slug} key={article.slug} className="bg-background/50 border-border/50 rounded-lg mb-2">
                                        <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline text-left">
                                            {article.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4">
                                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap pt-2 border-t border-border/30">
                                                {article.content}
                                            </div>
                                        </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    </Accordion>
                                ) : (
                                    <p className="text-muted-foreground text-sm">{t('kb.noResults')}</p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
             {filteredArticles.length === 0 && searchTerm && (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold">{t('kb.noResults')}</h3>
                    <p className="text-muted-foreground mt-2">
                        {t('kb.noResultsDescription')}
                    </p>
                </div>
            )}
        </div>
    );
}
