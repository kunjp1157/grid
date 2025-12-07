"use client";

import { Building2 } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { useTranslation } from '@/context/LocalizationContext';

export const Logo = (props: LucideProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2" >
        <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <Building2 {...props} />
        </div>
         <span className="font-bold text-lg">{t('appName')}</span>
    </div>
  );
};
