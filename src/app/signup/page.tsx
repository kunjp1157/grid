
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { useTranslation } from '@/context/LocalizationContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import Link from 'next/link';

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(undefined);

    const formData = new FormData(event.currentTarget);
    const result = await signup(null, formData);

    if (result?.redirectTo) {
        router.push(result.redirectTo);
    } else if (result?.error) {
        setError(result.error);
        setIsPending(false);
    } else {
        setError("An unknown error occurred during sign up.");
        setIsPending(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('signup.nameLabel')}</Label>
              <Input id="name" name="name" type="text" placeholder={t('signup.namePlaceholder')} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.emailLabel')}</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.passwordLabel')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="pr-10"
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full !mt-8 bg-accent hover:bg-accent/90" disabled={isPending}>
              {isPending ? 'Signing up...' : t('signup.submitButton')}
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
