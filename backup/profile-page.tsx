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
import { User as UserIcon, Edit, Loader2, Briefcase, Heart, ShoppingCart, Plane, Building } from "lucide-react";
import { AuthDialog } from '../auth-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';


// Mock components for favorites and bookings
const FavoriteItemCard = ({ title, category, image }: { title: string, category: string, image: string }) => (
    <Card className="overflow-hidden">
        <div className="relative h-32">
            <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <CardHeader className="p-4">
            <CardDescription>{category}</CardDescription>
            <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-0">
            <Button variant="outline" size="sm" className="w-full">
                Посмотреть
            </Button>
        </CardFooter>
    </Card>
);

const TravelerProfile = ({ user, interests }: { user: any, interests: string[] }) => (
    <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
            <TabsTrigger value="bookings">Заказы</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
            <div className="space-y-4">
                <Label htmlFor="name" className="font-semibold text-lg">Личная информация</Label>
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="sm:text-right">Имя</Label>
                        <Input id="name" defaultValue={user.displayName || ''} className="col-span-3" placeholder="Ваше имя" readOnly={!user.uid} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="sm:text-right">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} className="col-span-3" readOnly/>
                    </div>
                </div>
            </div>
            <Separator className="my-8" />
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Мои интересы</h3>
                <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                        <span key={interest} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {interest}
                        </span>
                    ))}
                    {user.uid &&
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                            + Добавить интерес
                        </Button>
                    }
                </div>
            </div>
        </TabsContent>
        <TabsContent value="favorites">
            <CardHeader className="p-0 mb-4">
                <CardTitle>Избранное</CardTitle>
                <CardDescription>Здесь хранятся понравившиеся вам туры, отели и развлечения.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FavoriteItemCard title="Замки Мира и Несвижа" category="Тур" image="https://picsum.photos/seed/mir-castle/400/300" />
                <FavoriteItemCard title="Апартаменты «Москва-Сити»" category="Жилье" image="https://picsum.photos/seed/moscowcity/400/300" />
                 <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                    <Heart className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <h3 className="text-md font-semibold">Добавляйте в избранное</h3>
                    <p className="text-muted-foreground text-sm mt-1">Нажмите на сердечко, чтобы сохранить.</p>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="bookings">
             <CardHeader className="p-0 mb-4">
                <CardTitle>Мои заказы</CardTitle>
                <CardDescription>Информация о ваших предстоящих и прошлых поездках.</CardDescription>
            </CardHeader>
             <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold">Заказов пока нет</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">После бронирования информация о поездке появится здесь.</p>
                <Button asChild className="mt-4">
                    <Link href="/tours">Найти тур</Link>
                </Button>
            </div>
        </TabsContent>
    </Tabs>
)

const BusinessProfile = ({ user, interests }: { user: any, interests: string[] }) => (
    <div className="space-y-8">
        <div>
            <h3 className="font-semibold text-lg mb-4">Информация о компании</h3>
             <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="sm:text-right">Имя</Label>
                    <Input id="name" defaultValue={user.displayName || ''} className="col-span-3" placeholder="Ваше имя" readOnly={!user.uid} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="sm:text-right">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email || ''} className="col-span-3" readOnly/>
                </div>
            </div>
        </div>
        <Separator/>
        <div>
            <h3 className="font-semibold text-lg mb-4">Сферы деятельности</h3>
            <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                    <span key={interest} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {interest}
                    </span>
                ))}
            </div>
        </div>
        <Separator/>
        <Card className="bg-secondary border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="w-6 h-6 text-primary"/>
                    <span>Ваши бизнесы</span>
                </CardTitle>
                 <CardDescription>Управляйте вашими предложениями на специальной панели.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">На панели управления вы можете добавлять и редактировать свои туры, отели, рестораны и другие услуги.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild>
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
          displayName: 'Путешественник (Демо)',
          email: 'traveler@example.com',
          photoURL: 'https://i.pravatar.cc/150?u=traveler-demo',
          isBusinessOwner: false,
          interests: ['История', 'Архитектура', 'Гастрономия', 'Природа'],
          uid: null
      },
      business: {
          displayName: 'Владелец Бизнеса (Демо)',
          email: 'owner@example.com',
          photoURL: 'https://i.pravatar.cc/150?u=business-owner-demo',
          isBusinessOwner: true,
          interests: ['Гостеприимство', 'Туризм', 'Маркетинг'],
          uid: null
      }
  };

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-4xl py-8 flex justify-center items-center h-96">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }
  
  const currentUser = isDemo ? demoUsers[demoType] : { ...user, ...(userProfile || {}) };
  const isBusinessOwner = currentUser?.isBusinessOwner;
  const interests = isBusinessOwner ? demoUsers.business.interests : demoUsers.traveler.interests;
  

  return (
    <div className="container mx-auto max-w-4xl py-8">
        {isDemo && (
             <div className="mb-6 p-4 border rounded-lg bg-secondary">
                <p className="text-center text-sm text-muted-foreground mb-3">Вы находитесь в демонстрационном режиме. Выберите, какой профиль вы хотите посмотреть:</p>
                <ToggleGroup type="single" value={demoType} onValueChange={(value) => {if(value) setDemoType(value as any)}} className="justify-center">
                    <ToggleGroupItem value="traveler" aria-label="Toggle traveler">
                        <Plane className="mr-2 h-4 w-4"/>
                        Путешественник
                    </ToggleGroupItem>
                    <ToggleGroupItem value="business" aria-label="Toggle business">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Владелец бизнеса
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        )}
      <Card>
        <CardHeader className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || ''} />
              <AvatarFallback>
                <UserIcon className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
            {!isDemo &&
              <Button variant="outline" size="icon" className="absolute bottom-1 right-1 rounded-full">
                <Edit className="w-4 h-4" />
              </Button>
            }
          </div>
          <CardTitle className="font-headline text-3xl">{currentUser.displayName || 'Пользователь'}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
              {isBusinessOwner && <Briefcase className="w-4 h-4" />}
              {currentUser.email}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Separator />

            {isBusinessOwner ? (
                <BusinessProfile user={currentUser} interests={interests} />
            ) : (
                <TravelerProfile user={currentUser} interests={interests} />
            )}

             {!isDemo && (
                 <div className="flex justify-end pt-8 border-t">
                    <Button>Сохранить изменения</Button>
                 </div>
             )}
              {isDemo && (
                 <div className="text-center pt-8 border-t">
                     <AuthDialog>
                        <Button size="lg">Войти или зарегистрироваться</Button>
                    </AuthDialog>
                 </div>
             )}
        </CardContent>
      </Card>
    </div>
  );
}
