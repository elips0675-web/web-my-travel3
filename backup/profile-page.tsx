'use client';
import { useState } from 'react';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, Edit, Loader2, Briefcase, Heart, ShoppingCart, Plane, Building, UserCog, Building2, Sparkles, Palette, PlusCircle } from "lucide-react";
import { AuthDialog } from '../auth-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';


const FavoriteItemCard = ({ title, category, image }: { title: string, category: string, image: string }) => (
    <Card className="overflow-hidden group">
        <div className="relative h-40">
            <Image src={image} alt={title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <div className="absolute bottom-0 p-4">
                 <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">{category}</p>
                <h3 className="font-bold text-white text-lg">{title}</h3>
            </div>
        </div>
    </Card>
);

const EmptyState = ({ icon, title, description, buttonText, buttonLink }: { icon: React.ReactNode, title: string, description: string, buttonText?: string, buttonLink?: string }) => (
    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-xl bg-muted/50">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">{description}</p>
        {buttonText && buttonLink &&
            <Button asChild className="mt-6">
                <Link href={buttonLink}>{buttonText}</Link>
            </Button>
        }
    </div>
);

const TravelerProfileView = ({ user, interests }: { user: any, interests: string[] }) => (
    <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile"><UserCog className="w-4 h-4 mr-2"/>Профиль</TabsTrigger>
            <TabsTrigger value="favorites"><Heart className="w-4 h-4 mr-2"/>Избранное</TabsTrigger>
            <TabsTrigger value="bookings"><ShoppingCart className="w-4 h-4 mr-2"/>Мои поездки</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Личная информация</CardTitle>
                    <CardDescription>Эти данные будут использоваться для автозаполнения при бронировании.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                        <Label htmlFor="name">Полное имя</Label>
                        <Input id="name" defaultValue={user.displayName || ''} className="col-span-2" placeholder="Как к вам обращаться?" readOnly={!user.uid} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} className="col-span-2" readOnly/>
                    </div>
                </CardContent>
            </Card>
             <Card className="mt-6">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/>Мои интересы</CardTitle>
                    <CardDescription>Расскажите нам о своих предпочтениях, чтобы мы могли предлагать вам лучшее.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-wrap gap-3">
                        {interests.map(interest => (
                            <span key={interest} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                                {interest}
                            </span>
                        ))}
                        {user.uid &&
                            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Добавить интерес
                            </Button>
                        }
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FavoriteItemCard title="Замки Мира и Несвижа" category="Исторический тур" image="https://picsum.photos/seed/mir-castle/400/300" />
                <FavoriteItemCard title="Апартаменты в центре Минска" category="Жилье" image="https://picsum.photos/seed/minsk-apt/400/300" />
                <EmptyState 
                    icon={<Heart className="h-8 w-8 text-muted-foreground/60" />}
                    title="Создайте свою коллекцию"
                    description="Нажимайте на сердечко у понравившихся мест, и они появятся здесь."
                />
            </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-6">
             <EmptyState 
                icon={<ShoppingCart className="h-8 w-8 text-muted-foreground/60" />}
                title="Пока нет запланированных поездок"
                description="Как только вы забронируете свой первый тур или отель, информация о нем появится в этом разделе."
                buttonText="Найти, чем заняться"
                buttonLink="/tours"
            />
        </TabsContent>
    </Tabs>
)

const BusinessProfileView = ({ user, interests }: { user: any, interests: string[] }) => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Информация о представителе</CardTitle>
                 <CardDescription>Эти данные видны только вам и используются для управления вашим бизнес-аккаунтом.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                    <Label htmlFor="name">Контактное лицо</Label>
                    <Input id="name" defaultValue={user.displayName || ''} className="col-span-2" placeholder="Ваше имя" readOnly={!user.uid} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                    <Label htmlFor="email">Рабочий Email</Label>
                    <Input id="email" type="email" defaultValue={user.email || ''} className="col-span-2" readOnly/>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-primary"/>Сферы деятельности</CardTitle>
                <CardDescription>Категории, в которых вы предоставляете услуги.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3">
                    {interests.map(interest => (
                        <span key={interest} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                            {interest}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-primary"/>
                    <span>Панель управления бизнесом</span>
                </CardTitle>
                 <CardDescription>Центр управления вашими объектами, услугами и бронированиями.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/80">Добавляйте и редактируйте свои предложения, отслеживайте статистику и взаимодействуйте с клиентами. Все инструменты для развития вашего бизнеса в одном месте.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href="/dashboard">
                        Перейти в Панель управления
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
);


export default function ProfilePageContent() {
  const { user, isLoading: isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const [demoType, setDemoType] = useState<'traveler' | 'business'>('traveler');
  
  const isLoading = isUserLoading || isProfileLoading;
  const isDemo = !user;
  
  const demoUsers = {
      traveler: {
          displayName: 'Елена Путешественница',
          email: 'demo-traveler@email.com',
          photoURL: 'https://i.pravatar.cc/150?u=traveler-demo',
          isBusinessOwner: false,
          interests: ['Культурное наследие', 'Пешие прогулки', 'Фотография', 'Местная кухня'],
          uid: null
      },
      business: {
          displayName: 'Иван Владельцев',
          email: 'demo-owner@business.com',
          photoURL: 'https://i.pravatar.cc/150?u=business-owner-demo',
          isBusinessOwner: true,
          interests: ['Авторские туры', 'Гостевые дома', 'Гастропабы'],
          uid: null
      }
  };

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-5xl py-8 flex justify-center items-center h-96">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }
  
  const currentUser = isDemo ? demoUsers[demoType] : { ...user, ...(userProfile || {}) };
  const isBusinessOwner = isDemo ? demoType === 'business' : currentUser?.isBusinessOwner;
  const interests = isDemo ? demoUsers[demoType].interests : (currentUser as any)?.interests || [];
  

  return (
    <div className="container mx-auto max-w-5xl py-8">
        {isDemo && (
             <Alert className="mb-6 border-primary/30 bg-primary/5">
                <Briefcase className="h-4 w-4" />
                <AlertTitle>Демонстрационный режим</AlertTitle>
                <AlertDescription>
                   <div className="flex flex-col sm:flex-row justify-between items-center">
                     <p className="text-sm text-muted-foreground mb-3 sm:mb-0">Вы просматриваете профиль в демо-режиме. Для доступа ко всем функциям, пожалуйста, войдите в систему.</p>
                     <AuthDialog>
                        <Button>Войти или зарегистрироваться</Button>
                    </AuthDialog>
                   </div>
                </AlertDescription>
            </Alert>
        )}
        
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <Card className="text-center p-2">
                 <CardContent className="p-4">
                    <div className="relative w-32 h-32 mx-auto">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                        <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || ''} />
                        <AvatarFallback>
                            <UserIcon className="w-16 h-16" />
                        </AvatarFallback>
                        </Avatar>
                        {!isDemo &&
                        <Button variant="outline" size="icon" className="absolute -bottom-1 -right-1 rounded-full h-9 w-9 shadow-md">
                            <Edit className="w-4 h-4" />
                        </Button>
                        }
                    </div>
                    <h1 className="font-headline text-3xl mt-4">{currentUser.displayName || 'Пользователь'}</h1>
                    <p className="text-muted-foreground break-all">{currentUser.email}</p>
                </CardContent>
                 {isDemo && (
                    <CardFooter className="p-4 border-t">
                        <ToggleGroup type="single" value={demoType} onValueChange={(value) => {if(value) setDemoType(value as any)}} className="w-full grid grid-cols-2">
                            <ToggleGroupItem value="traveler" aria-label="Toggle traveler" className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                                <Plane className="mr-2 h-4 w-4"/>
                                Путешественник
                            </ToggleGroupItem>
                            <ToggleGroupItem value="business" aria-label="Toggle business" className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Бизнес
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </CardFooter>
                )}
            </Card>
             {!isDemo && (
                 <div className="p-2">
                    <Button size="lg" className="w-full">Сохранить изменения</Button>
                 </div>
             )}
        </aside>

        <main className="lg:col-span-8 xl:col-span-9">
             {isBusinessOwner ? (
                <BusinessProfileView user={currentUser} interests={interests} />
            ) : (
                <TravelerProfileView user={currentUser} interests={interests} />
            )}
        </main>

      </div>
    </div>
  );
}
