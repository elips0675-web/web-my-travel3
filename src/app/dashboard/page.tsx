'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import Image from 'next/image';

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

export default function DashboardPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const router = useRouter();
    const firestore = useFirestore();

    const businessesQuery = useMemo(() => {
        if (!user?.uid) return null;
        return query(collection(firestore, "businesses"), where("ownerId", "==", user.uid));
    }, [firestore, user?.uid]);

    const { data: businesses, isLoading: isBusinessesLoading } = useCollection<Business>(businessesQuery);
    
    const isLoading = isUserLoading || isProfileLoading || isBusinessesLoading;

    useEffect(() => {
        if (!isLoading) {
            if (!user || !userProfile?.isBusinessOwner) {
                router.push('/');
            }
        }
    }, [isLoading, user, userProfile, router]);
    
    if (isLoading || !user || !userProfile?.isBusinessOwner) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">Панель управления</h1>
                <Button asChild>
                    <Link href="/dashboard/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить бизнес
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Мои бизнесы</CardTitle>
                    <CardDescription>
                        Здесь отображаются ваши компании и предложения в виде доски объявлений.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {businesses && businesses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {businesses.map((business) => (
                                <Card key={business.id} className="flex flex-col overflow-hidden">
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
                                        <Button variant="outline" size="sm" className="w-full">
                                            Управлять
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">У вас пока нет бизнесов</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Нажмите "Добавить бизнес", чтобы создать свое первое предложение.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
