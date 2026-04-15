import type { ReactNode } from 'react';
import '@/app/globals.css';
import { Button } from '@/components/ui/button';
import { Compass, Menu, Bell, User, Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import PwaInstallBanner from '@/components/pwa-install-banner';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthButton } from '@/components/auth-button';

export const metadata = {
  title: 'Путевой Компас',
  description: 'Ваш AI-помощник для планирования путешествий',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <FirebaseClientProvider>
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl font-bold text-foreground">Путевой Компас</span>
              </Link>
              <nav className="hidden md:flex items-center gap-x-8">
                <Link href="/" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Мои маршруты
                </Link>
                <Link href="/routes/new" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Создать маршрут
                </Link>
                <Link href="/tours" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Туры
                </Link>
                <Link href="/housing" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Жилье
                </Link>
                <Link href="/restaurants" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Рестораны
                </Link>
                <Link href="/activities" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Развлечения
                </Link>
                <Link href="/rental-car" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Транспорт
                </Link>
                <Link href="/multi-filter" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Фильтр
                </Link>
                <Link href="/filter-map" className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Фильтр-карта
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
                    <Link href="/favorites">
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Избранное</span>
                    </Link>
                </Button>
              <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
                <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Уведомления</span>
                </Link>
              </Button>
               <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="hidden md:inline-flex">
                <AuthButton />
              </div>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Открыть меню</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex flex-col">
                    <SheetHeader>
                      <SheetTitle asChild>
                         <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                          <Compass className="h-6 w-6 text-primary" />
                          <span>Путевой Компас</span>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto">
                      <nav className="grid gap-4 text-base font-medium mt-4">
                        <SheetClose asChild><Link href="/" className="text-muted-foreground hover:text-foreground">Мои маршруты</Link></SheetClose>
                        <SheetClose asChild><Link href="/routes/new" className="text-muted-foreground hover:text-foreground">Создать маршрут</Link></SheetClose>
                        <SheetClose asChild><Link href="/tours" className="text-muted-foreground hover:text-foreground">Туры</Link></SheetClose>
                        <SheetClose asChild><Link href="/housing" className="text-muted-foreground hover:text-foreground">Жилье</Link></SheetClose>
                        <SheetClose asChild><Link href="/restaurants" className="text-muted-foreground hover:text-foreground">Рестораны</Link></SheetClose>
                        <SheetClose asChild><Link href="/activities" className="text-muted-foreground hover:text-foreground">Развлечения</Link></SheetClose>
                        <SheetClose asChild><Link href="/rental-car" className="text-muted-foreground hover:text-foreground">Транспорт</Link></SheetClose>
                        <SheetClose asChild><Link href="/multi-filter" className="text-muted-foreground hover:text-foreground">Фильтр</Link></SheetClose>
                        <SheetClose asChild><Link href="/filter-map" className="text-muted-foreground hover:text-foreground">Фильтр-карта</Link></SheetClose>
                      </nav>
                      <Separator className="my-4" />
                      <nav className="grid gap-4 text-base font-medium">
                          <SheetClose asChild><Link href="/favorites" className="flex items-center text-muted-foreground hover:text-foreground"><Heart className="mr-2 h-5 w-5" />Избранное</Link></SheetClose>
                          <SheetClose asChild><Link href="/notifications" className="flex items-center text-muted-foreground hover:text-foreground"><Bell className="mr-2 h-5 w-5"/>Уведомления</Link></SheetClose>
                          <SheetClose asChild><Link href="/profile" className="flex items-center text-muted-foreground hover:text-foreground"><User className="mr-2 h-5 w-5"/>Профиль</Link></SheetClose>
                      </nav>
                    </div>
                    <div className="mt-auto border-t p-4">
                        <AuthButton />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>
          <main className="flex-1 pb-24 md:pb-8">
            {children}
          </main>
          
          <PwaInstallBanner />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
