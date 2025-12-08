
'use client';

import { useState, useMemo } from 'react';
import { articles, KBArticle } from '@/lib/kb';
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
import { HeartPulse, ShieldCheck } from 'lucide-react';

type Category = 'First Aid' | 'Emergency Preparedness';

const categoryIcons: Record<Category, React.ElementType> = {
    'First Aid': HeartPulse,
    'Emergency Preparedness': ShieldCheck,
};

export default function KnowledgeBasePage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => {
        if (!searchTerm) {
            return articles;
        }
        return articles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const articlesByCategory = filteredArticles.reduce((acc, article) => {
        const category = article.category as Category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(article);
        return acc;
    }, {} as Record<Category, KBArticle[]>);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Knowledge Base</h1>
                <p className="text-muted-foreground mt-1">
                    Find quick guides and information for emergency situations.
                </p>
            </div>

            <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
            />

            <div className="grid gap-8 md:grid-cols-1">
                {Object.entries(articlesByCategory).map(([category, articles]) => {
                    const CategoryIcon = categoryIcons[category as Category];
                    return (
                        <Card key={category}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    {CategoryIcon && <CategoryIcon className="h-6 w-6" />}
                                    {category}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {articles.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full">
                                    {articles.map((article) => (
                                        <AccordionItem value={article.slug} key={article.slug}>
                                        <AccordionTrigger>{article.title}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                                {article.content}
                                            </div>
                                        </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    </Accordion>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No articles found for this category.</p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
             {filteredArticles.length === 0 && searchTerm && (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold">No Results Found</h3>
                    <p className="text-muted-foreground mt-2">
                        No articles match your search term. Try a different keyword.
                    </p>
                </div>
            )}
        </div>
    );
}
