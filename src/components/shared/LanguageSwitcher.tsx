"use client";

import { useTranslation } from '@/context/LocalizationContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe } from 'lucide-react';
import { languages } from '@/context/LocalizationContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ScrollArea className="h-72 w-48">
            {Object.entries(languages).map(([code, name]) => (
                <DropdownMenuItem key={code} onClick={() => setLanguage(code)} disabled={language === code}>
                    {name}
                </DropdownMenuItem>
            ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
