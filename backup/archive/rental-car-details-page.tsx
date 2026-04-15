'use client';

import { useState, useEffect } from 'react';
import { type AiRentalCarRecommendationsOutput } from '@/ai/flows/ai-rental-car-recommendations';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronLeft, Users, Briefcase, Cog, DoorClosed, CheckCircle, Search, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '../image-lightbox';
import ReviewsSection from '../reviews-section';
import { BookingWidget } from '../booking-widget';

type CarRecommendation = AiRentalCarRecommendationsOutput['recommendations'][0] & { slug: string };

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
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function RentalCarDetailsPageContent({ slug }: { slug: string }) {
    const [car, setCar] = useState<CarRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const storedRecsRaw = sessionStorage.getItem('rentalCarRecommendations');
        if (storedRecsRaw) {
            try {
                const storedRecs: CarRecommendation[] = JSON.parse(storedRecsRaw);
                const foundRec = storedRecs.find(rec => rec.slug === slug);
                if (foundRec) {
                    setCar(foundRec);
                }
            } catch (e) {
                console.error("Failed to parse car recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!car) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Транспорт не найден</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/rental-car">Вернуться к поиску</Link>
                </Button>
            </div>
        );
    }
    
    const galleryImages = [
        car.imageUrl,
        `https://picsum.photos/seed/${slug}-1/1200/800`,
        `https://picsum.photos/seed/${slug}-2/1200/800`,
        `https://picsum.photos/seed/${slug}-3/1200/800`,
    ];

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/rental-car">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к поиску
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                             <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2">{car.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{car.supplier}</span>
                                </div>
                                {car.rating && (
                                    <>
                                        <Separator orientation="vertical" className="h-4" />
                                        <div className="flex items-center gap-1 font-bold">
                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                            <span>{car.rating.toFixed(1)}</span>
                                        </div>
                                    </>
                                )}
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
                        <Image src={galleryImages[0]} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${car.type} transport exterior`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    {galleryImages.slice(1, 3).map((img, i) => (
                        <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <Image src={img} alt={`${car.name} - фото ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${car.type} transport interior`} />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Характеристики</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                                    {car.features.passengers && <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.passengers} Пассажиров</p>
                                    </div>}
                                     {car.features.luggage && <div className="flex flex-col items-center gap-2">
                                        <Briefcase className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.luggage} Багаж</p>
                                    </div>}
                                    {car.features.transmission && <div className="flex flex-col items-center gap-2">
                                        <Cog className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.transmission}</p>
                                    </div>}
                                    {car.features.doors && <div className="flex flex-col items-center gap-2">
                                        <DoorClosed className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.doors} Двери</p>
                                    </div>}
                                </div>
                            </CardContent>
                        </Card>

                         <Tabs defaultValue="reviews" className="w-full">
                            <TabsList className="grid w-full grid-cols-1 md:w-auto md:inline-flex">
                                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="reviews" className="pt-6">
                               <ReviewsSection/>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="row-start-1 lg:row-auto">
                        <BookingWidget 
                            price={car.price}
                            priceType='сутки'
                            showDatePicker='range'
                        />
                    </div>
                </div>
            </div>
            <ImageLightbox
                images={galleryImages}
                isOpen={lightboxOpen}
                onOpenChange={setLightboxOpen}
                startIndex={lightboxStartIndex}
            />
        </>
    );
}
