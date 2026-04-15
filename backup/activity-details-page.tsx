'use client';

import { useState, useEffect } from 'react';
import { type AiActivityRecommendationsOutput } from '@/ai/flows/ai-activity-recommendations';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronLeft, Search, Heart, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '../image-lightbox';
import ReviewsSection from '../reviews-section';
import { BookingWidget } from '../booking-widget';

type ActivityRecommendation = AiActivityRecommendationsOutput['recommendations'][0] & { slug: string };


function PageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-8" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg hidden md:block" />
                <Skeleton className="aspect-[4/3] rounded-lg hidden md:block" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function ActivityDetailsPageContent({ slug }: { slug: string }) {
    const [activity, setActivity] = useState<ActivityRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const storedRecsRaw = sessionStorage.getItem('activityRecommendations');
        if (storedRecsRaw) {
            try {
                const storedRecs: ActivityRecommendation[] = JSON.parse(storedRecsRaw);
                const foundRec = storedRecs.find(rec => rec.slug === slug);
                if (foundRec) {
                    setActivity(foundRec);
                }
            } catch (e) {
                console.error("Failed to parse activity recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!activity) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Развлечение не найдено</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/activities">Вернуться к списку</Link>
                </Button>
            </div>
        );
    }

    const mainImage = activity.imageUrl || `https://picsum.photos/seed/${slug}/1200/800`;
    const galleryImages = [
        `https://picsum.photos/seed/${slug}-1/600/400`,
        `https://picsum.photos/seed/${slug}-2/600/400`,
        `https://picsum.photos/seed/${slug}-3/600/400`,
        `https://picsum.photos/seed/${slug}-4/600/400`,
    ];
    const allImages = [mainImage, ...galleryImages];

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/activities">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к списку
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                             <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">{activity.category}</p>
                            <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2">{activity.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                                {activity.rating && (
                                    <div className="flex items-center gap-1 font-bold">
                                        <Star className="w-4 h-4 text-primary fill-primary" />
                                        <span>{activity.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                {activity.rating && <Separator orientation="vertical" className="h-4" />}
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{activity.location}</span>
                                </div>
                            </div>
                        </div>
                         <Button
                            size="lg"
                            variant="outline"
                            className="shrink-0"
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            <Heart className={cn("mr-2 h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
                            {isFavorite ? 'В избранном' : 'В избранное'}
                        </Button>
                    </div>
                </header>

                 <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 h-[50vh] max-h-[500px] mb-8">
                    <button onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Image src={mainImage} alt={activity.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${activity.category} building exterior`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    {galleryImages.slice(0, 2).map((img, i) => (
                        <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <Image src={img} alt={`${activity.name} - фото ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${activity.category} interior`} />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                         <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Обзор</TabsTrigger>
                                <TabsTrigger value="details">Детали</TabsTrigger>
                                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="pt-6">
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-2xl">О месте</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose prose-stone dark:prose-invert max-w-none">
                                        <p>{activity.description}</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                             <TabsContent value="details" className="pt-6">
                                <Card>
                                    <CardHeader><CardTitle>Что включено</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {activity.whatIsIncluded?.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                                 <Card className="mt-4">
                                    <CardHeader><CardTitle>Что не включено</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {activity.whatIsExcluded?.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <XCircle className="w-5 h-5 text-destructive" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="reviews" className="pt-6">
                                <ReviewsSection />
                            </TabsContent>
                        </Tabs>
                       
                    </div>

                    <div id="booking-widget" className="row-start-1 lg:row-auto">
                         <BookingWidget 
                            price={activity.price}
                            priceType='билет'
                            showDatePicker='single'
                            showGuests={true}
                        />
                    </div>
                </div>
            </div>
             <ImageLightbox
                images={allImages}
                isOpen={lightboxOpen}
                onOpenChange={setLightboxOpen}
                startIndex={lightboxStartIndex}
            />
             <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 p-4 z-20 lg:hidden">
                <div className="container mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">От</p>
                        <p className="font-bold text-xl">{activity.price} / билет</p>
                    </div>
                    <Button onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })} size="lg">
                        Купить билет
                    </Button>
                </div>
            </div>
        </>
    );
}
