"use client";

import { useState } from 'react';
import { useActionState } from 'react';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { useTranslation } from '@/context/LocalizationContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import Link from 'next/link';

export default function SignupPage() {
  const { t } = useTranslation();
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [state, formAction] = useActionState(signup, undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
       <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('signup.nameLabel')}</Label>
              <Input id="name" name="name" type="text" placeholder={t('signup.namePlaceholder')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.emailLabel')}</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.passwordLabel')}</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-3">
              <Label>{t('signup.roleLabel')}</Label>
              <RadioGroup
                name="role"
                value={role}
                onValueChange={(value: 'citizen' | 'admin') => setRole(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="citizen" id="citizen" />
                  <Label htmlFor="citizen" className="font-normal">{t('login.roleCitizen')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="font-normal">{t('login.roleAdmin')}</Label>
                </div>
              </RadioGroup>
            </div>
            
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full !mt-8 bg-accent hover:bg-accent/90">
              {t('signup.submitButton')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
            <p>{t('signup.hasAccount')} <Link href="/" className="font-semibold text-primary underline-offset-4 hover:underline">{t('login.submitButton')}</Link></p>
        </CardFooter>
      </Card>
    </main>
  );
}
