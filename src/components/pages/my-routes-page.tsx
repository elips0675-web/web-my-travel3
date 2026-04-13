'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search, MapPin, BedDouble, Star } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from "@/components/ui/badge";

// Schema for Tour Search
const tourSearchSchema = z.object({
  destination: z.string().min(1, { message: "Обязательное поле" }),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
});

// Schema for Housing Search
const housingSearchSchema = z.object({
    destination: z.string().min(1, { message: "Обязательное поле" }),
    dates: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }),
});

// Tour Search Form Component
function ToursSearchForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof tourSearchSchema>>({
        resolver: zodResolver(tourSearchSchema),
        defaultValues: { destination: "" },
    });

    function onSubmit(values: z.infer<typeof tourSearchSchema>) {
        const params = new URLSearchParams();
        params.append("destination", values.destination);
        if (values.dates.from) params.append("from", values.dates.from.toISOString());
        if (values.dates.to) params.append("to", values.dates.to.toISOString());
        router.push(`/tours?${params.toString()}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 md:items-end gap-4">
                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="Куда едете?" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                        <FormItem>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal text-muted-foreground", field.value?.from && "text-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "d LLL", { locale: ru })} - {format(field.value.to, "d LLL, y", { locale: ru })}</>) : (format(field.value.from, "d LLL, y", { locale: ru }))) : (<span>Выберите даты</span>)}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar initialFocus mode="range" selected={{ from: field.value?.from, to: field.value?.to }} onSelect={field.onChange} numberOfMonths={2} locale={ru} />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="md:h-10 h-12 text-base"><Search className="mr-2 h-5 w-5" />Найти</Button>
            </form>
        </Form>
    );
}

// Housing Search Form Component
function HousingSearchForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof housingSearchSchema>>({
        resolver: zodResolver(housingSearchSchema),
        defaultValues: { destination: "" },
    });

    function onSubmit(values: z.infer<typeof housingSearchSchema>) {
        const params = new URLSearchParams();
        params.append("destination", values.destination);
        if (values.dates.from) params.append("from", values.dates.from.toISOString().split('T')[0]);
        if (values.dates.to) params.append("to", values.dates.to.toISOString().split('T')[0]);
        router.push(`/housing?${params.toString()}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 md:items-end gap-4">
                 <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="Куда едете?" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                        <FormItem>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal text-muted-foreground", field.value?.from && "text-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "d LLL", { locale: ru })} - {format(field.value.to, "d LLL, y", { locale: ru })}</>) : (format(field.value.from, "d LLL, y", { locale: ru }))) : (<span>Выберите даты</span>)}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar initialFocus mode="range" selected={{ from: field.value?.from, to: field.value?.to }} onSelect={field.onChange} numberOfMonths={2} locale={ru} />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="md:h-10 h-12 text-base"><Search className="mr-2 h-5 w-5" />Найти</Button>
            </form>
        </Form>
    );
}

export default function MyRoutesPageContent() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner');
    
    const activities = [
        {
            title: "Морские прогулки на яхте",
            location: "Сочи, Россия",
            image: PlaceHolderImages.find(img => img.id === 'activity-sailing'),
            rating: 4.9,
            reviews: 89,
            price: 5500,
            isTopRated: true,
        },
        {
            title: "Поход к Агурским водопадам",
            location: "Сочи, Россия",
            image: PlaceHolderImages.find(img => img.id === 'activity-hiking'),
            rating: 4.8,
            reviews: 124,
            price: 2500,
            isTopRated: false,
        },
        {
            title: "Мастер-класс по хинкали",
            location: "Тбилиси, Грузия",
            image: PlaceHolderImages.find(img => img.id === 'activity-cooking'),
            rating: 4.9,
            reviews: 215,
            price: 4000,
            isTopRated: true,
        },
        {
            title: "Экскурсия в Лувр",
            location: "Париж, Франция",
            image: PlaceHolderImages.find(img => img.id === 'activity-museum'),
            rating: 4.7,
            reviews: 1503,
            price: 6000,
            isTopRated: false,
        }
    ];
    
    const destinations = [
        {
            name: "Париж",
            image: PlaceHolderImages.find(img => img.id === 'destination-paris'),
        },
        {
            name: "Рим",
            image: PlaceHolderImages.find(img => img.id === 'destination-rome'),
        },
        {
            name: "Нью-Йорк",
            image: PlaceHolderImages.find(img => img.id === 'destination-ny'),
        },
        {
            name: "Токио",
            image: PlaceHolderImages.find(img => img.id === 'destination-tokyo'),
        },
        {
            name: "Бали",
            image: PlaceHolderImages.find(img => img.id === 'destination-bali'),
        },
        {
            name: "Санторини",
            image: PlaceHolderImages.find(img => img.id === 'destination-santorini'),
        },
    ];

    return (
        <>
            <section>
                <div className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
                    <Image
                        src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1920/1080"}
                        alt={heroImage?.description || "Beautiful travel landscape"}
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint={heroImage?.imageHint || "travel landscape"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                    <div className="relative z-10 flex flex-col items-center text-white text-center px-4 max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline !leading-tight">
                            Откройте для себя следующее приключение
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl">
                            Найдите лучшие туры, отели и развлечения по всему миру, подобранные специально для вас.
                        </p>
                        <Card className="mt-8 w-full bg-white/10 backdrop-blur-lg border-white/20">
                            <CardContent className="p-2 sm:p-4">
                                <Tabs defaultValue="tours" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                                        <TabsTrigger value="tours" className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary transition-none">
                                            <Search className="mr-2" />Туры
                                        </TabsTrigger>
                                        <TabsTrigger value="housing" className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary transition-none">
                                            <BedDouble className="mr-2" />Жилье
                                        </TabsTrigger>
                                    </TabsList>
                                    <div className="bg-white/90 p-4 rounded-b-md">
                                        <TabsContent value="tours" className="m-0">
                                            <ToursSearchForm />
                                        </TabsContent>
                                        <TabsContent value="housing" className="m-0">
                                            <HousingSearchForm />
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-12">В тренде сейчас</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {activities.map((activity, index) => (
                            <div key={index} className="group">
                                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg relative">
                                    <div className="relative h-64">
                                        <Image
                                            src={activity.image?.imageUrl || `https://picsum.photos/seed/${activity.title}/600/400`}
                                            alt={activity.image?.description || activity.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint={activity.image?.imageHint || activity.title.toLowerCase().replace(' ', '')}
                                        />
                                        {activity.isTopRated && (
                                            <Badge className="absolute top-4 left-4 border-none bg-primary text-primary-foreground">Топ</Badge>
                                        )}
                                        <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span>{activity.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </Card>
                                <div className="pt-4">
                                     <div className="flex items-center text-sm text-muted-foreground mb-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {activity.location}
                                    </div>
                                    <h3 className="font-bold font-headline text-xl mb-1 text-foreground truncate group-hover:text-primary transition-colors">{activity.title}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mb-2 gap-1">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-foreground">{activity.rating}</span>
                                        <span>({activity.reviews} отзывов)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                         <p className="text-lg font-bold text-foreground">
                                            <span className="text-sm font-normal text-muted-foreground">от </span>
                                            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(activity.price)}
                                        </p>
                                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">Подробнее</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 lg:py-20 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-10">Популярные направления</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((destination, index) => (
                            <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <Image
                                    src={destination.image?.imageUrl || `https://picsum.photos/seed/${destination.name}/600/800`}
                                    alt={destination.image?.description || destination.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={destination.image?.imageHint || destination.name.toLowerCase()}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                    <h3 className="font-bold font-headline text-2xl">{destination.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
