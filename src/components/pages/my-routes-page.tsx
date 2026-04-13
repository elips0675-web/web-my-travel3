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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { CalendarIcon, Search, MapPin, Star, ShieldCheck, Users, Briefcase } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AiTourRecommendationsOutput } from "@/ai/flows/ai-tour-recommendations";

const searchSchema = z.object({
  destination: z.string().min(1, { message: "Обязательное поле" }),
  date: z.date().optional(),
});

export default function MyRoutesPageContent() {
    const router = useRouter();
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner-kayleen');
    const whyUsImage = PlaceHolderImages.find(img => img.id === 'why-choose-us');

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { destination: "" },
    });

    function onSubmit(values: z.infer<typeof searchSchema>) {
        const params = new URLSearchParams();
        params.append("destination", values.destination);
        if (values.date) params.append("from", values.date.toISOString());
        router.push(`/tours?${params.toString()}`);
    }

    const tours: (AiTourRecommendationsOutput[0] & { location: string })[] = [
        {
            name: "Обзорная экскурсия по Риму",
            description: "Откройте для себя величие Колизея, Римского форума и Пантеона в этой увлекательной пешеходной экскурсии.",
            type: "культурный",
            location: "Рим, Италия",
            priceRange: "€50",
            bookingLink: "#",
            relevanceScore: 95,
            duration: "4 часа",
            groupSize: "до 15 чел.",
            highlights: ["Колизей", "Римский форум", "Пантеон"],
            included: ["Гид", "Наушники"],
            excluded: ["Входные билеты", "Еда и напитки"],
            galleryImageUrls: ["https://picsum.photos/seed/rome-tour-1/800/600"]
        },
        {
            name: "Гастрономический тур по Токио",
            description: "Попробуйте настоящие суши, рамен и другие японские деликатесы на оживленных улицах Токио.",
            type: "еда",
            location: "Токио, Япония",
            priceRange: "¥12000",
            bookingLink: "#",
            relevanceScore: 92,
            duration: "3 часа",
            groupSize: "до 8 чел.",
            highlights: ["Рынок Цукидзи", "Дегустация саке", "Мастер-класс по суши"],
            included: ["Гид", "Дегустации"],
            excluded: ["Обед", "Транспорт"],
            galleryImageUrls: ["https://picsum.photos/seed/tokyo-tour-1/800/600"]
        },
        {
            name: "Полет на вертолете над Гранд-Каньоном",
            description: "Насладитесь захватывающими видами Гранд-Каньона с высоты птичьего полета.",
            type: "приключение",
            location: "Аризона, США",
            priceRange: "$250",
            bookingLink: "#",
            relevanceScore: 98,
            duration: "1 час",
            groupSize: "до 6 чел.",
            highlights: ["Вид на плотину Гувера", "Полет над каньоном", "Фото-остановки"],
            included: ["Полет", "Трансфер из отеля"],
            excluded: ["Сборы национального парка"],
            galleryImageUrls: ["https://picsum.photos/seed/canyon-tour-1/800/600"]
        },
        {
            name: "Винный тур по Тоскане",
            description: "Посетите знаменитые винодельни региона Кьянти и насладитесь дегустацией лучших итальянских вин.",
            type: "еда",
            location: "Тоскана, Италия",
            priceRange: "€90",
            bookingLink: "#",
            relevanceScore: 94,
            duration: "Полный день",
            groupSize: "до 25 чел.",
            highlights: ["Дегустация вина Кьянти", "Посещение 2 виноделен", "Обед на ферме"],
            included: ["Транспорт", "Дегустации", "Обед"],
            excluded: ["Личные расходы"],
            galleryImageUrls: ["https://picsum.photos/seed/tuscany-tour-1/800/600"]
        }
    ];
    
    const destinations = [
        { name: "Париж", image: PlaceHolderImages.find(img => img.id === 'destination-paris') },
        { name: "Рим", image: PlaceHolderImages.find(img => img.id === 'destination-rome') },
        { name: "Нью-Йорк", image: PlaceHolderImages.find(img => img.id === 'destination-ny') },
        { name: "Токио", image: PlaceHolderImages.find(img => img.id === 'destination-tokyo') },
        { name: "Бали", image: PlaceHolderImages.find(img => img.id === 'destination-bali') },
        { name: "Санторини", image: PlaceHolderImages.find(img => img.id === 'destination-santorini') },
        { name: "Лондон", image: { imageUrl: 'https://picsum.photos/seed/london/600/400', description: 'London', imageHint: 'london city'}},
        { name: "Дубай", image: { imageUrl: 'https://picsum.photos/seed/dubai/600/400', description: 'Dubai', imageHint: 'dubai city'}},
    ];

    const whyChooseUsItems = [
        { icon: ShieldCheck, title: "Гарантия лучшей цены", description: "Мы предлагаем конкурентные цены на тысячи направлений." },
        { icon: Users, title: "Поддержка клиентов 24/7", description: "Наша команда поддержки всегда готова помочь вам." },
        { icon: Briefcase, title: "Простое бронирование", description: "Интуитивно понятный процесс бронирования за несколько кликов." },
    ]

    return (
        <>
            <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center -mt-16">
                <Image
                    src={heroImage?.imageUrl || "https://picsum.photos/seed/kayleen-hero/1920/1080"}
                    alt={heroImage?.description || "Abstract background"}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage?.imageHint || "abstract background"}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center text-white text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-extrabold font-headline !leading-tight tracking-tight">
                        Ваш Мир Удовольствий
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/80">
                        Найдите лучшие туры, отели и развлечения по всему миру, подобранные специально для вас.
                    </p>
                    
                    <div className="mt-8 w-full max-w-3xl p-4 bg-background/50 backdrop-blur-md rounded-lg">
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 md:items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2 text-left">
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input placeholder="Куда едете?" className="pl-10 h-14 text-base bg-input border-0" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="text-left">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn("w-full justify-start text-left font-normal h-14 text-base bg-input border-0", !field.value && "text-muted-foreground")}
                                                        >
                                                            <CalendarIcon className="mr-2 h-5 w-5" />
                                                            {field.value ? format(field.value, "d LLL, y", { locale: ru }) : <span>Выберите дату</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar initialFocus mode="single" selected={field.value} onSelect={field.onChange} locale={ru} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="h-14 text-base font-bold md:col-span-1">
                                    <Search className="mr-2 h-5 w-5" />
                                    Найти
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
            
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="tours" className="w-full">
                        <div className="flex justify-center mb-12">
                            <TabsList>
                                <TabsTrigger value="tours">Туры</TabsTrigger>
                                <TabsTrigger value="housing">Жилье</TabsTrigger>
                                <TabsTrigger value="restaurants">Кафе и рестораны</TabsTrigger>
                                <TabsTrigger value="activities">Развлечения</TabsTrigger>
                                <TabsTrigger value="rental-car">Авто</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="tours">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Наши лучшие туры</h2>
                                <p className="text-lg text-muted-foreground">Исследуйте мир с нашими самыми популярными и высоко оцененными турами.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {tours.map((tour, index) => (
                                    <div key={index} className="group flex flex-col">
                                        <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                            <Image
                                                src={tour.galleryImageUrls[0]}
                                                alt={tour.name}
                                                width={600}
                                                height={400}
                                                className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                                                data-ai-hint={tour.type}
                                            />
                                            <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span>{(tour.relevanceScore / 20).toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex flex-col flex-grow">
                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                <MapPin className="w-4 h-4 mr-1.5" />
                                                {tour.location}
                                            </div>
                                            <h3 className="font-bold font-headline text-xl mb-3 text-foreground flex-grow group-hover:text-primary transition-colors">{tour.name}</h3>
                                            <div className="flex justify-between items-center mt-auto">
                                                <p className="text-lg font-bold text-foreground">
                                                    {tour.priceRange}
                                                </p>
                                                <div className="text-sm text-muted-foreground">{tour.duration}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="housing">
                             <div className="text-center py-12 text-muted-foreground">Здесь скоро будут предложения по жилью.</div>
                        </TabsContent>
                        <TabsContent value="restaurants">
                             <div className="text-center py-12 text-muted-foreground">Здесь скоро будут предложения по кафе и ресторанам.</div>
                        </TabsContent>
                        <TabsContent value="activities">
                             <div className="text-center py-12 text-muted-foreground">Здесь скоро будут предложения по развлечениям.</div>
                        </TabsContent>
                        <TabsContent value="rental-car">
                             <div className="text-center py-12 text-muted-foreground">Здесь скоро будут предложения по аренде авто.</div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

             <section className="py-16 lg:py-24 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                       <div className="relative aspect-[4/5] max-w-md mx-auto">
                         <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-primary/30 transform -rotate-3 transition-transform group-hover:rotate-0"></div>
                         <Image
                            src={whyUsImage?.imageUrl || 'https://picsum.photos/seed/why-us/800/1000'}
                            alt={whyUsImage?.description || 'Happy traveler'}
                            width={800}
                            height={1000}
                            className="relative object-cover rounded-2xl w-full h-full shadow-2xl"
                            data-ai-hint={whyUsImage?.imageHint || 'happy traveler'}
                         />
                       </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">Почему выбирают нас?</h2>
                            <p className="text-lg text-muted-foreground mb-8">Мы создаем незабываемые впечатления, сочетая экспертные знания и индивидуальный подход к каждому клиенту.</p>
                            <div className="space-y-6">
                                {whyChooseUsItems.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Популярные направления</h2>
                        <p className="text-lg text-muted-foreground">Откройте для себя самые востребованные уголки мира, которые ждут вашего визита.</p>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {destinations.map((destination, index) => (
                                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                                    <div className="p-1">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden group shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                            <Image
                                                src={destination.image?.imageUrl || `https://picsum.photos/seed/${destination.name}/600/800`}
                                                alt={destination.image?.description || destination.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                data-ai-hint={destination.image?.imageHint || destination.name.toLowerCase()}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-6">
                                                <h3 className="font-bold font-headline text-2xl text-white">{destination.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                    </Carousel>
                </div>
            </section>
        </>
    );
}
