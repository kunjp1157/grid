'use client';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { logout } from '@/actions/auth';
import type { User } from '@/lib/types';
import { useTranslation } from '@/context/LocalizationContext';

interface HeaderProps {
    user: User | null;
}

export function Header({ user }: HeaderProps) {
  const { t } = useTranslation();
  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
                <Logo />
            </div>
        </div>
      
      <div className="flex w-full items-center justify-end gap-4">
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('header.userMenu.myProfile')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
                <button type="submit" className="w-full">
                    <DropdownMenuItem>
                        {t('header.userMenu.logout')}
                    </DropdownMenuItem>
                </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
