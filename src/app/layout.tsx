import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Compass, PlusCircle, Menu } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import './globals.css';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const metadata = {
  title: 'Путевой Компас',
  description: 'Ваш AI-помощник для планирования путешествий',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold text-foreground">Путевой Компас</span>
            </Link>
            <nav className="hidden md:flex items-center gap-x-8">
              <Link href="/tours" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Туры
              </Link>
              <Link href="/housing" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Жилье
              </Link>
              <Link href="/restaurants" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Кафе и рестораны
              </Link>
              <Link href="/activities" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Развлечения
              </Link>
              <Link href="/rental-car" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Транспорт
              </Link>
              <Link href="/multi-filter" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Фильтр
              </Link>
              <Link href="/filter-map" className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                Фильтр-карта
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="hidden md:flex">
              <Link href="/routes/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Новый маршрут
              </Link>
            </Button>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="grid gap-6 text-lg font-medium mt-8">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                      <Compass className="h-6 w-6 text-primary" />
                      <span>Путевой Компас</span>
                    </Link>
                    <Link href="/tours" className="text-muted-foreground hover:text-foreground">Туры</Link>
                    <Link href="/housing" className="text-muted-foreground hover:text-foreground">Жилье</Link>
                    <Link href="/restaurants" className="text-muted-foreground hover:text-foreground">Кафе и рестораны</Link>
                    <Link href="/activities" className="text-muted-foreground hover:text-foreground">Развлечения</Link>
                    <Link href="/rental-car" className="text-muted-foreground hover:text-foreground">Транспорт</Link>
                    <Link href="/multi-filter" className="text-muted-foreground hover:text-foreground">Фильтр</Link>
                    <Link href="/filter-map" className="text-muted-foreground hover:text-foreground">Фильтр-карта</Link>
                  </nav>
                  <div className="absolute bottom-8 left-6 right-6">
                     <Button asChild className="w-full">
                        <Link href="/routes/new">
                           <PlusCircle className="mr-2 h-4 w-4" />
                           Новый маршрут
                        </Link>
                     </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
