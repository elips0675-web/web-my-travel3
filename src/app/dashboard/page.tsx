'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, PlusCircle, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import Image from 'next/image';
import { AuthDialog } from '@/components/auth-dialog';

type Business = {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
};

const categoryLabels: Record<string, string> = {
    tours: 'Туры',
    housing: 'Жилье',
    restaurants: 'Кафе и рестораны',
    activities: 'Развлечения',
    'rental-car': 'Транспорт'
};

const mockBusinesses: Business[] = [
    {
        id: 'demo-1',
        name: 'Тур "Замки Мира и Несвижа" (Демо)',
        description: 'Посетите два самых известных замка Беларуси, внесенных в список Всемирного наследия ЮНЕСКО. Погрузитесь в атмосферу средневековья и магнатской роскоши.',
        category: 'tours',
        imageUrl: 'https://picsum.photos/seed/mir-castle/600/400'
    },
    {
        id: 'demo-2',
        name: 'Апартаменты "Уютный лофт" (Демо)',
        description: 'Современные апартаменты в центре города с прекрасным видом. Идеально для деловых поездок и отдыха.',
        category: 'housing',
        imageUrl: 'https://picsum.photos/seed/loft-apartment/600/400'
    },
    {
        id: 'demo-3',
        name: 'Ресторан "Старый город" (Демо)',
        description: 'Насладитесь блюдами национальной кухни в уютной атмосфере исторического центра.',
        category: 'restaurants',
        imageUrl: 'https://picsum.photos/seed/old-town-resto/600/400'
    },
];

export default function DashboardPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const router = useRouter();
    const firestore = useFirestore();
    
    const isDemo = !user;

    const businessesQuery = useMemo(() => {
        if (isDemo || !user?.uid) return null;
        return query(collection(firestore, "businesses"), where("ownerId", "==", user.uid));
    }, [firestore, user?.uid, isDemo]);

    const { data: businessesFromFirestore, isLoading: isBusinessesLoading } = useCollection<Business>(businessesQuery);
    
    const isLoading = isUserLoading || isProfileLoading;

    useEffect(() => {
        // Redirect only if user is logged-in but not a business owner
        if (!isLoading && user && userProfile && !userProfile.isBusinessOwner) {
            router.push('/');
        }
    }, [isLoading, user, userProfile, router]);
    
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // Safety net for logged-in non-business users
    if (user && userProfile && !userProfile.isBusinessOwner) {
         return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    const businesses = isDemo ? mockBusinesses : businessesFromFirestore;
    const finalIsLoading = isDemo ? false : isBusinessesLoading;

    return (
        <div className="container mx-auto py-8">
            {isDemo && (
                 <div className="mb-6 p-4 border rounded-lg bg-secondary text-center">
                    <p className="text-sm text-muted-foreground">
                        Это демонстрационный режим панели управления. <AuthDialog><Button variant="link" className="p-0 h-auto -translate-y-px">Войдите</Button></AuthDialog> как владелец бизнеса, чтобы управлять своими объявлениями.
                    </p>
                </div>
            )}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold font-headline">Панель управления</h1>
                <Button asChild disabled={isDemo}>
                    <Link href="/dashboard/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить бизнес
                    </Link>
                </Button>
            </div>
             <p className="text-muted-foreground mb-6">
                Здесь отображаются ваши компании и предложения в виде доски объявлений.
            </p>

            {finalIsLoading ? (
                 <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : businesses && businesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business) => (
                        <Card key={business.id} className="flex flex-col overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="relative aspect-[16/9] w-full">
                               <Image
                                    src={business.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}
                                    alt={business.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle>{business.name}</CardTitle>
                                <CardDescription>{categoryLabels[business.category] || business.category}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{business.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" className="w-full" disabled={isDemo}>
                                    Управлять
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-secondary/50">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold">У вас пока нет бизнесов</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Нажмите "Добавить бизнес", чтобы создать свое первое предложение.
                    </p>
                    <Button asChild className="mt-6" disabled={isDemo}>
                        <Link href="/dashboard/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Добавить первое объявление
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
