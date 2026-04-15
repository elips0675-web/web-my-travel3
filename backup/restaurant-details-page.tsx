'use client';

import { useState, useEffect } from 'react';
import { type AiRestaurantRecommendationsOutput } from '@/ai/flows/ai-restaurant-recommendations';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronLeft, Search, Heart, Utensils, Award, Clock, Phone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '../image-lightbox';
import ReviewsSection from '../reviews-section';
import { BookingWidget } from '../booking-widget';

type RestaurantRecommendation = AiRestaurantRecommendationsOutput['recommendations'][0] & { slug: string; features?: string[]; };

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

export default function RestaurantDetailsPageContent({ slug }: { slug: string }) {
    const [recommendation, setRecommendation] = useState<RestaurantRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const storedRecsRaw = sessionStorage.getItem('restaurantRecommendations');
        if (storedRecsRaw) {
            try {
                const storedRecs: RestaurantRecommendation[] = JSON.parse(storedRecsRaw);
                const foundRec = storedRecs.find(rec => rec.slug === slug);
                if (foundRec) {
                    setRecommendation(foundRec);
                }
            } catch (e) {
                console.error("Failed to parse restaurant recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!recommendation) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Ресторан не найден</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/restaurants">Вернуться к поиску</Link>
                </Button>
            </div>
        );
    }

    const mainImage = recommendation.imageUrl || `https://picsum.photos/seed/${slug}/1200/800`;
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
                    <Link href="/restaurants">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к поиску
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                             <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">{recommendation.cuisine}</p>
                            <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2">{recommendation.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                                {recommendation.rating && (
                                    <div className="flex items-center gap-1 font-bold">
                                        <Star className="w-4 h-4 text-primary fill-primary" />
                                        <span>{recommendation.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                {recommendation.rating && <Separator orientation="vertical" className="h-4" />}
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{recommendation.location}</span>
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
                        <Image src={mainImage} alt={recommendation.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${recommendation.cuisine} interior`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    {galleryImages.slice(0, 2).map((img, i) => (
                        <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <Image src={img} alt={`${recommendation.name} - фото ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${recommendation.cuisine} food`} />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                         <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                                <TabsTrigger value="overview">Обзор</TabsTrigger>
                                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="pt-6">
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-2xl">О ресторане</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose prose-stone dark:prose-invert max-w-none">
                                        <p>{recommendation.description}</p>
                                        
                                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="font-semibold mb-2">Особенности</h3>
                                                <ul className="list-none p-0 space-y-2">
                                                    {recommendation.features?.map((feature, i) => <li key={i} className="flex items-center"><Award className="w-4 h-4 mr-2 text-primary"/>{feature}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-2">Контакты</h3>
                                                <ul className="list-none p-0 space-y-2">
                                                    <li className="flex items-center"><MapPin className="w-4 h-4 mr-2"/>{recommendation.location}</li>
                                                    <li className="flex items-center"><Phone className="w-4 h-4 mr-2"/>+7 (123) 456-78-90</li>
                                                     <li className="flex items-center"><Globe className="w-4 h-4 mr-2"/>website.com</li>
                                                </ul>
                                            </div>
                                        </div>
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
                            price={recommendation.price}
                            priceType='средний чек'
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
                        <p className="text-sm text-muted-foreground">Средний чек</p>
                        <p className="font-bold text-xl">{recommendation.price}</p>
                    </div>
                    <Button onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })} size="lg">
                        Забронировать
                    </Button>
                </div>
            </div>
        </>
    );
}
