
'use client';

import { articles, KBArticle } from '@/lib/kb';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslation } from '@/context/LocalizationContext';

export default function KnowledgeBasePage() {
    const { t } = useTranslation();

    const articlesByCategory = articles.reduce((acc, article) => {
        if (!acc[article.category]) {
            acc[article.category] = [];
        }
        acc[article.category].push(article);
        return acc;
    }, {} as Record<string, KBArticle[]>);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">
                Find quick guides and information for emergency situations.
            </p>

            {Object.entries(articlesByCategory).map(([category, articles]) => (
                 <div key={category}>
                    <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                    <Accordion type="single" collapsible className="w-full">
                       {articles.map((article) => (
                         <AccordionItem value={article.slug} key={article.slug}>
                           <AccordionTrigger>{article.title}</AccordionTrigger>
                           <AccordionContent>
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                                {article.content}
                            </div>
                           </AccordionContent>
                         </AccordionItem>
                       ))}
                    </Accordion>
                 </div>
            ))}
        </div>
    );
}
