'use client';

import { useState, useEffect } from 'react';
import { type AiTourRecommendationsOutput } from '@/ai/flows/ai-tour-recommendations';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronLeft, Users, Clock, CheckCircle, XCircle, Search, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '../image-lightbox';
import ReviewsSection from '../reviews-section';
import { BookingWidget } from '../booking-widget';

type TourRecommendation = AiTourRecommendationsOutput[0] & { slug: string };


function PageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[60vh] max-h-[550px] mb-8">
                 <Skeleton className="h-full w-full rounded-lg" />
                 <div className="hidden md:grid grid-cols-1 gap-2">
                    <Skeleton className="h-full w-full rounded-lg" />
                    <Skeleton className="h-full w-full rounded-lg" />
                 </div>
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

export default function TourDetailsPageContent({ slug }: { slug: string }) {
    const [tour, setTour] = useState<TourRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);


    useEffect(() => {
        const storedToursRaw = sessionStorage.getItem('tourRecommendations');
        if (storedToursRaw) {
            try {
                const storedTours: TourRecommendation[] = JSON.parse(storedToursRaw);
                const foundTour = storedTours.find(rec => rec.slug === slug);
                if (foundTour) {
                    setTour(foundTour);
                }
            } catch (e) {
                console.error("Failed to parse tour recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!tour) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Тур не найден</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/tours">Вернуться к поиску</Link>
                </Button>
            </div>
        );
    }
    
    const mainImage = tour.galleryImageUrls?.[0] || `https://picsum.photos/seed/${slug}/1200/800`;
    const galleryImages = tour.galleryImageUrls?.slice(1) || [
        `https://picsum.photos/seed/${slug}-1/800/600`,
        `https://picsum.photos/seed/${slug}-2/800/600`,
    ];
    const allImages = tour.galleryImageUrls && tour.galleryImageUrls.length > 0 ? tour.galleryImageUrls : [mainImage, ...galleryImages];
    const rating = (tour.relevanceScore / 20);

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/tours">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к поиску
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <CardDescription className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">{tour.type}</CardDescription>
                            <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-4">{tour.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                                <div className="flex items-center gap-1 font-bold">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span>{rating.toFixed(1)}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{tour.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{tour.groupSize}</span>
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

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[60vh] max-h-[550px] mb-8">
                    <button onClick={() => openLightbox(0)} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Image src={mainImage} alt={tour.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint="tour landscape" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    <div className="hidden md:grid grid-cols-1 gap-2">
                        {galleryImages.slice(0, 2).map((img, i) => (
                            <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                <Image src={img} alt={`${tour.name} - фото ${i + 2}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint="tour activity" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2">
                       <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Обзор</TabsTrigger>
                                <TabsTrigger value="program">Программа</TabsTrigger>
                                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="pt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-2xl">Основное</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose prose-stone dark:prose-invert max-w-none">
                                        <p>{tour.description}</p>
                                        
                                        <h3 className="font-semibold mt-6 mb-2">Ключевые моменты</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {tour.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                             <TabsContent value="program" className="pt-6">
                                <Card>
                                    <CardHeader><CardTitle>Что включено</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {tour.included.map((item, i) => (
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
                                            {tour.excluded.map((item, i) => (
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
                            price={tour.priceRange} 
                            priceType="чел."
                            showDatePicker="single"
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
                        <p className="font-bold text-xl">{tour.priceRange} / чел.</p>
                    </div>
                    <Button onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })} size="lg">
                        Запросить
                    </Button>
                </div>
            </div>
        </>
    );
}
